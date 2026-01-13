import { useAddChannel } from "@/api/twitch";
import { Button } from "@/components/ui/button";

export interface AddButtonProps {
  channelId: string;
}

export const AddButton = ({ channelId: twitchUserId }: AddButtonProps) => {
  const { isPending, addChannelMutation } = useAddChannel();

  return (
    <Button
      disabled={isPending}
      onClick={() => addChannelMutation(twitchUserId)}
    >
      Add
    </Button>
  );
};
