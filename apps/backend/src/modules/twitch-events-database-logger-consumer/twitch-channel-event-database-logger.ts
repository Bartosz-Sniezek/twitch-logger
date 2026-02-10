import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TwitchChannelEventEntity } from './twitch-channel-event.entity';
import { Repository } from 'typeorm';
import { TwitchChannelEvent } from '@models/twitch-channel-event';

@Injectable()
export class TwitchChannelEventDatabaseLogger {
  constructor(
    @InjectRepository(TwitchChannelEventEntity)
    private readonly twitchChannelEventsRepository: Repository<TwitchChannelEventEntity>,
  ) {}

  public async handle(event: TwitchChannelEvent): Promise<void> {
    await this.twitchChannelEventsRepository
      .createQueryBuilder()
      .insert()
      .into(TwitchChannelEventEntity)
      .values(
        this.twitchChannelEventsRepository.create({
          id: event.id,
          actor: event.actor,
          channel: event.channel,
          type: event.type,
          userId: event.userId,
          username: event.username,
          message: event.message,
          timestamp: new Date(event.timestamp),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          metadata: event.metadata,
        }),
      )
      .orIgnore()
      .execute();
  }
}
