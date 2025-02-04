import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CartControllers } from './cart.controller';
import { CartValidations } from './cart.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(CartValidations.createCartSchema),
  CartControllers.addToCart,
);

router.get('/', CartControllers.getCart);

router.delete('/:id', CartControllers.removeFromCart);
router.delete('/', CartControllers.clearCart);

export const CartRoutes = router;
