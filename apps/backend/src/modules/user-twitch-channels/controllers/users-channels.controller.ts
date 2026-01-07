import { Body, Controller, Post } from '@nestjs/common';
import { AddUserChannelDto } from './dtos/add-user-twitch-channel.dto';
import { UserTwitchChannelsFacade } from '../user-twitch-channels.facade';
import { APP_USER_ID } from 'src/temp/app-user-id';
import { TwitchUserId } from 'src/types';

@Controller('/users/me/twitch-channels')
export class UserTwitchChannelsController {
  constructor(private readonly userTwitchChannels: UserTwitchChannelsFacade) {}

  @Post()
  public async addTwitchChannelToUser(
    @Body() dto: AddUserChannelDto,
  ): Promise<void> {
    return this.userTwitchChannels.add(
      APP_USER_ID,
      <TwitchUserId>dto.twitchUserId,
    );
  }
}
