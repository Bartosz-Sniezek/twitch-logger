import z from "zod";
import {
  createArrayFilter,
  createDateRangeFilter,
  createPaginatedResponseSchema,
  createSortSchema,
  paginationQuerySchema,
} from "../../common";

export enum TwitchChannelsSortBy {
  "LOGIN" = "login",
  "CREATED_AT" = "created_at",
}

const sortQuery = createSortSchema(TwitchChannelsSortBy);
const twitchChannelLoginFilter = createArrayFilter("user_id");
const createdAtDateRangeFilter = createDateRangeFilter("created_at");

export const getAddedTwitchChannelsQuerySchema = paginationQuerySchema
  .extend(sortQuery)
  .extend(twitchChannelLoginFilter)
  .extend(createdAtDateRangeFilter);

export const addedTwitchChannelItemSchema = z.object({
  twitchUserId: z.string(),
  login: z.string(),
  displayName: z.string(),
  description: z.string(),
  userType: z.string(),
  broadcasterType: z.string(),
  profileImageUrl: z.string(),
  offlineImageUrl: z.string(),
  channelCreatedAt: z.iso.datetime(),
  createdAt: z.iso.datetime(),
});

export const getAddedTwitchChannelsPaginatedResponseSchema =
  createPaginatedResponseSchema(addedTwitchChannelItemSchema);
