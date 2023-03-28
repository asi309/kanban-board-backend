import request from 'supertest';

import { app } from '../../app';

it('should show all the columns created by user', async () => {
  const cookie = global.signin();
  const boardId = 'sjhkdh';

  const column1 = await request(app)
    .post('/api/columns')
    .set('Cookie', cookie)
    .send({
      name: 'test',
      boardId,
    })
    .expect(201);

  const response = await request(app)
    .get('/api/columns')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body).toHaveLength(1);
});

it('should prevent unauthorized access', async () => {
  await request(app).get('/api/columns').send().expect(401);
});
