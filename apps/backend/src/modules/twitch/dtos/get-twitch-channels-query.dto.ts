import { getTwitchChannelsQuerySchema } from '@twitch-logger/shared';
import { createZodDto } from 'nestjs-zod';

export class GetTwitchChannelsQueryDto extends createZodDto(
  getTwitchChannelsQuerySchema,
) {}
