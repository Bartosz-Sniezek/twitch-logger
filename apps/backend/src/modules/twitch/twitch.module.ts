import { AppCacheModule } from '@modules/cache/app-cache.module';
import { Module } from '@nestjs/common';
import { TwitchApiTokenSevice } from './twitch-api-token.service';
import { TwitchUsersApiService } from './twitch-users-api.sevice';
import { TwitchOAuthApi } from './twitch-oauth-api.service';
import { AppConfigModule } from '@modules/app-config/app-config.module';
import { TwitchUsersApiClient } from './api/twitch-users-api.client';
import { TwitchUsersController } from './controllers/twitch-users.controller';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitchChannelEntity } from './twitch-channel.entity';

@Module({
  imports: [
    AppConfigModule,
    AppCacheModule,
    TypeOrmModule.forFeature([TwitchChannelEntity]),
  ],
  providers: [
    TwitchApiTokenSevice,
    TwitchUsersApiService,
    TwitchOAuthApi,
    TwitchUsersApiClient,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  exports: [TwitchUsersApiClient],
  controllers: [TwitchUsersController],
})
export class TwitchModule {}
