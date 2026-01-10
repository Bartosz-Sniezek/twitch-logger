import z from 'zod';
import {
  twitchApiGetUsersResponseSchema,
  twitchApiUserSchema,
} from './twitch-users.schema';

export type TwitchApiUser = z.infer<typeof twitchApiUserSchema>;
export type TwitchApiGetUsersResponse = z.infer<
  typeof twitchApiGetUsersResponseSchema
>;
