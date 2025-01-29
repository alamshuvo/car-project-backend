export type TErrorSources = { path: string; message: string }[];
export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  error: TErrorSources;
  stack?: string | null;
};
