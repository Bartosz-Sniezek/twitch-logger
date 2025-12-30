import { Injectable } from '@nestjs/common';
import { TwitchApiTokenSevice } from './twitch-api-token.service';
import { AppConfig } from '@modules/app-config/app-env-configuration';

@Injectable()
export class TwitchUsersApiService {
  constructor(
    private readonly twitchApiTokenSevice: TwitchApiTokenSevice,
    private readonly appConfig: AppConfig,
  ) {}

  async getChannelInfo(channelName: string): Promise<void> {
    const resp = await fetch(
      `https://api.twitch.tv/helix/users?login=${channelName}`,
      {
        headers: {
          Authorization: `Bearer ${await this.twitchApiTokenSevice.getAppToken()}`,
          'Client-Id': this.appConfig.values.TWITCH_API_CLIENT_ID,
        },
      },
    );

    console.log(await resp.json());
  }
}
