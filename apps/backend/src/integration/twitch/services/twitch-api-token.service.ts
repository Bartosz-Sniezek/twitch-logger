import { AppCacheService } from '@modules/cache/app-cache.service';
import { Injectable } from '@nestjs/common';
import { TwitchOAuthApi } from './twitch-oauth-api.service';

@Injectable()
export class TwitchApiTokenSevice {
  private readonly TOKEN_KEY = 'TWITCH_API_TOKEN';

  constructor(
    private readonly oauthApi: TwitchOAuthApi,
    private readonly appCache: AppCacheService,
  ) {}

  async getAppToken(): Promise<string> {
    const token = await this.appCache.get<string>(this.TOKEN_KEY);

    if (token) return token;

    const oauthToken = await this.oauthApi.getToken();

    await this.appCache.set(
      this.TOKEN_KEY,
      oauthToken.access_token,
      oauthToken.expires_in - 1000 * 60,
    );

    return oauthToken.access_token;
  }
}
