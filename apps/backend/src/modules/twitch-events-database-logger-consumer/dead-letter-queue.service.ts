import { KafkaJS } from '@confluentinc/kafka-javascript';
import { KAFKA_SERVICE } from '@modules/kafka/kafka.module';
import { Injectable, Inject } from '@nestjs/common';
import { KAFKA_TOPICS } from '@config/constants';

@Injectable()
export class DeadLetterQueueService {
  constructor(@Inject(KAFKA_SERVICE) private readonly kafka: KafkaJS.Kafka) {}

  private producer: KafkaJS.Producer;

  async connect(): Promise<void> {
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer?.disconnect();
  }

  async send(
    message: KafkaJS.KafkaMessage,
    metadata: {
      originalTopic: string;
      originalPartition: number;
      error: Error;
    },
  ): Promise<void> {
    await this.producer.send({
      topic: KAFKA_TOPICS.TWITCH_CHANNELS_DLQ_TOPIC,
      messages: [
        {
          key: message.key,
          value: message.value,
          headers: {
            ...message.headers,
            'dlq.original.topic': metadata.originalTopic,
            'dlq.original.partition': metadata.originalPartition.toString(),
            'dlq.original.offset': message.offset,
            'dlq.error.message': metadata.error.message,
            'dlq.error.type': metadata.error.name,
            'dlq.timestamp': new Date().toISOString(),
          },
        },
      ],
    });
  }
}
