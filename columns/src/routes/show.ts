import express, { NextFunction, Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@asi309kanban/common';

import { Column } from '../models/column';

const router = express.Router();

router.get(
  '/api/columns/by-board/:boardid',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const columns = await Column.find({
      boardid: req.params.boardid,
      userid: req.currentUser!.id,
    });

    if (!columns) return next(new NotFoundError());

    return res.send(columns);
  }
);

export { router as showColumnRouter };
