import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';

import {
  BadRequestError,
  requireAuth,
  validateRequest,
} from '@asi309kanban/common';
import { Column } from '../models/column';

const router = express.Router();

router.post(
  '/api/columns',
  requireAuth,
  [
    body('name')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Please enter a name for the column'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, boardId } = req.body;

    // Check if column exists
    const existingColumn = await Column.findOne({
      name,
      boardid: boardId,
      userid: req.currentUser!.id,
    });

    if (existingColumn) {
      return next(
        new BadRequestError('You already have a column with this name')
      );
    }

    const column = Column.build({
      name,
      userid: req.currentUser!.id,
      boardid: boardId,
    });
    await column.save();

    return res.status(201).send(column);
  }
);

export { router as createColumnRouter };
