import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@asi309kanban/common';

import { currentUserRouter } from './routes/currentUser';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';

export const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);
