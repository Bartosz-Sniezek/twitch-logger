import { v7 as uuidv7 } from 'uuid';
import z from 'zod';
import { kafkaMessageJSONParser } from '@models/helpers/kafka-message-json-parser';

export enum MessageActor {
  USER = 'user',
  SYSTEM = 'system',
}

export const twitchChannelEventSchema = z.object({
  id: z.uuidv7(),
  type: z.string(),
  actor: z.enum(MessageActor),
  channel: z.string(),
  message: z.string().nullable(),
  userId: z.string().nullable(),
  username: z.string().nullable(),
  metadata: z.any(),
  timestamp: z.number(),
});

export type TTwitchChannelEvent = z.infer<typeof twitchChannelEventSchema>;
export type TwitchChannelEventCreateOptions = Omit<TTwitchChannelEvent, 'id'>;

export class TwitchChannelEvent implements TTwitchChannelEvent {
  readonly id: string;
  readonly actor: MessageActor;
  readonly channel: string;
  readonly type: string;
  readonly timestamp: number;
  readonly userId: string | null;
  readonly username: string | null;
  readonly message: string | null;
  readonly metadata: any;

  constructor(options: TwitchChannelEventCreateOptions) {
    this.id = uuidv7();
    this.actor = options.actor;
    this.channel = options.channel;
    this.type = options.type;
    this.timestamp = options.timestamp;
    this.userId = options.userId;
    this.username = options.username;
    this.message = options.message;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.metadata = options.metadata;
  }

  static create(options: TwitchChannelEventCreateOptions): TwitchChannelEvent {
    return new TwitchChannelEvent(options);
  }

  static parse(raw: Buffer<ArrayBufferLike> | null): TwitchChannelEvent {
    return kafkaMessageJSONParser(raw, (jsonData) => {
      const { success, data } = twitchChannelEventSchema.safeParse(jsonData);

      if (!success) return null;

      return new TwitchChannelEvent(data);
    });
  }
}
