import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
  var getCookie: () => Promise<string[]>;
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'sndghb';
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getCookie = async () => {
  const email = 'test@test.com';
  const password = 'password1234';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};

global.signin = () => {
  //* Create payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  //* Create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //* Build session object
  const session = { jwt: token };

  //* Convert to json
  const sessionJSON = JSON.stringify(session);

  //* Base-64 encode
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //* return the cookie data
  return [`express:sess=${base64}`];
};
