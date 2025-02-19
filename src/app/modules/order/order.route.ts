import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderControllers } from './order.controller';
import { OrderValidations } from './order.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(OrderValidations.createOrderSchema),
  OrderControllers.createOne,
);

router.get('/', auth('user', 'admin'), OrderControllers.getAll);
router.get('/:id', auth('user', 'admin'), OrderControllers.getOne);

router.patch(
  '/:id',
  validateRequest(OrderValidations.updateOrderSchema),
  OrderControllers.updateOne,
);

router.patch(
  '/update-status/:id/',
  validateRequest(OrderValidations.updateOrderStatusSchema),
  OrderControllers.updateStatus,
);

router.delete('/:id', OrderControllers.deleteOne);

export const OrderRoutes = router;
