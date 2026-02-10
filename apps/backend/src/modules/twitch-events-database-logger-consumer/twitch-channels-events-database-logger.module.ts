import { KafkaModule } from '@modules/kafka/kafka.module';
import { Module } from '@nestjs/common';
import { TwitchChannelEventDatabaseConsumer } from './twitch-channel-event-database.consumer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwitchChannelEventEntity } from './twitch-channel-event.entity';
import { DeadLetterQueueService } from './dead-letter-queue.service';
import { TwitchChannelEventDatabaseLogger } from './twitch-channel-event-database-logger';

@Module({
  imports: [
    KafkaModule.forRoot({
      clientId: 'twitch-channels-events-consumer',
    }),
    TypeOrmModule.forFeature([TwitchChannelEventEntity]),
  ],
  providers: [
    TwitchChannelEventDatabaseConsumer,
    DeadLetterQueueService,
    TwitchChannelEventDatabaseLogger,
  ],
})
export class TwitchChannelsEventsDatabaseLoggerConsumerModule {}
