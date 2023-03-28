import express, { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@asi309kanban/common';

import { Column } from '../models/column';

const router = express.Router();

router.get(
  '/api/columns',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    // Find all the columns created by user
    const columns = await Column.find({ userid: req.currentUser!.id });

    return res.send(columns);
  }
);

export { router as indexColumnrouter };
