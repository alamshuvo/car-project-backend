import { Router } from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get(
  '/dashboard-stats',
  auth('admin', 'user'),
  UserControllers.getDashboardStats,
);

export const UserRoutes = router;
