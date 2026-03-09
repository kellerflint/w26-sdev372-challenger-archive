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

import { getPoolMatches, getPoolLeaderboard, postPoolMatch } from '../controllers/poolController.js';

function mockRes() {
  const res = {};
  res.json = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  return res;
}

describe('getPoolMatches', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns pool games from the database', async () => {
    const fakeGames = [{ gameId: 1, playerOne: 'Alice', playerTwo: 'Bob' }];
    mockDb.query.mockResolvedValueOnce(fakeGames);

    const res = mockRes();
    await getPoolMatches({}, res);

    expect(res.json).toHaveBeenCalledWith(fakeGames);
  });

  it('returns 500 when the database query fails', async () => {
    mockDb.query.mockRejectedValueOnce(new Error('DB down'));

    const res = mockRes();
    await getPoolMatches({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch pool games' });
  });
});


describe('getPoolLeaderboard', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns normalized leaderboard rows with winPct as a number', async () => {
    const fakeRows = [
      {
        playerId: 1,
        firstName: 'Alice',
        win: 3,
        loss: 1,
        winPct: '0.75',
        gameId: 5,
        playerOneId: 1,
        playerTwoId: 2,
        playerOneScore: 7,
        playerTwoScore: 3,
        matchDate: '2026-01-01',
        location: 'Kent',
        playerOne: 'Alice',
        playerTwo: 'Bob',
      },
    ];
    mockDb.query.mockResolvedValueOnce(fakeRows);

    const res = mockRes();
    await getPoolLeaderboard({}, res);

    const [result] = res.json.mock.calls[0][0];
    expect(result.winPct).toBe(0.75);           // string → number
    expect(result.recentMatch.gameId).toBe(5);  // recent match included
    expect(result.gameId).toBeUndefined();       // flat match fields stripped from top level
  });

  it('returns a null recentMatch when gameId is absent', async () => {
    const fakeRows = [{ playerId: 2, firstName: 'Charlie', win: 0, loss: 0, winPct: '0', gameId: null }];
    mockDb.query.mockResolvedValueOnce(fakeRows);

    const res = mockRes();
    await getPoolLeaderboard({}, res);

    const [result] = res.json.mock.calls[0][0];
    expect(result.recentMatch).toBeNull();
  });

  it('returns 500 when the database query fails', async () => {
    mockDb.query.mockRejectedValueOnce(new Error('DB down'));

    const res = mockRes();
    await getPoolLeaderboard({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch pool leaderboard' });
  });
});

describe('postPoolMatch', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 400 when player names are missing', async () => {
    const req = { body: { playerOne: {}, playerTwo: { name: 'Bob' } } };
    const res = mockRes();

    await postPoolMatch(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Both player names are required.' });
  });

  it('saves a tied match without updating win/loss and returns 201', async () => {
    mockDb.query.mockResolvedValueOnce([{ playerId: 1 }]); // findPlayer Alice
    mockDb.query.mockResolvedValueOnce([{ playerId: 2 }]); // findPlayer Bob
    mockDb.query.mockResolvedValueOnce([[1]]);              // INSERT poolGames

    const req = {
      body: {
        playerOne: { name: 'Alice', score: 5, shotAtt: 10, shotPot: 5, errors: 2, safeties: 1 },
        playerTwo: { name: 'Bob', score: 5, shotAtt: 8, shotPot: 4, errors: 3, safeties: 0 },
        location: 'Kent',
      },
    };
    const res = mockRes();

    await postPoolMatch(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    // Tied game: win/loss UPDATE queries should NOT have been called
    // Only 3 queries: findPlayer x2 + INSERT
    expect(mockDb.query).toHaveBeenCalledTimes(3);
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it('updates win/loss when there is a winner and returns 201', async () => {
    mockDb.query.mockResolvedValueOnce([{ playerId: 1 }]); // findPlayer Alice
    mockDb.query.mockResolvedValueOnce([{ playerId: 2 }]); // findPlayer Bob
    mockDb.query.mockResolvedValueOnce([[1]]);              // INSERT poolGames
    mockDb.query.mockResolvedValueOnce(undefined);          // UPDATE win for winner
    mockDb.query.mockResolvedValueOnce(undefined);          // UPDATE loss for loser

    const req = {
      body: {
        playerOne: { name: 'Alice', score: 7, shotAtt: 10, shotPot: 7, errors: 1, safeties: 2 },
        playerTwo: { name: 'Bob', score: 3, shotAtt: 8, shotPot: 3, errors: 4, safeties: 1 },
        location: 'Kent',
      },
    };
    const res = mockRes();

    await postPoolMatch(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    // 5 queries: findPlayer x2 + INSERT + win UPDATE + loss UPDATE
    expect(mockDb.query).toHaveBeenCalledTimes(5);
    expect(mockTransaction.commit).toHaveBeenCalled();
  });

  it('rolls back and returns 500 when the insert fails', async () => {
    mockDb.query.mockResolvedValueOnce([{ playerId: 1 }]); // findPlayer Alice
    mockDb.query.mockResolvedValueOnce([{ playerId: 2 }]); // findPlayer Bob
    mockDb.query.mockRejectedValueOnce(new Error('Insert failed'));

    const req = {
      body: {
        playerOne: { name: 'Alice', score: 7, shotAtt: 10, shotPot: 7, errors: 1, safeties: 0 },
        playerTwo: { name: 'Bob', score: 3, shotAtt: 8, shotPot: 3, errors: 2, safeties: 0 },
        location: 'Kent',
      },
    };
    const res = mockRes();

    await postPoolMatch(req, res);

    expect(mockTransaction.rollback).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unable to record pool match' });
  });
});
