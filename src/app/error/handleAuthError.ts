import { TGenericErrorResponse } from '../interface/error';
import AuthError from './AuthError';

const handleAuthError = (error: AuthError): TGenericErrorResponse => {
  return {
    statusCode: error.statusCode,
    message: error.message,
    error: [],
  };
};

export default handleAuthError;
