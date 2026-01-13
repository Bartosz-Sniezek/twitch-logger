import { addChannelToUser } from "@/api/twitch";
import { Button } from "@/components/ui/button";
import QUERY_KEYS from "@/constants/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface AddButtonProps {
  channelId: string;
}

export const AddButton = ({ channelId: twitchUserId }: AddButtonProps) => {
  const queryClient = useQueryClient();
  const { isPending, mutate: addChannelCall } = useMutation({
    mutationFn: (twitchUserId: string) => addChannelToUser(twitchUserId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TWITCH_USERS],
      });
    },
  });

  return (
    <Button disabled={isPending} onClick={() => addChannelCall(twitchUserId)}>
      Add
    </Button>
  );
};
