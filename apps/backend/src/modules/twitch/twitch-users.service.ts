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
  GetAddedTwitchChannelsPaginatedResponse,
  TwitchChannelsSortBy,
} from '@twitch-logger/shared';
import { SortOrder } from '@twitch-logger/shared/common';

@Injectable()
export class TwitchUsersService {
  private readonly channelDbTTL = 60 * 60 * 1000;
  private sortMap: Record<TwitchChannelsSortBy, string> = {
    [TwitchChannelsSortBy.LOGIN]: 'login',
    [TwitchChannelsSortBy.CREATED_AT]: 'created_at',
    [TwitchChannelsSortBy.ACCOUNT_CREATED_AT]: 'channel_created_at',
    [TwitchChannelsSortBy.DISPLAY_NAME]: 'display_name',
  };

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
  ): Promise<GetAddedTwitchChannelsPaginatedResponse> {
    let pageSize = 10;
    let page = query.page ?? 0;

    if (query?.page_size && query.page_size > 0 && query.page_size <= 100) {
      pageSize = query.page_size;
    }

    if (query?.page && query?.page > 0) {
      page = query.page - 1;
    }

    const skip = page * pageSize;

    const qb = this.repository.createQueryBuilder('tc');

    if (query.search_phrase) {
      qb.andWhere(
        '(LOWER(tc.login) LIKE LOWER(:search) OR LOWER(tc.display_name) LIKE LOWER(:search))',
        {
          search: `%${query.search_phrase}%`,
        },
      );
    }

    if (query.user_id) {
      qb.andWhere('tc.twitch_user_id = ANY(:userIds)', {
        userIds: query.user_id,
      });
    }

    if (query.broadcaster_type) {
      qb.andWhere('tc.broadcaster_type = ANY(:broadcasterTypes)', {
        broadcasterTypes: query.broadcaster_type,
      });
    }

    const createdAtFrom = query.created_at_from
      ? new Date(query.created_at_from)
      : undefined;
    const createdAtTo = query.created_at_to
      ? new Date(query.created_at_to)
      : undefined;

    if (createdAtFrom && createdAtTo) {
      qb.andWhere('tc.created_at BETWEEN :createdFrom AND :createdTo', {
        createdFrom: createdAtFrom,
        createdTo: createdAtTo,
      });
    } else if (createdAtFrom) {
      qb.andWhere('tc.created_at >= :createdFrom', {
        createdFrom: createdAtFrom,
      });
    } else if (createdAtTo) {
      qb.andWhere('tc.created_at <= :createdTo', {
        createdTo: createdAtTo,
      });
    }

    const accountCreatedAtFrom = query.account_created_at_from
      ? new Date(query.account_created_at_from)
      : undefined;
    const accountCreatedAtTo = query.account_created_at_to
      ? new Date(query.account_created_at_to)
      : undefined;

    if (accountCreatedAtFrom && accountCreatedAtTo) {
      qb.andWhere('tc.channel_created_at BETWEEN :accountFrom AND :accountTo', {
        accountFrom: accountCreatedAtFrom,
        accountTo: accountCreatedAtTo,
      });
    } else if (accountCreatedAtFrom) {
      qb.andWhere('tc.channel_created_at >= :accountFrom', {
        accountFrom: accountCreatedAtFrom,
      });
    } else if (accountCreatedAtTo) {
      qb.andWhere('tc.channel_created_at <= :accountTo', {
        accountTo: accountCreatedAtTo,
      });
    }

    if (query.sort_by) {
      const sortOrder = query.sort_order === SortOrder.ASC ? 'ASC' : 'DESC';
      qb.orderBy(`tc.${this.sortMap[query.sort_by]}`, sortOrder);
    }

    qb.skip(skip);
    qb.take(pageSize);

    const [channels, total] = await qb.getManyAndCount();
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
