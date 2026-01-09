import { Injectable } from '@nestjs/common';
import { AppCacheService } from '@modules/cache/app-cache.service';
import {
  TwitchUser,
  twitchUserSchema,
} from './interfaces/twitch-users-api.interface';
import { TwitchUsersApiClient } from './api/twitch-users-api.client';
import { InjectRepository } from '@nestjs/typeorm';
import { TwitchChannelEntity } from './twitch-channel.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class TwitchUsersApiService {
  constructor(
    private readonly cacheService: AppCacheService,
    private readonly twitchUsersApiClient: TwitchUsersApiClient,
    @InjectRepository(TwitchChannelEntity)
    private readonly repository: Repository<TwitchChannelEntity>,
  ) {}

  async getChannelInfo(userLogin: string): Promise<TwitchUser> {
    const key = 'TWITCH_USER__' + userLogin;
    const cachedChannel = await this.cacheService.get<TwitchUser>(key);

    if (cachedChannel) {
      return cachedChannel;
    }

    const storedChannel = await this.repository.findOneBy({
      login: userLogin,
      revalidateDataAfter: MoreThanOrEqual(new Date()),
    });

    if (storedChannel) {
      return twitchUserSchema.parse(<TwitchUser>{
        id: storedChannel.twitchUserId,
        login: storedChannel.login,
        display_name: storedChannel.displayName,
        description: storedChannel.description,
        broadcaster_type: storedChannel.broadcasterType,
        type: storedChannel.userType,
        created_at: storedChannel.createdAt.toISOString(),
        offline_image_url: storedChannel.offlineImageUrl,
        profile_image_url: storedChannel.profileImageUrl,
        view_count: 0,
      });
    }

    const channel = await this.twitchUsersApiClient
      .getUsers(userLogin)
      .then((response) => response.data[0]);

    if (channel == null) throw new Error('Twitch user not found');

    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(TwitchChannelEntity)
      .values({
        twitchUserId: channel.id,
        login: channel.login,
        displayName: channel.display_name,
        description: channel.description,
        broadcasterType: channel.broadcaster_type,
        userType: channel.type,
        offlineImageUrl: channel.offline_image_url,
        profileImageUrl: channel.profile_image_url,
        revalidateDataAfter: new Date(Date.now() + oneWeekInMs),
        channelCreatedAt: channel.created_at,
      })
      .orUpdate(
        [
          'display_name',
          'description',
          'broadcaster_type',
          'user_type',
          'offline_image_url',
          'profile_image_url',
          'revalidate_data_after',
        ],
        ['twitch_user_id'],
      )
      .execute();

    await this.cacheService.set(key, channel, oneWeekInMs);

    return channel;
  }
}
