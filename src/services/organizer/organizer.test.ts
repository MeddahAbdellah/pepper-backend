import request from 'supertest';
import app from 'index';
import httpStatus from 'http-status';

describe('Should call organizer route', () => {
  test('should do something', async () => {
    await request(app).post('/api/organizer/login').send({ test: 'data'}).expect(httpStatus.BAD_REQUEST);
  });
});