import { removeChannel } from "@/api/twitch";
import { Button } from "@/components/ui/button";
import QUERY_KEYS from "@/constants/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface RemoveButtonProps {
  channelId: string;
}

export const RemoveButton = ({ channelId }: RemoveButtonProps) => {
  const queryClient = useQueryClient();
  const { isPending, mutate: removeChannelCall } = useMutation({
    mutationFn: (twitchUserId: string) => removeChannel(twitchUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TWITCH_USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ADDED_CHANNELS],
      });
    },
  });

  return (
    <Button disabled={isPending} onClick={() => removeChannelCall(channelId)}>
      Remove
    </Button>
  );
};
