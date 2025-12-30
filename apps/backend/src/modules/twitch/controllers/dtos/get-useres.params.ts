import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const getUsersParamsSchema = z.object({
  username: z.string(),
});

export class GetUsersParams extends createZodDto(getUsersParamsSchema) {}
