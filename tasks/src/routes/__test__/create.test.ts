import request from 'supertest';

import { app } from '../../app';

it('should create a new task for a user under the supplied column', async () => {
  const response = await request(app)
    .post('/api/tasks')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      description: 'hello world',
      columnId: 'qwerty',
    })
    .expect(201);

  expect(response.body.title).toEqual('test');
  expect(response.body.description).toEqual('hello world');
});

it('should create a new task for a user under the supplied task', async () => {
  const cookie = global.signin();
  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      description: 'hello world',
      columnId: 'qwerty',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'qwerty',
      parent: task1.body.id,
    })
    .expect(201);

  expect(response.body.title).toEqual('qwerty');
  expect(response.body.parent).toEqual(task1.body.id);
});

it('should not create a new task for user under the column if column already contains task with same name', async () => {
  const cookie = global.signin();
  const columnId = 'uqeyruge';
  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      columnId,
    })
    .expect(201);

  const task2 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      description: 'hjhfjkhgsb',
      columnId,
    })
    .expect(400);

  await request(app)
    .post('/api/tasks')
    .set('Cookie', global.signin())
    .send({
      title: 'test1',
      columnId,
    })
    .expect(201);
});

it('should not create a new  if not authenticated', async () => {
  await request(app)
    .post('/api/tasks')
    .send({
      name: 'test',
      boardId: '2hhjbTGU4',
    })
    .expect(401);
});
