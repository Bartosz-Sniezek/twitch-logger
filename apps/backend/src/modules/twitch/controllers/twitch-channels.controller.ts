import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TwitchUsersService } from '../twitch-users.service';
import type { TwitchUserId } from 'src/types';
import { AddTwitchChannelDto } from '../dtos/add-twitch-channel.dto';
import { GetTwitchChannelsQueryDto } from '../dtos/get-twitch-channels-query.dto';
import { GetAddedTwitchChannelsPaginatedResponse } from '@twitch-logger/shared';
import { GetAddedTwitchChannelsQuery } from '../get-added-twitch-channels.query';

@Controller('/twitch/channels')
export class TwitchChannelsController {
  constructor(
    private readonly twitchUsersService: TwitchUsersService,
    private readonly getAddedTwitchChannelsQuery: GetAddedTwitchChannelsQuery,
  ) {}

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

  @Get()
  public async getChannels(
    @Query() query: GetTwitchChannelsQueryDto,
  ): Promise<GetAddedTwitchChannelsPaginatedResponse> {
    return this.getAddedTwitchChannelsQuery.execute(query);
  }
}
