import z from "zod";

export const addUserTwitchChannelSchema = z.object({
  twitchUserId: z.string(),
});
