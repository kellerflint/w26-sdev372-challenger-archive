import { vi, describe, it, expect, beforeEach } from 'vitest';

const { mockDb, mockTransaction } = vi.hoisted(() => {
  const mockTransaction = {
    commit: vi.fn().mockResolvedValue(undefined),
    rollback: vi.fn().mockResolvedValue(undefined),
  };
  const mockDb = {
    query: vi.fn(),
    transaction: vi.fn().mockResolvedValue(mockTransaction),
  };
  return { mockDb, mockTransaction };
});

vi.mock('../db/db.js', () => ({ default: mockDb }));

import { getMmaMatches, getMmaLeaderboard, postMMA } from '../controllers/mmaController.js';

function mockRes() {
  const res = {};
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  return res;
}


describe('getMmaMatches', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns matches from the database with status 200', async () => {
    const fakeMatches = [
      { matchId: 1, fighterOne: 'Alice', fighterTwo: 'Bob' },
    ];
    mockDb.query.mockResolvedValueOnce(fakeMatches);

    const req = {};
    const res = mockRes();

    await getMmaMatches(req, res);

    expect(res.json).toHaveBeenCalledWith(fakeMatches);
  });

  it('returns 500 when the database query fails', async () => {
    mockDb.query.mockRejectedValueOnce(new Error('DB down'));

    const req = {};
    const res = mockRes();

    await getMmaMatches(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch MMA matches' });
  });
});


describe('getMmaLeaderboard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns normalized leaderboard rows', async () => {
    const fakeRows = [
      {
        fighterId: 1,
        firstName: 'Alice',
        totalMetric: '42',
        matchId: 10,
        matchFighters: 'Alice vs Bob',
        fighterOneId: 1,
        fighterTwoId: 2,
        fighterOneHeadHits: 3,
        fighterTwoHeadHits: 1,
        fighterOneBodyHits: 2,
        fighterTwoBodyHits: 4,
        fighterOneDodges: 5,
        fighterTwoDodges: 2,
        fighterOneBlocks: 1,
        fighterTwoBlocks: 3,
        fighterOneNotes: '',
        fighterTwoNotes: '',
        matchDate: '2026-01-01',
        location: 'Kent',
        fighterOne: 'Alice',
        fighterTwo: 'Bob',
      },
    ];
    mockDb.query.mockResolvedValueOnce(fakeRows);

    const req = {};
    const res = mockRes();

    await getMmaLeaderboard(req, res);

    const [result] = res.json.mock.calls[0][0];
    expect(result.totalMetric).toBe(42);          
    expect(result.recentMatch.matchId).toBe(10);  
    expect(result.matchId).toBeUndefined();        
  });

  it('returns a null recentMatch when matchId is absent', async () => {
    const fakeRows = [
      { fighterId: 2, firstName: 'Charlie', totalMetric: '0', matchId: null },
    ];
    mockDb.query.mockResolvedValueOnce(fakeRows);

    const res = mockRes();
    await getMmaLeaderboard({}, res);

    const [result] = res.json.mock.calls[0][0];
    expect(result.recentMatch).toBeNull();
  });

  it('returns 500 when the database query fails', async () => {
    mockDb.query.mockRejectedValueOnce(new Error('DB down'));

    const res = mockRes();
    await getMmaLeaderboard({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch mma leaderboard' });
  });
});


describe('postMMA', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 when fighter names are missing', async () => {
    const req = { body: { fighterOne: {}, fighterTwo: { name: 'Bob' }, location: 'Kent' } };
    const res = mockRes();

    await postMMA(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Both fighter names are required.' });
  });

  it('returns 400 when location is missing', async () => {
    const req = {
      body: { fighterOne: { name: 'Alice' }, fighterTwo: { name: 'Bob' }, location: '' },
    };
    const res = mockRes();

    await postMMA(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Match location is required.' });
  });

  it('saves the match and returns 201 on success', async () => {
    // findFighter for Alice → found (id 1)
    mockDb.query.mockResolvedValueOnce([{ fighterId: 1 }]);
    // findFighter for Bob → found (id 2)
    mockDb.query.mockResolvedValueOnce([{ fighterId: 2 }]);
    // INSERT mmaMatches
    mockDb.query.mockResolvedValueOnce([[1]]);

    const req = {
      body: {
        fighterOne: { name: 'Alice', headHits: 3, bodyHits: 2, dodges: 1, blocks: 0, notes: '' },
        fighterTwo: { name: 'Bob', headHits: 1, bodyHits: 4, dodges: 2, blocks: 3, notes: '' },
        matchDate: '2026-01-15T18:00',
        location: 'Kent',
      },
    };
    const res = mockRes();

    await postMMA(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'MMA Match Saved' });
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it('rolls back the transaction and returns 500 when insert fails', async () => {
    mockDb.query.mockResolvedValueOnce([{ fighterId: 1 }]); // findFighter Alice
    mockDb.query.mockResolvedValueOnce([{ fighterId: 2 }]); // findFighter Bob
    mockDb.query.mockRejectedValueOnce(new Error('Insert failed'));

    const req = {
      body: {
        fighterOne: { name: 'Alice', headHits: 0, bodyHits: 0, dodges: 0, blocks: 0, notes: '' },
        fighterTwo: { name: 'Bob', headHits: 0, bodyHits: 0, dodges: 0, blocks: 0, notes: '' },
        location: 'Kent',
      },
    };
    const res = mockRes();

    await postMMA(req, res);

    expect(mockTransaction.rollback).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to save MMA match' });
  });
});
