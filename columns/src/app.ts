import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@asi309kanban/common';

import { createColumnRouter } from './routes/create';

export const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.get('/api/columns', (req, res) => {
  return res.json({
    status: 'Columns api OK',
  });
});

app.use(currentUser);
app.use(createColumnRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);
