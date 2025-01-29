import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { paymentControllers } from './payment.controller';
import { paymentValidations } from './payment.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(paymentValidations.createPaymentSchema),
  paymentControllers.createOne,
);

router.get('/', paymentControllers.getAll);
router.get('/:id', paymentControllers.getOne);

router.patch(
  '/:id',
  validateRequest(paymentValidations.updatePaymentSchema),
  paymentControllers.updateOne,
);

router.delete('/:id', paymentControllers.deleteOne);

export const PaymentRoutes = router;
