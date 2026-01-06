import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserChannelEntity } from './user-channel.entity';
import { Repository } from 'typeorm';
import { TwitchUserId, UserId } from 'src/types';

@Injectable()
export class UserTwitchChannelsFacade {
  constructor(
    @InjectRepository(UserChannelEntity)
    private readonly repository: Repository<UserChannelEntity>,
  ) {}

  async add(userId: UserId, twitchUserId: TwitchUserId): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .insert()
      .into(UserChannelEntity)
      .values({
        userId,
        twitchUserId,
      })
      .orIgnore()
      .execute();
  }
}
