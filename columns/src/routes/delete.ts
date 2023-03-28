import express, { Request, Response, NextFunction } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@asi309kanban/common';

import { Column } from '../models/column';

const router = express.Router();

router.delete(
  '/api/columns/:id',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const column = await Column.findById(req.params.id);

    if (!column) return next(new NotFoundError());

    if (column.userid !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    await column.deleteOne();

    return res.status(204).send();
  }
);

export { router as deleteColumnRouter };
