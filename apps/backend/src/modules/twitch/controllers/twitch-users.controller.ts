import { Controller, Get, Query } from '@nestjs/common';
import { TwitchUsersApiClient } from '../api/twitch-users-api.client';
import { GetUsersParams } from './dtos/get-useres.params';
import {
  TwitchUsersResponse,
  twitchUsersResponseSchema,
} from '@twitch-logger/shared';

@Controller('/twitch/users')
export class TwitchUsersController {
  constructor(private readonly twitchUsersApiClient: TwitchUsersApiClient) {}

  @Get()
  public async getUsers(
    @Query() query: GetUsersParams,
  ): Promise<TwitchUsersResponse> {
    return this.twitchUsersApiClient
      .getUsers(query.username)
      .then((data) => twitchUsersResponseSchema.parse(data));
  }
}
