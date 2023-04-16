import express, { NextFunction, Request, Response } from 'express';
import { NotFoundError, requireAuth } from '@asi309kanban/common';

import { Task } from '../models/task';

const router = express.Router();

router.get(
  '/api/tasks/by-column/:columnId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await Task.find({
      columnId: req.params.columnId,
      userId: req.currentUser!.id,
      parent: undefined,
    });

    if (!tasks) return next(new NotFoundError());

    return res.send(tasks);
  }
);

router.get(
  '/api/tasks/by-task/:taskId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await Task.find({
      parent: req.params.taskId,
      userId: req.currentUser!.id,
      columnId: undefined,
    });

    if (!tasks) return next(new NotFoundError());

    return res.send(tasks);
  }
);

export { router as showTaskRouter };
