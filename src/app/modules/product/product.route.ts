import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ProductControllers } from './product.controller';
import { ProductValidations } from './product.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(ProductValidations.createProductSchema),
  ProductControllers.createOne,
);

router.get('/', ProductControllers.getAll);
router.get('/:id', ProductControllers.getOne);

router.patch(
  '/:id',
  validateRequest(ProductValidations.updateProductSchema),
  ProductControllers.updateOne,
);

router.delete('/:id', ProductControllers.deleteOne);

export const ProductRoutes = router;
