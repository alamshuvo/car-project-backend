import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentControllers } from './payment.controller';
import { PaymentValidations } from './payment.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create',
  auth('user'),
  validateRequest(PaymentValidations.createPaymentSchema),
  PaymentControllers.createPayment,
);

router.get(
  '/verify',
  // validateRequest(PaymentValidations.createPaymentVerificationSchema),
  PaymentControllers.verifyPayment,
);

export const PaymentRoutes = router;
