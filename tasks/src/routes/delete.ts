import express, { NextFunction, Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@asi309kanban/common';

import { Task } from '../models/task';

const router = express.Router();

router.delete(
  '/api/tasks/:taskId',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findById(req.params.taskId);

    if (!task) return next(new NotFoundError());

    if (task.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    await task.deleteOne();

    return res.status(204).send();
  }
);

export { router as deleteTaskRouter };
