import request from 'supertest';

import { app } from '../../app';

it('deletes board created by logged in user', async () => {
  const cookie = global.signin();

  const board1 = await request(app)
    .post('/api/boards')
    .set('Cookie', cookie)
    .send({
      name: 'test',
    })
    .expect(201);

  // Other user should not be able to delete
  await request(app)
    .delete(`/api/boards/${board1.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);

  // Delete the board
  await request(app)
    .delete(`/api/boards/${board1.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

  // We should not get back any board
  const nextResponse = await request(app)
    .get('/api/boards')
    .set('Cookie', global.signin())
    .send();

  expect(nextResponse.body).toHaveLength(0);
});

it('should not allow unauthenticated access', async () => {
  const board1 = await request(app)
    .post('/api/boards')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
    })
    .expect(201);

  await request(app).delete(`/api/boards/${board1.body.id}`).send().expect(401);
});
