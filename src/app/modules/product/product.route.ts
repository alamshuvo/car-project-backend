import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { productControllers } from './product.controller';
import { productValidations } from './product.validation';

const router = express.Router();

router.post(
  '/create',
  validateRequest(productValidations.createProductSchema),
  productControllers.createOne,
);

router.get('/', productControllers.getAll);
router.get('/:id', productControllers.getOne);

router.patch(
  '/:id',
  validateRequest(productValidations.updateProductSchema),
  productControllers.updateOne,
);

router.delete('/:id', productControllers.deleteOne);

export const ProductRoutes = router;
