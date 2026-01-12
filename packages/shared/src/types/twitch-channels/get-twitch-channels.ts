import z from "zod";
import {
  getTwitchChannelsPaginatedResponseSchema,
  getTwitchChannelsQuerySchema,
} from "../../schemas/twitch-channels/get-twitch-channels";

export type GetTwitchChannelsQuery = z.infer<
  typeof getTwitchChannelsQuerySchema
>;

export type GetTwitchChannelsPaginatedResponse = z.infer<
  typeof getTwitchChannelsPaginatedResponseSchema
>;
