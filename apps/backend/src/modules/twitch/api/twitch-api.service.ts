import { AppConfig } from '@modules/app-config/app-env-configuration';
import { TwitchApiTokenSevice } from '../twitch-api-token.service';

export abstract class TwitchApiClient {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly twitchApiTokenService: TwitchApiTokenSevice,
  ) {}

  protected async get(url: URL): Promise<unknown> {
    const resp = await fetch(url.toString(), {
      headers: await this.prepareHeaders(),
    });

    if (resp.status >= 300 && resp.status <= 499) {
      const body: unknown = await resp.json();

      console.error(body);

      throw new Error('There was an error with ');
    } else if (resp.status > 500) {
      throw new Error('twix api unavailable 5xx');
    }

    return resp.json();
  }

  private async prepareHeaders(): Promise<HeadersInit> {
    return {
      Authorization: `Bearer ${await this.twitchApiTokenService.getAppToken()}`,
      'Client-Id': this.appConfig.values.TWITCH_API_CLIENT_ID,
    };
  }
}
