import { NextFunction } from 'express';
import { BadRequestError } from 'routing-controllers';

const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
  }
};
