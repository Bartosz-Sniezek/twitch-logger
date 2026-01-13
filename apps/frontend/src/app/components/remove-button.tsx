import { useRemoveChannel } from "@/api/twitch";
import { Button } from "@/components/ui/button";

export interface RemoveButtonProps {
  channelId: string;
}

export const RemoveButton = ({ channelId }: RemoveButtonProps) => {
  const { isPending, removeChannelCall } = useRemoveChannel();
  return (
    <Button disabled={isPending} onClick={() => removeChannelCall(channelId)}>
      Remove
    </Button>
  );
};
