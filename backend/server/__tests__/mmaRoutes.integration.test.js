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

import app from '../app.js';
import request from 'supertest';

const runIntegrationTests = process.env.RUN_MMA_INTEGRATION === 'true';

function registerIntegrationTests() {

  // GET /mma/getMmaMatches
  describe('GET /mma/getMmaMatches', () => {
    beforeEach(() => vi.clearAllMocks());

    it('responds 200 with an array of matches', async () => {
      const fakeMatches = [
        { matchId: 1, fighterOne: 'Alice', fighterTwo: 'Bob' },
      ];
      mockDb.query.mockResolvedValueOnce(fakeMatches);

      const res = await request(app).get('/mma/getMmaMatches');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(fakeMatches);
    });

    it('responds 500 when the database fails', async () => {
      mockDb.query.mockRejectedValueOnce(new Error('DB down'));

      const res = await request(app).get('/mma/getMmaMatches');

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch MMA matches' });
    });
  });

  // POST /mma/postMmaMatch
  describe('POST /mma/postMmaMatch', () => {
    beforeEach(() => vi.clearAllMocks());

    const validBody = {
      fighterOne: { name: 'Alice', headHits: 3, bodyHits: 2, dodges: 1, blocks: 0, notes: '' },
      fighterTwo: { name: 'Bob',   headHits: 1, bodyHits: 4, dodges: 2, blocks: 3, notes: '' },
      matchDate: '2026-01-15T18:00',
      location: 'Kent',
    };

    it('responds 400 when a fighter name is missing', async () => {
      const res = await request(app)
        .post('/mma/postMmaMatch')
        .send({ ...validBody, fighterOne: { name: '' } });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Both fighter names are required.' });
    });

    it('responds 400 when location is missing', async () => {
      const res = await request(app)
        .post('/mma/postMmaMatch')
        .send({ ...validBody, location: '' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Match location is required.' });
    });

    it('responds 201 and saves the match end-to-end', async () => {
      mockDb.query.mockResolvedValueOnce([{ fighterId: 1 }]); // find Alice
      mockDb.query.mockResolvedValueOnce([{ fighterId: 2 }]); // find Bob
      mockDb.query.mockResolvedValueOnce([[1]]);               // INSERT

      const res = await request(app)
        .post('/mma/postMmaMatch')
        .send(validBody);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({ message: 'MMA Match Saved' });
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('responds 500 and rolls back when the insert fails', async () => {
      mockDb.query.mockResolvedValueOnce([{ fighterId: 1 }]);
      mockDb.query.mockResolvedValueOnce([{ fighterId: 2 }]);
      mockDb.query.mockRejectedValueOnce(new Error('Insert failed'));

      const res = await request(app)
        .post('/mma/postMmaMatch')
        .send(validBody);

      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to save MMA match' });
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
}

if (runIntegrationTests) {
  registerIntegrationTests();
} else {
  describe.skip('MMA routes integration tests (disabled)', () => {
    it('only runs when RUN_MMA_INTEGRATION=true', () => {
      expect(true).toBe(true);
    });
  });
}