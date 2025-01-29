import { TErrorSources, TGenericErrorResponse } from '../interface/error';
import config from '../config';
import mongoose from 'mongoose';

const handleCastError = (
  error: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: error?.path,
      message: error.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    error: errorSources,
    stack: config.NODE_ENV === 'development' ? error.stack : null,
  };
};

export default handleCastError;
