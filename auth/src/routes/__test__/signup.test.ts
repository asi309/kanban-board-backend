import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  const response = await request(app).post('/api/users/signup').send({
    email: 'test@test.com',
    password: 'password',
  });
  expect(response.status).toEqual(201);
  expect(response.body.id).toBeDefined();
  expect(response.body.email).toBeDefined();
  expect(response.body.email).toEqual('test@test.com');
});

it('returns a 400 on invalid email', async () => {
  const response = await request(app).post('/api/users/signup').send({
    email: 'fadjfk',
    password: 'password',
  });
  expect(response.status).toEqual(400);
  expect(response.body.errors).toBeDefined();
});

it('returns a 400 on invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pa',
    })
    .expect(400);
});

it('returns a 400 on invalid email and password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'fadjfk',
      password: 'pa',
    })
    .expect(400);
});

it('returns a 400 on empty fields passed', async () => {
  return request(app).post('/api/users/signup').send().expect(400);
});

it('disallows duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
