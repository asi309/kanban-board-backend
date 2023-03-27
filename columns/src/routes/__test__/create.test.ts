import request from 'supertest';

import { app } from '../../app';

it('should create a new column for a user under the supplied board', async () => {
  const response = await request(app)
    .post('/api/columns')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
      boardid: 'qwerty',
    })
    .expect(201);

  expect(response.body.name).toEqual('test');
});

it('should not create a new column for user under the board if board already contains column with same name', async () => {
  const cookie = global.signin();
  const boardid = 'uqeyruge';
  const column1 = await request(app)
    .post('/api/columns')
    .set('Cookie', cookie)
    .send({
      name: 'test',
      boardid,
    })
    .expect(201);
  const column2 = await request(app)
    .post('/api/columns')
    .set('Cookie', cookie)
    .send({
      name: 'test',
      boardid,
    })
    .expect(400);

  await request(app)
    .post('/api/columns')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
      boardid,
    })
    .expect(201);
});

it('should not create a new column if not authenticated', async () => {
  await request(app)
    .post('/api/columns')
    .send({
      name: 'test',
      boardid: '2hhjbTGU4',
    })
    .expect(401);
});
