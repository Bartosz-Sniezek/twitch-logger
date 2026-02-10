import { KAFKA_SERVICE } from '@modules/kafka/kafka.module';
import { TmiLogger } from './tmi-logger';
import { TwitchChannelOutboxEventType } from '@modules/twitch/types';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import { KAFKA_TOPICS } from '@config/constants';
import { TwitchLoggerOutboxEvent } from '@models/twitch-logger-outbox-event';
import { commitOffset } from '@modules/kafka/commit-offset';

Injectable();
export class TwitchLoggerOutboxConsumer
  implements OnModuleInit, OnModuleDestroy
{
  private readonly eventMap: Record<
    TwitchChannelOutboxEventType,
    (channel: string) => Promise<void>
  >;
  private consumer: KafkaJS.Consumer;

  constructor(
    @Inject(KAFKA_SERVICE)
    private readonly kafka: KafkaJS.Kafka,
    tmiLogger: TmiLogger,
  ) {
    this.eventMap = {
      [TwitchChannelOutboxEventType.START_LOGGING]: (channel: string) =>
        tmiLogger.joinChannel(channel),
      [TwitchChannelOutboxEventType.STOP_LOGGING]: (channel: string) =>
        tmiLogger.leaveChannel(channel),
    };
  }

  async onModuleInit() {
    this.consumer = this.kafka.consumer({
      'group.id': 'twitch-logger-outbox-processor',
      'session.timeout.ms': 30000,
      'heartbeat.interval.ms': 3000,
      'auto.offset.reset': 'beginning',
      'enable.auto.commit': false,
    });

    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: [KAFKA_TOPICS.TWITCH_LOGGER_OUTBOX_TOPIC],
    });

    await this.consumer.run({
      eachMessage: async (payload) => await this.handleMessage(payload),
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }

  private async handleMessage({
    topic,
    partition,
    message,
  }: KafkaJS.EachMessagePayload): Promise<void> {
    const twitchChannelEvent = TwitchLoggerOutboxEvent.parse(message.value);

    await this.eventMap[twitchChannelEvent.type](twitchChannelEvent.channel);
    await commitOffset({
      consumer: this.consumer,
      topic,
      partition,
      message,
    });
  }
}
