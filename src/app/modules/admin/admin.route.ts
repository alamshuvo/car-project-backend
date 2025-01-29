import { Router } from 'express';
import { AdminControllers } from './admin.controller';
import { BlogControllers } from '../product/product.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.patch('/users/:userId/block', AdminControllers.blockAnUser);

router.delete('/blogs/:id', auth('admin'), BlogControllers.deleteBlog);

export const AdminRoutes = router;
