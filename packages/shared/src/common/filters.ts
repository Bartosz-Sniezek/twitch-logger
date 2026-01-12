import z from "zod";

export const createArrayFilter = <T extends string>(field: T) => {
  return z.object({
    [field]: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .optional(),
  } as Record<
    T,
    z.ZodOptional<
      z.ZodPipe<
        z.ZodUnion<readonly [z.ZodString, z.ZodArray<z.ZodString>]>,
        z.ZodTransform<string[], string | string[]>
      >
    >
  >).shape;
};

export const createDateRangeFilter = <T extends string>(field: T) => {
  return z.object({
    [`${field}_from`]: z.iso.datetime().optional(),
    [`${field}_to`]: z.iso.datetime().optional(),
  } as Record<`${T}_from` | `${T}_to`, z.ZodOptional<z.ZodISODateTime>>).shape;
};

export const searchPhraseFilter = z.object({
  search_phrase: z.string().max(100).optional(),
}).shape;
