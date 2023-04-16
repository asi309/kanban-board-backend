import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
} from '@asi309kanban/common';

import { Task } from '../models/task';

const router = express.Router();

router.put(
  '/api/tasks/:id',
  requireAuth,
  [
    body('title')
      .trim()
      .isString()
      .isLength({ min: 3 })
      .withMessage('Please enter a title for the task'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const title = req.body?.title;
    const description = req.body?.description;
    const columnId = req.body?.columnId;
    const parent = req.body?.parent;

    if (parent && columnId) {
      return next(
        new BadRequestError('Both column id and parent cannot be specified')
      );
    }

    // Check if task with id exists
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(new NotFoundError());
    }

    if (task.userId !== req.currentUser!.id) {
      return next(new NotAuthorizedError());
    }

    title && task.set('title', title);
    description && task.set('description', description);
    if (columnId && !parent) {
      task.set('columnId', columnId);
      task.set('parent', undefined);
    }
    if (parent && !columnId) {
      task.set('parent', parent);
      task.set('columnId', columnId);
    }

    await task.save();

    return res.send(task);
  }
);

export { router as updateTaskRouter };
