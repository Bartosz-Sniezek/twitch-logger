import z from 'zod';
import { twitchOAuthApiResponseSchema } from './twitch-oauth.schema';

export type TwitchOAuthApiResponse = z.infer<
  typeof twitchOAuthApiResponseSchema
>;
