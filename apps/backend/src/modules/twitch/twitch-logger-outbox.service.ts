import { KafkaJS } from '@confluentinc/kafka-javascript';
import { KAFKA_SERVICE } from '@modules/kafka/kafka.module';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { KAFKA_TOPICS } from '@config/constants';
import { TwitchLoggerOutboxEvent } from '@models/twitch-logger-outbox-event';

@Injectable()
export class TwitchLoggerOutboxService
  implements OnModuleInit, OnModuleDestroy
{
  private producer?: KafkaJS.Producer;

  constructor(
    @Inject(KAFKA_SERVICE)
    private readonly kafka: KafkaJS.Kafka,
  ) {}

  async onModuleInit() {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer?.disconnect();
  }

  async send(event: TwitchLoggerOutboxEvent): Promise<void> {
    if (this.producer == null) throw new Error('Producer is not initialized');

    await this.producer.send({
      topic: KAFKA_TOPICS.TWITCH_LOGGER_OUTBOX_TOPIC,
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });
  }
}
