import { Module } from '@nestjs/common';
import { TmiLogger } from './tmi-logger';
import { TwitchKafkaProducer } from './twitch-kafka.producer';
import { KafkaModule } from '@modules/kafka/kafka.module';
import { KAFKA_TOPICS } from '@config/constants';
import { TwitchLoggerOutboxConsumer } from './twitch-logger-outbox.consumer';

@Module({
  imports: [
    KafkaModule.forRoot({
      clientId: 'twitch-events-producer',
      createTopicsOptions: {
        topics: [
          {
            topic: KAFKA_TOPICS.TWITCH_CHANNELS_EVENTS_TOPIC,
          },
          {
            topic: KAFKA_TOPICS.TWITCH_CHANNELS_DLQ_TOPIC,
            numPartitions: 1,
            replicationFactor: 1,
          },
        ],
      },
    }),
  ],
  providers: [TwitchLoggerOutboxConsumer, TwitchKafkaProducer, TmiLogger],
})
export class TwitchLoggerModule {}
