import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { currentUser, errorHandler, NotFoundError } from '@asi309kanban/common';

import { createBoardRouter } from './routes/new';
import { indexBoardRouter } from './routes';
import { updateBoardRouter } from './routes/update';
import { showBoardRouter } from './routes/show';
import { deleteBoardRouter } from './routes/delete';

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

app.use(currentUser);
app.use(createBoardRouter);
app.use(indexBoardRouter);
app.use(showBoardRouter);
app.use(updateBoardRouter);
app.use(deleteBoardRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);
