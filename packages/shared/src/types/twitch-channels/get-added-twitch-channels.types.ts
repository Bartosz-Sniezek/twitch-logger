import z from "zod";
import {
  getAddedTwitchChannelsPaginatedResponseSchema,
  getAddedTwitchChannelsQuerySchema,
  addedTwitchChannelItemSchema,
} from "../../schemas/twitch-channels/get-added-twitch-channels.schema";

export type GetAddedTwitchChannelsQuery = z.infer<
  typeof getAddedTwitchChannelsQuerySchema
>;

export type AddedTwitchChannelItem = z.infer<
  typeof addedTwitchChannelItemSchema
>;

export type GetAddedTwitchChannelsPaginatedResponse = z.infer<
  typeof getAddedTwitchChannelsPaginatedResponseSchema
>;
