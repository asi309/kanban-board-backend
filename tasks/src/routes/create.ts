import express, { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  BadRequestError,
  validateRequest,
} from '@asi309kanban/common';

import { Task } from '../models/task';

const router = express.Router();

router.post(
  '/api/tasks',
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
    const { title } = req.body;
    const description = req.body?.description;
    const userId = req.currentUser!.id;
    const columnId = req.body?.columnId;
    const parent = req.body?.parent;

    // Check if one of columnId and parent is valid
    if (!columnId && !parent) {
      next(
        new BadRequestError(
          'Task can be created under a column or another task'
        )
      );
    }

    // check if task already exists
    const existingTask = await Task.findOne({
      title,
      columnId,
      parent,
      userId,
    });

    if (existingTask) {
      return next(
        new BadRequestError('You already have a task with this name')
      );
    }

    const task = Task.build({ title, description, columnId, parent, userId });
    await task.save();

    return res.status(201).send(task);
  }
);

export { router as createTaskRouter };
