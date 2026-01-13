import { addTwitchChannelSchema } from '@twitch-logger/shared';
import { createZodDto } from 'nestjs-zod';
import { TwitchUserId } from 'src/types';

export class AddTwitchChannelDto extends createZodDto(addTwitchChannelSchema) {
  twitchUserId: TwitchUserId;
}
