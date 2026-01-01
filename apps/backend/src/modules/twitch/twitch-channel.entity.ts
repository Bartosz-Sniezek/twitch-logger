import type { TwitchUserId } from 'src/types';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('twitch_channels')
export class TwitchChannelEntity {
  @PrimaryColumn({ name: 'twitch_user_id', type: 'text' })
  readonly twitchUserId: TwitchUserId;

  @Column({ name: 'login', type: 'text' })
  readonly login: string;

  @Column({ name: 'display_name', type: 'text' })
  readonly displayName: string;

  @Column({ name: 'profile_image_url', type: 'text' })
  profileImageUrl: string;

  @Column({ name: 'offline_image_url', type: 'text' })
  offlineImageUrl: string;

  @Column({ name: 'channel_created_at', type: 'timestamp with time zone' })
  readonly channelCreatedAt: Date;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  readonly createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
