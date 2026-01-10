import z from 'zod';

export const twitchOAuthApiResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
});
