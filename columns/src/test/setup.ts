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
  process.env.JWT_KEY = 'sjdhfbsdg';
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

global.signin = () => {
  //* Create payload
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  //* Sign jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //* Create session object
  const session = { jwt: token };
  //* Convert to JSON
  const sessionJSON = JSON.stringify(session);
  //* Encode JSON to base-64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //* Return cookie string
  return [`express:sess=${base64}`];
};
