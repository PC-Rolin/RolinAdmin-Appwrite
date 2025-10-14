import { z } from "zod";

export function defaultValue<T extends z.ZodSchema>(schema: T, defaultValue: z.infer<T>) {
  return z.preprocess<any, T, string>(value => {
    if (String(value).trim() === "") {
      return defaultValue
    }
    return value
  }, schema)
}

export function optional<T extends z.ZodSchema>(schema: T) {
  return z.preprocess<string | undefined, z.ZodOptional<T>, string>(value => {
    if (String(value).trim() === "") {
      return undefined;
    }
    return value
  }, z.optional(schema))
}