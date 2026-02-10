import type { TwitchUserId } from 'src/types';
import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('twitch_channels')
export class TwitchChannelEntity {
  @PrimaryColumn({ name: 'twitch_user_id', type: 'text' })
  twitchUserId: TwitchUserId;

  @Column({ name: 'login', type: 'text' })
  login: string;

  @Column({ name: 'display_name', type: 'text' })
  displayName: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'user_type', type: 'text' })
  userType: string;

  @Column({ name: 'broadcaster_type', type: 'text' })
  broadcasterType: string;

  @Column({ name: 'profile_image_url', type: 'text' })
  profileImageUrl: string;

  @Column({ name: 'offline_image_url', type: 'text' })
  offlineImageUrl: string;

  @Column({ name: 'logging_enabled', type: 'boolean' })
  loggingEnabled: boolean;

  @Column({ name: 'channel_created_at', type: 'timestamp with time zone' })
  channelCreatedAt: Date;

  @Column({ name: 'revalidate_data_after', type: 'timestamp with time zone' })
  revalidateDataAfter: Date;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;
}
