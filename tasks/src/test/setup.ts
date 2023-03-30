import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'ebhwbrew';
  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  mongoose.connect(mongoUri);
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

global.signin = () => {
  //* Create a payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  //* Create jwt token
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //* Build session object
  const session = { jwt: token };

  //* Convert to json
  const sessionJSON = JSON.stringify(session);

  //* Base-64 encode
  const encoded = Buffer.from(sessionJSON).toString('base64');

  //* return cookie data
  return [`express:sess=${encoded}`];
};
