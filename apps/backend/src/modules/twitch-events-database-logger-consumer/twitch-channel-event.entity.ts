import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { MessageActor } from '../../models/twitch-channel-event';

@Entity('twitch_channels_events')
export class TwitchChannelEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'actor', type: 'text' })
  actor: MessageActor;

  @Column({ name: 'channel', type: 'text' })
  channel: string;

  @Column({ name: 'type', type: 'text' })
  type: string;

  @Column({ name: 'user_id', type: 'text', nullable: true })
  userId: string | null;

  @Column({ name: 'username', type: 'text', nullable: true })
  username: string | null;

  @Column({ name: 'message', type: 'text', nullable: true })
  message: string | null;

  @Column({ name: 'timestamp', type: 'timestamptz' })
  timestamp: Date;

  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: any;
}
