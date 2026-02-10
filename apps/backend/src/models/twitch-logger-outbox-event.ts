import { TwitchChannelOutboxEventType } from '@modules/twitch/types';
import { kafkaMessageJSONParser } from '@models/helpers/kafka-message-json-parser';
import z from 'zod';

export const twitchLoggerOutboxEventSchema = z.object({
  type: z.enum(TwitchChannelOutboxEventType),
  channel: z.string(),
});

export type TTwitchLoggerOutboxEvent = z.infer<
  typeof twitchLoggerOutboxEventSchema
>;

export class TwitchLoggerOutboxEvent implements TTwitchLoggerOutboxEvent {
  constructor(
    readonly type: TwitchChannelOutboxEventType,
    readonly channel: string,
  ) {}

  static create(
    type: TwitchChannelOutboxEventType,
    channel: string,
  ): TwitchLoggerOutboxEvent {
    return new TwitchLoggerOutboxEvent(type, channel);
  }

  static parse(raw: Buffer<ArrayBufferLike> | null): TwitchLoggerOutboxEvent {
    return kafkaMessageJSONParser(raw, (jsonData) => {
      const { success, data } =
        twitchLoggerOutboxEventSchema.safeParse(jsonData);

      if (!success) return null;

      return new TwitchLoggerOutboxEvent(data.type, data.channel);
    });
  }
}
