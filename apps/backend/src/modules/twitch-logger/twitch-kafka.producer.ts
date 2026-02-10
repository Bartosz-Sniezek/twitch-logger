import { KAFKA_SERVICE } from '@modules/kafka/kafka.module';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { TwitchChannelEvent } from '../../models/twitch-channel-event';
import { KafkaJS } from '@confluentinc/kafka-javascript';
import { KAFKA_TOPICS } from '@config/constants';

@Injectable()
export class TwitchKafkaProducer implements OnModuleInit, OnModuleDestroy {
  private producer: KafkaJS.Producer;

  constructor(
    @Inject(KAFKA_SERVICE)
    private readonly kafka: KafkaJS.Kafka,
  ) {}

  async onModuleInit(): Promise<void> {
    const admin = this.kafka.admin({
      'client.id': 'producer-admin',
    });
    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: KAFKA_TOPICS.TWITCH_CHANNELS_EVENTS_TOPIC,
        },
      ],
    });
    await admin.disconnect();
    this.producer = this.kafka.producer({
      'allow.auto.create.topics': true,
      'compression.level': 1,
    });
    await this.producer.connect();
  }
  async onModuleDestroy(): Promise<void> {
    await this.producer.disconnect();
  }

  async sendMessage(message: TwitchChannelEvent): Promise<void> {
    await this.producer.send({
      topic: KAFKA_TOPICS.TWITCH_CHANNELS_EVENTS_TOPIC,
      messages: [
        {
          key: message.channel,
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
