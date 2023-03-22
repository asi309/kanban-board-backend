import request from 'supertest';

import { app } from '../../app';

it('allows update on board only by owner', async () => {
  const cookie = global.signin();

  const board1 = await request(app)
    .post('/api/boards')
    .set('Cookie', cookie)
    .send({
      name: 'test',
    })
    .expect(201);

  // Check if we get can update board
  const response = await request(app)
    .put(`/api/boards/${board1.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'test board',
    })
    .expect(200);

  expect(response.body.name).toEqual('test board');

  // We should not be able to update
  await request(app)
    .put(`/api/boards/${board1.body.id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'testing',
    })
    .expect(401);
});

it('should not allow unauthenticated access', async () => {
  const board1 = await request(app)
    .post('/api/boards')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
    })
    .expect(201);
  await request(app).put(`/api/boards/${board1.body.id}`).send().expect(401);
});
