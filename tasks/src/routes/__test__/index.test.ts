import request from 'supertest';

import { app } from '../../app';

it('should show all the tasks created by user', async () => {
  const cookie = global.signin();
  const columnId = 'sjhkdh';

  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      columnId,
    })
    .expect(201);

  const response = await request(app)
    .get('/api/tasks')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body).toHaveLength(1);
});

it('should prevent unauthorized access', async () => {
  await request(app).get('/api/tasks').send().expect(401);
});
