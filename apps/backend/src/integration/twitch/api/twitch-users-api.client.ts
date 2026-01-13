import { Injectable } from '@nestjs/common';
import { TwitchApiClient } from './abstract/twitch-api.client';
import { AppConfig } from '@modules/app-config/app-env-configuration';
import { TwitchApiGetUsersResponse } from './twitch-users.types';
import { twitchApiGetUsersResponseSchema } from './twitch-users.schema';
import { TwitchApiTokenSevice } from '../services/twitch-api-token.service';

@Injectable()
export class TwitchUsersApiClient extends TwitchApiClient {
  private readonly BASE_URL = 'https://api.twitch.tv/helix/users';

  constructor(appConfig: AppConfig, tokenService: TwitchApiTokenSevice) {
    super(appConfig, tokenService);
  }

  async getUserByLogin(login: string): Promise<TwitchApiGetUsersResponse> {
    const url = new URL(this.BASE_URL);
    url.searchParams.append('login', login);

    const responseData = await this.get(url);
    const { success, data, error } =
      twitchApiGetUsersResponseSchema.safeParse(responseData);

    if (!success) {
      console.error(error);

      throw new Error('Failed to parse twix api response');
    }

    return data;
  }

  async getUserById(id: string): Promise<TwitchApiGetUsersResponse> {
    const url = new URL(this.BASE_URL);
    url.searchParams.append('id', id);

    const responseData = await this.get(url);
    const { success, data, error } =
      twitchApiGetUsersResponseSchema.safeParse(responseData);

    if (!success) {
      console.error(error);

      throw new Error('Failed to parse twix api response');
    }

    return data;
  }
}
