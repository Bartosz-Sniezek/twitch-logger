import { Controller, Get, Query } from '@nestjs/common';
import { TwitchUsersApiClient } from '../api/twitch-users-api.service';
import { GetUsersParams } from './dtos/get-useres.params';
import { TwitchGetUsersResponse } from '../interfaces/twitch-users-api.interface';

@Controller('/twitch/users')
export class TwitchUsersController {
  constructor(private readonly twitchUsersApiClient: TwitchUsersApiClient) {}

  @Get()
  public async getUsers(
    @Query() query: GetUsersParams,
  ): Promise<TwitchGetUsersResponse> {
    return this.twitchUsersApiClient.getUsers(query.username);
  }
}
