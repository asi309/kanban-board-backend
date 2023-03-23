import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@asi309kanban/common';

import { Board } from '../models/board';

const router = express.Router();

router.delete(
  '/api/boards/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const board = await Board.findById(req.params.id);

    if (!board) {
      console.log('Satisfied');
      next(new NotFoundError());
      return;
    }

    if (board.userId !== req.currentUser!.id) {
      next(new NotAuthorizedError());
      return;
    }

    await board.deleteOne();

    return res.status(204).send();
  }
);

export { router as deleteBoardRouter };
