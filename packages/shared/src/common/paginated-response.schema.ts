import z from "zod";

export const createPaginatedResponseSchema = <T extends z.ZodObject>(
  dataItem: T
) =>
  z.object({
    page: z.number(),
    pageSize: z.number(),
    totalItems: z.number(),
    totalPages: z.number(),
    data: z.array(dataItem),
  });
