import z from "zod";
import { addUserTwitchChannelSchema } from "../schemas/add-user-twitch-channel";

export type AddUserTwitchChannelDto = z.infer<typeof addUserTwitchChannelSchema>;
