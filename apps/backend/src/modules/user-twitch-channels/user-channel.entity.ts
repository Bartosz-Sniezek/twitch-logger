import type { TwitchUserId, UserChannelId, UserId } from 'src/types';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users_channels')
export class UserChannelEntity {
  @PrimaryColumn('uuid')
  readonly id: UserChannelId;

  @Column({ name: 'user_id', type: 'uuid' })
  readonly userId: UserId;

  @Column({ name: 'twitch_user_id', type: 'text' })
  readonly twitchUserId: TwitchUserId;

  @Column({ name: 'created_at', type: 'timestamp with time zone' })
  readonly createdAt: Date;
}
