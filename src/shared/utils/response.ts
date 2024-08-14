/* eslint-disable @typescript-eslint/no-explicit-any */

export const resSuccess = async (
  res: any,
  statusCode: any,
  message: any,
  data: any,
  results = 1
) => {
  return res.status(statusCode).json({
    status: true,
    message,
    results,
    data,
  });
};

export const resError = async (res: any, statusCode: any, message: any) => {
  return res.status(statusCode).json({
    status: false,
    message,
  });
};
