import { AppCacheModule } from '@modules/cache/app-cache.module';
import { Module, OnModuleInit } from '@nestjs/common';
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
import { TwitchChannelOutboxEntity } from './twitch-channel-outbox.entity';
import { OutboxCron } from './outbox-cron';
import { TwitchLoggingBootstrapService } from './twitch-logging-bootstrap.service';
import { TwitchLoggerOutboxService } from './twitch-logger-outbox.service';
import { KafkaModule } from '@modules/kafka/kafka.module';
import { KAFKA_TOPICS } from '@config/constants';

@Module({
  imports: [
    AppConfigModule,
    AppCacheModule,
    KafkaModule.forRoot({
      clientId: 'twitch-logger-outbox-producer',
      createTopicsOptions: {
        topics: [
          {
            topic: KAFKA_TOPICS.TWITCH_LOGGER_OUTBOX_TOPIC,
            numPartitions: 1,
          },
        ],
      },
    }),
    TwitchApiModule,
    TypeOrmModule.forFeature([TwitchChannelEntity, TwitchChannelOutboxEntity]),
  ],
  providers: [
    TwitchUsersService,
    GetAddedTwitchChannelsQuery,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    OutboxCron,
    TwitchLoggingBootstrapService,
    TwitchLoggerOutboxService,
  ],
  exports: [],
  controllers: [TwitchUsersController, TwitchChannelsController],
})
export class TwitchModule implements OnModuleInit {
  constructor(
    private readonly enableLogService: TwitchLoggingBootstrapService,
  ) {}

  async onModuleInit() {
    await this.enableLogService.startTracking();
  }
}
