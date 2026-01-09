import { Controller, Get, Query } from '@nestjs/common';
import { GetUsersParams } from './dtos/get-useres.params';
import {
  TwitchUsersResponse,
  twitchUsersResponseSchema,
} from '@twitch-logger/shared';
import { TwitchUsersApiService } from '../twitch-users-api.sevice';

@Controller('/twitch/users')
export class TwitchUsersController {
  constructor(private readonly twitchUsersApiService: TwitchUsersApiService) {}

  @Get()
  public async getUsers(
    @Query() query: GetUsersParams,
  ): Promise<TwitchUsersResponse> {
    return this.twitchUsersApiService
      .getChannelInfo(query.username)
      .then((data) => twitchUsersResponseSchema.parse({ data: [data] }));
  }
}
