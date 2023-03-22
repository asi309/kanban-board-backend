import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@asi309kanban/common';
import { Board } from '../models/board';

const router = express.Router();

router.post(
  '/api/boards',
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
    const { name } = req.body;

    // Check if board is already present in user's boards
    const existingBoard = await Board.findOne({
      name,
      userId: req.currentUser!.id,
    });

    if (existingBoard) {
      next(new BadRequestError('You already have a board with this name'));
      return;
    }

    const board = Board.build({ name, userId: req.currentUser!.id, tasks: [] });
    await board.save();

    return res.status(201).send(board);
  }
);

export { router as createBoardRouter };
