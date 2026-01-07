import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChannelEntity } from './user-channel.entity';
import { UserTwitchChannelsFacade } from './user-twitch-channels.facade';
import { UserTwitchChannelsController } from './controllers/users-channels.controller';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [TypeOrmModule.forFeature([UserChannelEntity])],
  providers: [
    UserTwitchChannelsFacade,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  controllers: [UserTwitchChannelsController],
})
export class UserTwitchChannelsModule {}
