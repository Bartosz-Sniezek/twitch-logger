import z from "zod";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export const createSortSchema = <T extends Record<string, string>>(
  fields: T
) => {
  return z.object({
    sort_by: z.enum(fields).optional(),
    sort_order: z.enum(SortOrder).optional(),
  }).shape;
};
