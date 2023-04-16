import request from 'supertest';

import { app } from '../../app';

it('should show the tasks created under a column by a user', async () => {
  const cookie = global.signin();
  const columnId = 'j2hehqa82fmnke';

  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'Hello World',
      description: 'Describe hello',
      columnId,
    })
    .expect(201);

  const task2 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'Hello World',
      description: 'Describe hello',
      columnId: 'qweeuryut',
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/tasks/by-column/${columnId}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body).toHaveLength(1);
});

it('should show the tasks created under a task by a user', async () => {
  const cookie = global.signin();

  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'Hello World',
      description: 'Describe hello',
      columnId: 'qwerty',
    })
    .expect(201);

  const task2 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'Hello World',
      description: 'Describe hello',
      parent: task1.body.id,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/tasks/by-task/${task1.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body).toHaveLength(1);
});

it('should not allow unauthorized access', async () => {
  await request(app).get('/api/tasks/by-column/3h4b3b4').send().expect(401);
  await request(app).get('/api/tasks/by-task/3h4b3b4').send().expect(401);
});
