import { NextFunction, Request, Response } from "express";
// import { ZodObject } from "zod";
// import { AnyZodObject } from "zod/v3";


import { ZodObject, ZodRawShape } from "zod";

export type AnyZodObject = ZodObject<ZodRawShape>;

export const validateRequest = (zodSchema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await zodSchema.parseAsync(req.body);
      next()
    } catch (error) {
      next(error);
    }
  };
