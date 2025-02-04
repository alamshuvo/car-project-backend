import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewControllers } from './review.controller';
import { ReviewValidations } from './review.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(ReviewValidations.createReviewSchema),
  ReviewControllers.createOne,
);

router.get('/', ReviewControllers.getAll);
router.get('/:id', ReviewControllers.getOne);

router.patch(
  '/:id',
  validateRequest(ReviewValidations.updateReviewSchema),
  ReviewControllers.updateOne,
);

router.delete('/:id', ReviewControllers.deleteOne);

export const ReviewRoutes = router;
