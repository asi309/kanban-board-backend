import request from 'supertest';

import { app } from '../../app';

it('should update the column with column id if user created it', async () => {
  const cookie = global.signin();

  const col1 = await request(app)
    .post('/api/columns')
    .set('Cookie', cookie)
    .send({
      name: 'test',
      boardid: 'qerjwebg',
    })
    .expect(201);

  const response = await request(app)
    .put(`/api/columns/${col1.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'test123',
      boardid: 'qerjwebg',
    })
    .expect(200);

  expect(response.body.name).toEqual('test123');
});

it('should not update the column with column id if user did not create it', async () => {
  const col1 = await request(app)
    .post('/api/columns')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
      boardid: 'qerjwebg',
    })
    .expect(201);

  await request(app)
    .put(`/api/columns/${col1.body.id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'tstg21qt',
      boardid: 'qerjwebg',
    })
    .expect(401);
});

it('should prevent unauthorized access', async () => {
  const col1 = await request(app)
    .post('/api/columns')
    .set('Cookie', global.signin())
    .send({
      name: 'test',
      boardid: 'qerjwebg',
    })
    .expect(201);

  await request(app)
    .put(`/api/columns/${col1.body.id}`)
    .send({
      name: 'tstg21qt',
      boardid: 'qerjwebg',
    })
    .expect(401);
});
