import { KAFKA_SERVICE } from '@modules/kafka/kafka.module';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { TwitchChannelEvent } from '@models/twitch-channel-event';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import { DeadLetterQueueService } from './dead-letter-queue.service';
import { TwitchChannelEventDatabaseLogger } from './twitch-channel-event-database-logger';
import { KAFKA_TOPICS } from '@config/constants';
import { InvalidMessageError } from '@models/errors/invalid-message.error';
import { NullMessageError } from '@models/errors/null-message.error';
import { commitOffset } from '@modules/kafka/commit-offset';

@Injectable()
export class TwitchChannelEventDatabaseConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private consumer: KafkaJS.Consumer;

  constructor(
    @Inject(KAFKA_SERVICE)
    private readonly kafka: KafkaJS.Kafka,
    private readonly deadLetterQueueService: DeadLetterQueueService,
    private readonly twitchChannelEventDatabaseLogger: TwitchChannelEventDatabaseLogger,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.deadLetterQueueService.connect();
    await this.initializeConsumer();

    await this.consumer.run({
      eachMessage: async (payload) => await this.handleMessage(payload),
    });
  }
  async onModuleDestroy(): Promise<void> {
    await this.consumer.disconnect();
    await this.deadLetterQueueService.disconnect();
  }

  private async handleMessage({
    topic,
    partition,
    message,
  }: KafkaJS.EachMessagePayload): Promise<void> {
    try {
      const twitchChannelEvent: TwitchChannelEvent = TwitchChannelEvent.parse(
        message.value,
      );

      await this.twitchChannelEventDatabaseLogger.handle(twitchChannelEvent);
      await commitOffset({
        consumer: this.consumer,
        topic,
        partition,
        message,
      });
    } catch (error) {
      if (
        error instanceof NullMessageError ||
        error instanceof InvalidMessageError
      ) {
        console.error('Error processing message:', error);

        await this.deadLetterQueueService.send(message, {
          originalPartition: partition,
          originalTopic: topic,
          error,
        });
        await commitOffset({
          consumer: this.consumer,
          topic,
          partition,
          message,
        });

        return;
      }

      throw error;
    }
  }

  private async initializeConsumer(): Promise<void> {
    this.consumer = this.kafka.consumer({
      'group.id': 'twitch-events-processor',
      'session.timeout.ms': 30000,
      'heartbeat.interval.ms': 3000,
      'auto.offset.reset': 'beginning',
      'enable.auto.commit': false,
    });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: [KAFKA_TOPICS.TWITCH_CHANNELS_EVENTS_TOPIC],
    });
  }
}
