import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@asi309kanban/common';

import { Column } from '../models/column';

const router = express.Router();

router.put(
  '/api/columns/:id',
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
    const column = await Column.findById(req.params.id);

    if (!column) {
      return next(new NotFoundError());
    }

    if (column.userid !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    column.set('name', req.body.name);
    await column.save();

    return res.send(column);
  }
);

export { router as updateColumnRouter };
