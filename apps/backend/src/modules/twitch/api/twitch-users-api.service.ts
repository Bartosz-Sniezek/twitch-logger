import { Injectable } from '@nestjs/common';
import { TwitchApiClient } from './twitch-api.service';
import { AppConfig } from '@modules/app-config/app-env-configuration';
import { TwitchApiTokenSevice } from '../twitch-api-token.service';
import {
  TwitchGetUsersResponse,
  twitchGetUsersResponseSchema,
} from '../interfaces/twitch-users-api.interface';

@Injectable()
export class TwitchUsersApiClient extends TwitchApiClient {
  private readonly BASE_URL = 'https://api.twitch.tv/helix/users';

  constructor(appConfig: AppConfig, tokenService: TwitchApiTokenSevice) {
    super(appConfig, tokenService);
  }

  async getUsers(username: string): Promise<TwitchGetUsersResponse> {
    const url = new URL(this.BASE_URL);
    url.searchParams.append('login', username);

    const responseData = await this.get(url);
    const { success, data, error } =
      twitchGetUsersResponseSchema.safeParse(responseData);

    if (!success) {
      console.error(error);

      throw new Error('Failed to parse twix api response');
    }

    return <TwitchGetUsersResponse>data;
  }
}
