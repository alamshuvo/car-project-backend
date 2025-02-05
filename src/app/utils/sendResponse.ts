import { Response } from 'express';
type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
};

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  const response: TResponse<T> = {
    success: responseData.success,
    statusCode: responseData.statusCode,
    message: responseData.message,
  };
  if (responseData.data && Object.keys(responseData.data).length > 0) {
    response.data = responseData.data;
  }
  if (responseData.meta && Object.keys(responseData.meta).length > 0) {
    response.meta = responseData.meta;
  }
  res.status(responseData.statusCode).json(response);
};

export default sendResponse;
