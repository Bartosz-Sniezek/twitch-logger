import { Injectable, NotFoundException } from '@nestjs/common';
import { AppCacheService } from '@modules/cache/app-cache.service';
import { InjectRepository } from '@nestjs/typeorm';
import { TwitchChannelEntity } from './twitch-channel.entity';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { TwitchUsersApiClient } from '@integration/twitch/api/twitch-users-api.client';
import { TwitchApiUser } from '@integration/twitch/api/twitch-users.types';
import { TwitchUserId } from 'src/types';
import { GetTwitchChannelsQueryDto } from './dtos/get-twitch-channels-query.dto';
import {
  GetTwitchChannelsPaginatedResponse,
  TwitchChannelsSortBy,
} from '@twitch-logger/shared';
import { SortOrder } from '@twitch-logger/shared/common';

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

  async getChannels(
    query: GetTwitchChannelsQueryDto,
  ): Promise<GetTwitchChannelsPaginatedResponse> {
    let pageSize = 10;
    let page = query.page ?? 0;

    if (query?.page_size && query.page_size > 0 && query.page_size <= 100) {
      pageSize = query.page_size;
    }

    if (query?.page && query?.page > 0) {
      page = query.page - 1;
    }

    const skip = page * pageSize;
    const whereConditions: FindOptionsWhere<TwitchChannelEntity> = {};

    if (query.user_id) {
      whereConditions.twitchUserId = In(query.user_id);
    }

    const createdAtFrom = query.created_at_from
      ? new Date(query.created_at_from)
      : undefined;
    const createdAtTo = query.created_at_to
      ? new Date(query.created_at_to)
      : undefined;

    if (createdAtFrom && createdAtTo) {
      whereConditions.createdAt = Between(createdAtFrom, createdAtTo);
    } else if (createdAtFrom) {
      whereConditions.createdAt = MoreThanOrEqual(createdAtFrom);
    } else if (createdAtTo) {
      whereConditions.createdAt = LessThanOrEqual(createdAtTo);
    }

    const order: FindOptionsOrder<TwitchChannelEntity> = {};

    if (query.sort_by) {
      const sortOrder = query.sort_order === SortOrder.ASC ? 'ASC' : 'DESC';
      switch (query.sort_by) {
        case TwitchChannelsSortBy.CREATED_AT:
          order['createdAt'] = sortOrder;
          break;
        case TwitchChannelsSortBy.LOGIN:
          order['login'] = sortOrder;
      }

      console.log(query);
      console.log(order);
    }

    const [channels, total] = await this.repository.findAndCount({
      skip,
      take: pageSize,
      where: whereConditions,
      order,
    });
    const totalPages = Math.ceil(total / pageSize);

    return {
      page: page + 1,
      pageSize,
      totalItems: total,
      totalPages,
      data: channels.map((ch) => ({
        twitchUserId: ch.twitchUserId,
        login: ch.login,
        displayName: ch.displayName,
        description: ch.description,
        broadcasterType: ch.broadcasterType,
        userType: ch.userType,
        profileImageUrl: ch.profileImageUrl,
        offlineImageUrl: ch.offlineImageUrl,
        channelCreatedAt: ch.channelCreatedAt.toISOString(),
        createdAt: ch.createdAt.toISOString(),
      })),
    };
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
