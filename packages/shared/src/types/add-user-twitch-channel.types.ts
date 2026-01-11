import z from "zod";
import { addTwitchChannelSchema } from "../schemas/add-twitch-channel";

export type AddUserTwitchChannelDto = z.infer<typeof addTwitchChannelSchema>;
