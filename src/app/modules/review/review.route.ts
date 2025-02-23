import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewControllers } from './review.controller';
import { ReviewValidations } from './review.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(ReviewValidations.createReviewSchema),
  ReviewControllers.createOne,
);

router.get('/', ReviewControllers.getAll);
router.get('/:id', ReviewControllers.getOne);
router.get('/productId', ReviewControllers.getOne);

router.patch(
  '/:id',
  auth('user'),
  validateRequest(ReviewValidations.updateReviewSchema),
  ReviewControllers.updateOne,
);

router.delete('/:id', ReviewControllers.deleteOne);

export const ReviewRoutes = router;
