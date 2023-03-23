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

router.put(
  '/api/boards/:id',
  requireAuth,
  [
    body('name')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Please enter a name for the board'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const board = await Board.findById(req.params.id);

    if (!board) {
      next(new NotFoundError());
      return;
    }

    if (board.userId !== req.currentUser!.id) {
      next(new NotAuthorizedError());
      return;
    }

    board.set('name', req.body.name);

    // Save the new board
    await board.save();

    return res.send(board);
  }
);

export { router as updateBoardRouter };
