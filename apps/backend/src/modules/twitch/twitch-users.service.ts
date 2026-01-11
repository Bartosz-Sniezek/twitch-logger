import { Injectable, NotFoundException } from '@nestjs/common';
import { AppCacheService } from '@modules/cache/app-cache.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TwitchChannelEntity } from './twitch-channel.entity';
import { Repository } from 'typeorm';
import { TwitchUsersApiClient } from '@integration/twitch/api/twitch-users-api.client';
import { TwitchApiUser } from '@integration/twitch/api/twitch-users.types';
import { TwitchUserId } from 'src/types';

@Injectable()
export class TwitchUsersService {
  private readonly channelDbTTL = 60 * 60 * 1000;

  constructor(
    private readonly cacheService: AppCacheService,
    private readonly twitchUsersApiClient: TwitchUsersApiClient,
    @InjectRepository(TwitchChannelEntity)
    private readonly repository: Repository<TwitchChannelEntity>,
  ) {}

  async removeChannel(twitchUserId: TwitchUserId): Promise<void> {
    await this.repository.delete({
      twitchUserId,
    });
  }

  async addChannel(twitchUserId: TwitchUserId): Promise<void> {
    const channel = await this.getChannelByTwitchUserId(twitchUserId);

    if (channel === null)
      throw new NotFoundException(`Twitch user not found: ${twitchUserId}`);

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
        revalidateDataAfter: new Date(Date.now() + this.channelDbTTL),
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
  }

  async getStoredChannelByUserId(
    twitchUserId: TwitchUserId,
  ): Promise<TwitchChannelEntity | null> {
    return this.repository.findOneBy({
      twitchUserId,
    });
  }

  async getChannelByTwitchLogin(
    userLogin: string,
  ): Promise<TwitchApiUser | null> {
    const key = 'TWITCH_USER__' + userLogin;
    const cachedChannel = await this.cacheService.get<TwitchApiUser>(key);

    if (cachedChannel) {
      return cachedChannel;
    }

    const channel = await this.twitchUsersApiClient
      .getUserByLogin(userLogin)
      .then((response) => response.data[0]);

    if (channel == null) return null;

    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

    await this.cacheService.set(key, channel, oneWeekInMs);

    return channel;
  }

  async getChannelByTwitchUserId(
    id: TwitchUserId,
  ): Promise<TwitchApiUser | null> {
    const key = 'TWITCH_USER_ID__' + id;
    const cachedChannel = await this.cacheService.get<TwitchApiUser>(key);

    if (cachedChannel) {
      return cachedChannel;
    }

    const channel = await this.twitchUsersApiClient
      .getUserById(id)
      .then((response) => response.data[0]);

    if (channel == null) return null;

    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

    await this.cacheService.set(key, channel, oneWeekInMs);

    return channel;
  }
}
