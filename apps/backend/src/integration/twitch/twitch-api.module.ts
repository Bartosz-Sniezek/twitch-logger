import { AppConfigModule } from '@modules/app-config/app-config.module';
import { AppCacheModule } from '@modules/cache/app-cache.module';
import { Module } from '@nestjs/common';
import { TwitchOAuthApi } from './services/twitch-oauth-api.service';
import { TwitchUsersApiClient } from './api/twitch-users-api.client';
import { TwitchApiTokenSevice } from './services/twitch-api-token.service';

@Module({
  imports: [AppConfigModule, AppCacheModule],
  providers: [TwitchOAuthApi, TwitchUsersApiClient, TwitchApiTokenSevice],
  exports: [TwitchUsersApiClient],
})
export class TwitchApiModule {}
