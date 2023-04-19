import request from 'supertest';

import { app } from '../../app';

it('should delete a task owned by user', async () => {
  const cookie = global.signin();

  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      description: 'hello world',
      columnId: 'ahsdghf',
    })
    .expect(201);

  await request(app)
    .delete(`/api/tasks/${task1.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);
});

it('should not delete a column not owned by user', async () => {
  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      columnId: 'qwerty',
    })
    .expect(201);

  await request(app)
    .delete(`/api/tasks/${task1.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});

it('should not allow unauthorized access', async () => {
  const task1 = await request(app)
    .post('/api/tasks')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      columnId: 'qwerty',
    })
    .expect(201);

  await request(app).delete(`/api/tasks/${task1.body.id}`).send().expect(401);
});
