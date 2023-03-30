import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@asi309kanban/common';

export const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use('/api/tasks', (req, res) => {
  return res.json({
    message: 'Tasks api is running',
  });
});

app.use(currentUser);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);
