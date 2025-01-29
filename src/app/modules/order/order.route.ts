import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { orderControllers } from './order.controller';
import { orderValidations } from './order.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(orderValidations.createOrderSchema),
  orderControllers.createOne,
);

router.get('/', orderControllers.getAll);
router.get('/:id', orderControllers.getOne);

router.patch(
  '/:id',
  validateRequest(orderValidations.updateOrderSchema),
  orderControllers.updateOne,
);

router.delete('/:id', orderControllers.deleteOne);

export const OrderRoutes = router;
