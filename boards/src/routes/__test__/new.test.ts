import request from 'supertest';

import { app } from '../../app';

it('creates a new board', async () => {
  const cookie = await global.signin();

  const boardName = 'testBoard';

  const response = await request(app)
    .post('/api/boards')
    .set('Cookie', cookie)
    .send({
      name: boardName,
    })
    .expect(201);

  expect(response.body.name).toEqual(boardName);
});

it('does not allow 2 boards with same name for same user', async () => {
  const cookie = await global.signin();

  const boardName = 'testBoard';

  await request(app)
    .post('/api/boards')
    .set('Cookie', cookie)
    .send({
      name: boardName,
    })
    .expect(201);

  await request(app)
    .post('/api/boards')
    .set('Cookie', cookie)
    .send({
      name: boardName,
    })
    .expect(400);

  await request(app)
    .post('/api/boards')
    .set('Cookie', global.signin())
    .send({
      name: boardName,
    })
    .expect(201);
});

it('does not allow board creation if not authenticated', async () => {
  const boardName = 'testBoard';

  await request(app)
    .post('/api/boards')
    .send({
      name: boardName,
    })
    .expect(401);
});
