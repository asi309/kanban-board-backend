import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@asi309kanban/common';

import { createBoardRouter } from './routes/new';
import { indexBoardRouter } from './routes';
import { updateBoardRouter } from './routes/update';
import { showBoardRouter } from './routes/show';

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
app.use(createBoardRouter);
app.use(indexBoardRouter);
app.use(showBoardRouter);
app.use(updateBoardRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);
