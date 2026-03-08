import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Readable, Writable } from 'node:stream';
import { EventEmitter } from 'node:events';

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

const runIntegrationTests = process.env.RUN_MMA_INTEGRATION === 'true';

function registerIntegrationTests() {
  class MockRequest extends Readable {
    constructor({ method, url, body }) {
      super();
      this.method = method;
      this.url = url;
      this.headers = body ? { 'content-type': 'text/plain' } : {};
      this.body = body ?? undefined;
      this.socket = new EventEmitter();
      this.connection = this.socket;
    }

    _read() {
      this.push(null);
    }

    get(name) {
      return this.headers?.[name.toLowerCase()];
    }
  }

  function createMockRequest({ method, url, body }) {
    return new MockRequest({ method, url, body });
  }

  class MockResponse extends Writable {
    constructor() {
      super();
      this.statusCode = 200;
      this.headers = {};
      this.chunks = [];
      this.headersSent = false;
    }

    _write(chunk, encoding, callback) {
      this.chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
      callback();
    }

    setHeader(name, value) {
      this.headers[name.toLowerCase()] = value;
    }

    getHeader(name) {
      return this.headers[name.toLowerCase()];
    }

    removeHeader(name) {
      delete this.headers[name.toLowerCase()];
    }

    writeHead(statusCode, headers = {}) {
      this.statusCode = statusCode;
      Object.entries(headers).forEach(([key, value]) => this.setHeader(key, value));
    }

    status(code) {
      this.statusCode = code;
      return this;
    }

    json(payload) {
      if (!this.headers['content-type']) {
        this.setHeader('content-type', 'application/json');
      }
      this.send(payload);
      return this;
    }

    send(payload) {
      if (payload === undefined) {
        super.end();
        return this;
      }

      const chunk = typeof payload === 'object' ? JSON.stringify(payload) : String(payload);
      if (!this.headers['content-type'] && typeof payload === 'object') {
        this.setHeader('content-type', 'application/json');
      }
      super.write(chunk, 'utf8', () => {});
      super.end();
      this.headersSent = true;
      return this;
    }

    write(chunk, encoding, callback) {
      this.headersSent = true;
      return super.write(chunk, encoding, callback);
    }

    end(chunk) {
      if (chunk !== undefined) {
        super.write(chunk, 'utf8', () => {});
      }
      super.end();
    }

    flushHeaders() {
      this.headersSent = true;
    }

    _getJSONData() {
      const buffer = Buffer.concat(this.chunks);
      const text = buffer.toString('utf8');
      if (!text) return null;
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    }
  }

  async function sendRequest({ method, url, body }) {
    const req = createMockRequest({ method, url, body });
    const res = new MockResponse();

    await new Promise((resolve) => {
      res.once('finish', () => resolve(res));
      app.handle(req, res);
    });

    return res;
  }

  // GET /mma/getMmaMatches

  describe('GET /mma/getMmaMatches', () => {
    beforeEach(() => vi.clearAllMocks());

    it('responds 200 with an array of matches', async () => {
      const fakeMatches = [
        { matchId: 1, fighterOne: 'Alice', fighterTwo: 'Bob' },
      ];
      mockDb.query.mockResolvedValueOnce(fakeMatches);

      const res = await sendRequest({ method: 'GET', url: '/mma/getMmaMatches' });

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(fakeMatches);
    });

    it('responds 500 when the database fails', async () => {
      mockDb.query.mockRejectedValueOnce(new Error('DB down'));

      const res = await sendRequest({ method: 'GET', url: '/mma/getMmaMatches' });

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ error: 'Failed to fetch MMA matches' });
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
      const res = await sendRequest({
        method: 'POST',
        url: '/mma/postMmaMatch',
        body: { ...validBody, fighterOne: { name: '' } },
      });

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: 'Both fighter names are required.' });
    });

    it('responds 400 when location is missing', async () => {
      const res = await sendRequest({
        method: 'POST',
        url: '/mma/postMmaMatch',
        body: { ...validBody, location: '' },
      });

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ error: 'Match location is required.' });
    });

    it('responds 201 and saves the match end-to-end', async () => {
      mockDb.query.mockResolvedValueOnce([{ fighterId: 1 }]); // find Alice
      mockDb.query.mockResolvedValueOnce([{ fighterId: 2 }]); // find Bob
      mockDb.query.mockResolvedValueOnce([[1]]);               // INSERT

      const res = await sendRequest({
        method: 'POST',
        url: '/mma/postMmaMatch',
        body: validBody,
      });

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({ message: 'MMA Match Saved' });
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('responds 500 and rolls back when the insert fails', async () => {
      mockDb.query.mockResolvedValueOnce([{ fighterId: 1 }]);
      mockDb.query.mockResolvedValueOnce([{ fighterId: 2 }]);
      mockDb.query.mockRejectedValueOnce(new Error('Insert failed'));

      const res = await sendRequest({
        method: 'POST',
        url: '/mma/postMmaMatch',
        body: validBody,
      });

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ error: 'Failed to save MMA match' });
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
