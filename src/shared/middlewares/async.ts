import { Request, Response, NextFunction } from "express";

const asyncHandler =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (fn: any) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
