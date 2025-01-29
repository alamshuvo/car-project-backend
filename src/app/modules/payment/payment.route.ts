import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentControllers } from './payment.controller';
import { PaymentValidations } from './payment.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(PaymentValidations.createPaymentSchema),
  PaymentControllers.createOne,
);

router.get('/', PaymentControllers.getAll);
router.get('/:id', PaymentControllers.getOne);

router.patch(
  '/:id',
  validateRequest(PaymentValidations.updatePaymentSchema),
  PaymentControllers.updateOne,
);

router.delete('/:id', PaymentControllers.deleteOne);

export const PaymentRoutes = router;
