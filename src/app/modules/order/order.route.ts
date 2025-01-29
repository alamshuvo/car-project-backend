import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OrderControllers } from './order.controller';
import { OrderValidations } from './order.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(OrderValidations.createOrderSchema),
  OrderControllers.createOne,
);

router.get('/', OrderControllers.getAll);
router.get('/:id', OrderControllers.getOne);

router.patch(
  '/:id',
  validateRequest(OrderValidations.updateOrderSchema),
  OrderControllers.updateOne,
);

router.delete('/:id', OrderControllers.deleteOne);

export const OrderRoutes = router;
