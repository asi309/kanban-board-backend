import request from 'supertest';

import { app } from '../../app';

it('finds boards created by logged in user', async () => {
  const cookie = global.signin();

  await request(app)
    .post('/api/boards')
    .set('Cookie', cookie)
    .send({
      name: 'test',
    })
    .expect(201);

  // Check if we get one board back
  const response = await request(app)
    .get('/api/boards')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body).toHaveLength(1);

  // We should not get back any board
  const nextResponse = await request(app)
    .get('/api/boards')
    .set('Cookie', global.signin())
    .send();

  expect(nextResponse.body).toHaveLength(0);
});

it('should not allow unauthenticated access', async () => {
  await request(app).get('/api/boards').send().expect(401);
});
