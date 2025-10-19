import request from 'supertest';
import Application from '../src/app.js';
import database from '../src/config/database.js';
import User from '../src/models/User.js';

describe('Auth API', () => {
  let app;

  beforeAll(async () => {
    app = new Application();
    await app.start();
  });

  afterAll(async () => {
    await database.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app.app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('_id');
      expect(response.body.data.user.username).toBe('testuser');
      expect(response.body.data).toHaveProperty('token');
    });
  });
});
