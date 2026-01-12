import z from "zod";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export const createSortSchema = (fields: readonly string[]) => {
  return z
    .object({
      sort_by: z.enum(fields),
      sort_order: z.enum(SortOrder).default(SortOrder.ASC),
    })
    .optional();
};
