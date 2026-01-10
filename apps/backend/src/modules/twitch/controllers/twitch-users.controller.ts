import { Controller, Get, Query } from '@nestjs/common';
import { GetUsersParams } from './dtos/get-useres.params';
import {
  TwitchUsersResponse,
  twitchUserResponseSchema,
} from '@twitch-logger/shared';
import { TwitchUsersService } from '../twitch-users.service';
import { TwitchUserId } from 'src/types';

@Controller('/twitch/users')
export class TwitchUsersController {
  constructor(private readonly twitchUsersApiService: TwitchUsersService) {}

  @Get()
  public async getUsers(
    @Query() query: GetUsersParams,
  ): Promise<TwitchUsersResponse> {
    const twitchUser = await this.twitchUsersApiService.getChannelInfo(
      query.username,
    );

    if (twitchUser == null) {
      return {
        data: null,
        isAdded: false,
      };
    }

    const storedChannelInDatabase =
      await this.twitchUsersApiService.getStoredChannelByUserId(
        <TwitchUserId>twitchUser.id,
      );

    return twitchUserResponseSchema.parse(<TwitchUsersResponse>{
      data: twitchUser,
      isAdded: storedChannelInDatabase !== null,
    });
  }
}
