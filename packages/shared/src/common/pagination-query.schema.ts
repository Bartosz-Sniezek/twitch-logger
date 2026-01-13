import z from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  page_size: z.coerce.number().min(10).max(100).optional(),
});
