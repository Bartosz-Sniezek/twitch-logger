import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { TwitchChannelOutboxEventType } from './types';
import { TwitchChannelEntity } from './twitch-channel.entity';

@Entity('twitch_channels_outbox')
export class TwitchChannelOutboxEntity {
  @PrimaryColumn({ name: 'event_id', type: 'uuid' })
  eventId: string;

  @Column({ name: 'event_name', type: 'text' })
  eventName: TwitchChannelOutboxEventType;

  @Column({ name: 'channel_name', type: 'text' })
  channelName: string;

  @Column({ name: 'completed', type: 'boolean' })
  completed: boolean;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  static startLogging(
    entity: TwitchChannelEntity,
  ): Pick<
    TwitchChannelOutboxEntity,
    'channelName' | 'eventName' | 'completed'
  > {
    return {
      channelName: entity.login,
      completed: false,
      eventName: TwitchChannelOutboxEventType.START_LOGGING,
    };
  }

  static stopLogging(
    entity: TwitchChannelEntity,
  ): Pick<
    TwitchChannelOutboxEntity,
    'channelName' | 'eventName' | 'completed'
  > {
    return {
      channelName: entity.login,
      completed: false,
      eventName: TwitchChannelOutboxEventType.STOP_LOGGING,
    };
  }
}
