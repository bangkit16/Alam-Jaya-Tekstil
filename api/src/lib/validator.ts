import { z } from "zod";
import type { Request, Response } from "express";

export const Validator =
  <T extends z.ZodSchema>(schema: T) =>
  (req: Request, res: Response) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      // Menggunakan .issues untuk menghindari error "Property errors does not exist"
      // Ini adalah cara paling aman di TypeScript untuk Zod
      res.status(400).json({
        status: "fail",
        errors: result.error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
      return null;
    }

    // Melakukan cast ke z.output<T> agar type data hasil validasi akurat
    return result.data as z.output<T>;
  };

export type ValidatorResult<T extends z.ZodSchema> = z.output<T>;