import mongoose from 'mongoose';
import { TGenericErrorResponse } from '../interface/error';
import config from '../config';

const handleMongooseValidationError = (
  error: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources = Object.values(error.errors).map(
    (err: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: err?.path,
        message: err?.message,
      };
    },
  );
  return {
    statusCode: 400,
    message: 'Validation Error',
    error: errorSources,
    stack: config.NODE_ENV === 'development' ? error.stack : undefined,
  };
};

export default handleMongooseValidationError;
