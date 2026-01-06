import { addUserTwitchChannelSchema } from '@twitch-logger/shared';
import { createZodDto } from 'nestjs-zod';
import { TwitchUserId } from 'src/types';

export class AddUserChannelDto extends createZodDto(addUserTwitchChannelSchema) {
  twitchUserId: TwitchUserId;
}
