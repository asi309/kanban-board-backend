import express, { Request, Response } from 'express';
import { requireAuth } from '@asi309kanban/common';

import { Board } from '../models/board';

const router = express.Router();

router.get('/api/boards', requireAuth, async (req: Request, res: Response) => {
  // Find all the boards of the user
  const boards = await Board.find({ userId: req.currentUser!.id });

  return res.send(boards);
});

export { router as indexBoardRouter };
