import { model, Schema } from 'mongoose';
import { IReview } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    //* review schema fields

    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

// pre save middleware/hook
reviewSchema.pre('save', async function (next) {
  next();
});

// post save middleware/hook
reviewSchema.post('save', function (doc, next) {
  next();
});

reviewSchema.pre('updateOne', async function (next) {
  next();
});
export const Review = model<IReview>('Review', reviewSchema);
