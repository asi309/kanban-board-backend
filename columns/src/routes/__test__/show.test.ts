import request from 'supertest';

import { app } from '../../app';

it('should show the columns created by user under a board', async () => {
  const cookie = global.signin();
  const boardid = 'sjhkdh';

  const column1 = await request(app)
    .post('/api/columns')
    .set('Cookie', cookie)
    .send({
      name: 'test',
      boardid,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/columns?boardid=${boardid}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body).toHaveLength(1);
});

it('should not show the columns created by any other user', async () => {
  const cookie = global.signin();
  const boardid = 'sjhkdh';

  const column1 = await request(app)
    .post('/api/columns')
    .set('Cookie', cookie)
    .send({
      name: 'test',
      boardid,
    })
    .expect(201);

  await request(app)
    .get(`/api/columns?boardid=${boardid}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});

it('should prevent unauthorized access', async () => {
  await request(app).get('/api/columns').send().expect(401);
});