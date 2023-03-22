import request from 'supertest';

import { app } from '../../app';

it('finds board by id created by logged in user', async () => {
  const cookie = global.signin();

  const board1 = await request(app)
    .post('/api/boards')
    .set('Cookie', cookie)
    .send({
      name: 'test',
    })
    .expect(201);

  // Check if we get this board back
  const response = await request(app)
    .get(`/api/boards/${board1.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.name).toEqual(board1.body.name);
  expect(response.body.id).toEqual(board1.body.id);
});

it('finds board by id only if user is the owner', async () => {
  const board1 = await request(app)
    .post('/api/boards')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
    })
    .expect(201);

  // We should not be getting this board
  await request(app)
    .get(`/api/boards/${board1.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});

it('should not allow unauthenticated access', async () => {
  const response = await request(app)
    .post('/api/boards')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
    })
    .expect(201);

  await request(app).get(`/api/boards/${response.body.id}`).send().expect(401);
});
