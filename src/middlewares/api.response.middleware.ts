import express from 'express';
import { StatusCodes } from 'http-status-codes';


export class ApiResponse {
  public static result = (
    res: express.Response,
    data: object,
    status = 200,
  ) => {
    res.status(status).json({
      data,
      statusCode: status
    });
  };

  public static error = (
    res: express.Response,
    status = 400,
    message: string
  ) => {
    res.status(status).json({
      message: message,
      statusCode: status
    });
  };
}
