import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@asi309kanban/common';

import { createColumnRouter } from './routes/create';
import { indexColumnrouter } from './routes';
import { showColumnRouter } from './routes/show';

export const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUser);
app.use(createColumnRouter);
app.use(indexColumnrouter);
app.use(showColumnRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);
