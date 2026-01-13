import { AppCacheModule } from '@modules/cache/app-cache.module';
import { Module } from '@nestjs/common';
import { AppConfigModule } from '@modules/app-config/app-config.module';
import { TwitchUsersController } from './controllers/twitch-users.controller';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitchChannelEntity } from './twitch-channel.entity';
import { TwitchApiModule } from '@integration/twitch/twitch-api.module';
import { TwitchUsersService } from './twitch-users.service';
import { TwitchChannelsController } from './controllers/twitch-channels.controller';
import { GetAddedTwitchChannelsQuery } from './get-added-twitch-channels.query';

@Module({
  imports: [
    AppConfigModule,
    AppCacheModule,
    TwitchApiModule,
    TypeOrmModule.forFeature([TwitchChannelEntity]),
  ],
  providers: [
    TwitchUsersService,
    GetAddedTwitchChannelsQuery,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  exports: [],
  controllers: [TwitchUsersController, TwitchChannelsController],
})
export class TwitchModule {}
