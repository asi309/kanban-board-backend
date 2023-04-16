import request from 'supertest';

import { app } from '../../app';

it('should update the task with task id if user created it', async () => {
  const cookie = global.signin();

  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      columnId: 'qerjwebg',
    })
    .expect(201);

  const response = await request(app)
    .put(`/api/tasks/${task1.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test123',
    })
    .expect(200);

  expect(response.body.title).toEqual('test123');
});

it('should not update the task with task id if user did not create it', async () => {
  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      columnId: 'qerjwebg',
    })
    .expect(201);

  await request(app)
    .put(`/api/tasks/${task1.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'tstg21qt',
      columnId: 'qerjwebg',
    })
    .expect(401);
});

it('should not update if both columnId and parent are provided', async () => {
  const cookie = global.signin();

  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      columnId: 'qerjwebg',
    })
    .expect(201);

  await request(app)
    .put(`/api/tasks/${task1.body.id}`)
    .set('Cookie', cookie)
    .send({
      columnId: 'jqwehrwvb',
      parent: 'jaehruhdgu',
    })
    .expect(400);
});

it('should prevent unauthorized access', async () => {
  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      columnId: 'qerjwebg',
    })
    .expect(201);

  await request(app)
    .put(`/api/tasks/${task1.body.id}`)
    .send({
      title: 'tstg21qt',
      columnId: 'qerjwebg',
    })
    .expect(401);
});
