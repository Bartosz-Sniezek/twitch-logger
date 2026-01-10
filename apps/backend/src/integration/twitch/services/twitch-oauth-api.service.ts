import { AppConfig } from '@modules/app-config/app-env-configuration';
import { Injectable } from '@nestjs/common';
import { TwitchOAuthApiResponse } from '../api/twitch-oauth.types';
import { twitchOAuthApiResponseSchema } from '../api/twitch-oauth.schema';

@Injectable()
export class TwitchOAuthApi {
  private readonly twitchOAuthApiUrl = 'https://id.twitch.tv/oauth2/token';

  constructor(private readonly appConfig: AppConfig) {}

  async getToken(): Promise<TwitchOAuthApiResponse> {
    const resp = await fetch(this.twitchOAuthApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=${this.appConfig.values.TWITCH_API_CLIENT_ID}&client_secret=${this.appConfig.values.TWITCH_API_CLIENT_PASSWORD}&grant_type=client_credentials`,
    });

    if (resp.status !== 200) {
      throw new Error(JSON.stringify(await resp.json()));
    }

    const responseData: unknown = await resp.json();
    const parsed = twitchOAuthApiResponseSchema.safeParse(responseData);

    if (parsed.error) {
      console.error(parsed.error);

      throw new Error('There was an error with parsing twix response');
    }

    return parsed.data;
  }
}
