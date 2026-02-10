import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TwitchChannelEntity } from './twitch-channel.entity';
import { TwitchChannelOutboxEventType } from './types';
import { TwitchLoggerOutboxService } from './twitch-logger-outbox.service';
import { TwitchLoggerOutboxEvent } from '@models/twitch-logger-outbox-event';

@Injectable()
export class TwitchLoggingBootstrapService {
  constructor(
    @InjectRepository(TwitchChannelEntity)
    private readonly repository: Repository<TwitchChannelEntity>,
    private readonly twitchLoggerOutboxService: TwitchLoggerOutboxService,
  ) {}

  async startTracking() {
    const channels = await this.repository.find({
      where: {
        loggingEnabled: true,
      },
    });

    for (const channel of channels) {
      await this.twitchLoggerOutboxService.send(
        TwitchLoggerOutboxEvent.create(
          TwitchChannelOutboxEventType.START_LOGGING,
          channel.login,
        ),
      );
    }
  }
}
