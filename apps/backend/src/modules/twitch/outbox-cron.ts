import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TwitchChannelOutboxEntity } from './twitch-channel-outbox.entity';
import { TwitchLoggerOutboxService } from './twitch-logger-outbox.service';
import { TwitchLoggerOutboxEvent } from '@models/twitch-logger-outbox-event';

@Injectable()
export class OutboxCron {
  constructor(
    @InjectRepository(TwitchChannelOutboxEntity)
    private readonly outboxRepository: Repository<TwitchChannelOutboxEntity>,
    private readonly twitchLoggerOutboxService: TwitchLoggerOutboxService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleTwitchChannelOutbox() {
    await this.outboxRepository.manager.transaction(async (entityManager) => {
      try {
        const outboxRepository = entityManager.getRepository(
          TwitchChannelOutboxEntity,
        );
        const events = await outboxRepository.find({
          where: {
            completed: false,
          },
          order: {
            createdAt: 'ASC',
          },
          take: 10,
          lock: {
            mode: 'pessimistic_write',
            onLocked: 'nowait',
          },
        });

        for (const event of events) {
          await this.twitchLoggerOutboxService.send(
            TwitchLoggerOutboxEvent.create(event.eventName, event.channelName),
          );
          await outboxRepository.update(
            {
              eventId: event.eventId,
            },
            {
              completed: true,
            },
          );
        }
      } catch (error) {
        console.log(error);

        throw error;
      }
    });
  }
}
