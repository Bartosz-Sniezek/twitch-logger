import z from "zod";
import {
  twitchUserSchema,
  twitchUserResponseSchema,
} from "../schemas/twitch-user.schema";

export type TwitchUser = z.infer<typeof twitchUserSchema>;
export type TwitchUsersResponse = z.infer<typeof twitchUserResponseSchema>;
