import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { TwitchUsersService } from '../twitch-users.service';
import type { TwitchUserId } from 'src/types';
import { AddTwitchChannelDto } from '../dtos/add-twitch-channel.dto';

@Controller('/twitch/channels')
export class TwitchChannelsController {
  constructor(private readonly twitchUsersService: TwitchUsersService) {}

  @Post()
  public async addChannel(@Body() dto: AddTwitchChannelDto): Promise<void> {
    await this.twitchUsersService.addChannel(dto.twitchUserId);
  }

  @Delete('/:twitchUserId')
  public async deleteChannel(
    @Param('twitchUserId') twitchUserId: TwitchUserId,
  ): Promise<void> {
    await this.twitchUsersService.removeChannel(twitchUserId);
  }
}
