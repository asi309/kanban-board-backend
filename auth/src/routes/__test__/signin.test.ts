import request from 'supertest';

import { app } from '../../app';

it('returns a 400 on invalid email', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'fadjfk',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 on invalid password', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pa',
    })
    .expect(400);
});

it('returns a 400 on invalid email and password', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'fadjfk',
      password: 'pa',
    })
    .expect(400);
});

it('returns a 400 on empty fields passed', async () => {
  return request(app).post('/api/users/signin').send().expect(400);
});

it('fails when an unknown email is used to login', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pass',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'passw123',
    })
    .expect(400);
});

it('responds with a cookie when login succeeds', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
