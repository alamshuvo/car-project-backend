import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { BillingAddressControllers } from './billingAddress.controller';
import { BillingAddressValidations } from './billingAddress.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/all', BillingAddressControllers.getAll);
router.get('/', auth('user'), BillingAddressControllers.getOne);

router.patch(
  '/:id',
  validateRequest(BillingAddressValidations.updateBillingAddressSchema),
  BillingAddressControllers.updateOne,
);

router.delete('/:id', BillingAddressControllers.deleteOne);

export const BillingAddressRoutes = router;
