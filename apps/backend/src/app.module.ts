import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppConfigModule } from '@modules/app-config/app-config.module';
import { DatabaseModule } from '@modules/database/database.module';
import { TwitchModule } from '@modules/twitch/twitch.module';
import { HealthModule } from '@modules/health/health.module';
import { TwitchLoggerModule } from '@modules/twitch-logger/twitch-logger.module';
import { KafkaModule } from '@modules/kafka/kafka.module';
import { TwitchChannelsEventsDatabaseLoggerConsumerModule } from '@modules/twitch-events-database-logger-consumer/twitch-channels-events-database-logger.module';

@Module({
  imports: [
    AppConfigModule,
    ScheduleModule.forRoot(),
    HealthModule,
    DatabaseModule,
    TwitchModule,
    KafkaModule,
    TwitchLoggerModule,
    TwitchChannelsEventsDatabaseLoggerConsumerModule,
  ],
})
export class AppModule {}
