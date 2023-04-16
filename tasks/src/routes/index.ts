import express, { Request, Response } from 'express';
import { requireAuth } from '@asi309kanban/common';

import { Task } from '../models/task';

const router = express.Router();

router.get('/api/tasks', requireAuth, async (req: Request, res: Response) => {
  // Find all the tasks created by user
  const tasks = await Task.find({ userId: req.currentUser!.id });

  return res.send(tasks);
});

export { router as indexTaskRouter };
