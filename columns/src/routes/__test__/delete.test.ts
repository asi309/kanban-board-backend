import request from 'supertest';

import { app } from '../../app';

it('should delete a column owned by user', async () => {
  const cookie = global.signin();

  const col1 = await request(app)
    .post('/api/columns')
    .set('Cookie', cookie)
    .send({
      name: 'test',
      boardid: 'qwerty',
    })
    .expect(201);

  await request(app)
    .delete(`/api/columns/${col1.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);
});

it('should not delete a column not owned by user', async () => {
  const col1 = await request(app)
    .post('/api/columns')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
      boardid: 'qwerty',
    })
    .expect(201);

  await request(app)
    .delete(`/api/columns/${col1.body.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});

it('should not allow unauthorized access', async () => {
  const col1 = await request(app)
    .post('/api/columns')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
      boardid: 'qwerty',
    })
    .expect(201);

  await request(app).delete(`/api/columns/${col1.body.id}`).send().expect(401);
});
