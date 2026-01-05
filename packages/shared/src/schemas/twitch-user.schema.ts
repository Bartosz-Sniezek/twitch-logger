import z from "zod";

export const twitchUserSchema = z.object({
  id: z.string(),
  login: z.string(),
  display_name: z.string(),
  profile_image_url: z.string(),
  description: z.string(),
  created_at: z.iso.datetime(),
  broadcaster_type: z.string(),
});

export const twitchUsersResponseSchema = z.object({
  data: z.array(twitchUserSchema),
});
