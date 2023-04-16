import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@asi309kanban/common';
import { createTaskRouter } from './routes/create';
import { indexTaskRouter } from './routes';
import { showTaskRouter } from './routes/show';
import { updateTaskRouter } from './routes/update';

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
app.use(createTaskRouter);
app.use(indexTaskRouter);
app.use(showTaskRouter);
app.use(updateTaskRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);
