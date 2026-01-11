import z from "zod";

export const addTwitchChannelSchema = z.object({
  twitchUserId: z.string(),
});
