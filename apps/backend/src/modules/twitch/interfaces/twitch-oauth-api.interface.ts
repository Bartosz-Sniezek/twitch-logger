import z from 'zod';

export const twitchOAuthApiResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_typee: z.string(),
});

export type TwitchOAuthApiResponse = z.infer<
  typeof twitchOAuthApiResponseSchema
>;
