import express, { NextFunction, Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@asi309kanban/common';

import { Board } from '../models/board';

const router = express.Router();

router.get(
  '/api/boards/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const board = await Board.findById(req.params.id);
    // .populate('tasks');

    if (!board) {
      return next(new NotFoundError());
    }

    if (board.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    return res.send(board);
  }
);

export { router as showBoardRouter };
