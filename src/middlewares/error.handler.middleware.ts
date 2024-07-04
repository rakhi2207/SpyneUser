import express from 'express';
import httpStatusCodes from 'http-status-codes';
import { BaseError } from '../errror/base.error';
import { ApiResponse } from './api.response.middleware';


export interface IError {
  status?: number;
  code?: number;
  message?: string;
}

export function notFoundErrorHandler(
  _err: BaseError,
  _req: express.Request,
  res: express.Response,
) {
  res.status(httpStatusCodes.NOT_FOUND).json({
    success: false,
    error: {
      code: httpStatusCodes.NOT_FOUND,
      message: httpStatusCodes.getStatusText(httpStatusCodes.NOT_FOUND),
    },
  });
}


export function errorHandler(
  err: BaseError,
  _req: express.Request,
  res: express.Response,
) {
  res.status(err.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
    message:
      err.message ||
      httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR),
    name: err.name,
  });
}