import z from 'zod';

export const twitchUserSchema = z.object({
  id: z.string().describe('User ID'),
  login: z.string().describe('User login name (lowercase)'),
  display_name: z.string().describe('User display name'),
  type: z.enum(['', 'admin', 'staff', 'global_mod']).describe('User type'),
  broadcaster_type: z
    .enum(['', 'affiliate', 'partner'])
    .describe('Broadcaster type'),
  description: z.string().describe('User bio/description'),
  profile_image_url: z.string().describe('Profile image URL'),
  offline_image_url: z.string().describe('Offline image URL'),
  view_count: z
    .number()
    .int()
    .nonnegative()
    .describe('Total view count (deprecated, always 0)'),
  email: z
    .email()
    .optional()
    .describe('User email (requires user:read:email scope)'),
  created_at: z.iso
    .datetime()
    .describe('Date when user was created (RFC3339 format)'),
});

export const twitchGetUsersResponseSchema = z.object({
  data: z.array(twitchUserSchema).describe('Array of user objects'),
});

export type TwitchUser = z.infer<typeof twitchUserSchema>;
export type TwitchGetUsersResponse = z.infer<
  typeof twitchGetUsersResponseSchema
>;
