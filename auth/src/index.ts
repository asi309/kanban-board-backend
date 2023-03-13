import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
  console.log('Running in auth.... Start script starting');
  try {
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MONGODB');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening on PORT 3000!!');
  });
};

start();
