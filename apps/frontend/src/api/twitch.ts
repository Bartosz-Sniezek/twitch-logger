import QUERY_KEYS from "@/constants/query-keys";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  AddUserTwitchChannelDto,
  TwitchUsersResponse,
} from "@twitch-logger/shared";

async function searchAPI(username: string): Promise<TwitchUsersResponse> {
  const response = await fetch(
    `http://localhost:8080/twitch/users?username=${encodeURIComponent(username)}`
  );
  if (!response.ok) throw new Error("Search failed");
  return response.json();
}

export function useTwitchUserSearch(
  username: string
): UseQueryResult<TwitchUsersResponse, Error> {
  return useQuery({
    queryKey: [QUERY_KEYS.TWITCH_USERS, username],
    queryFn: () => searchAPI(username),
    enabled: username.trim().length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}

export const addChannelToUser = async (twitchUserId: string): Promise<void> => {
  await fetch(`http://localhost:8080/twitch/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(<AddUserTwitchChannelDto>{
      twitchUserId,
    }),
  });
};

export const removeChannel = async (twitchUserId: string): Promise<void> => {
  await fetch(`http://localhost:8080/twitch/channels/${twitchUserId}`, {
    method: "DELETE",
  });
};

export const useRemoveChannel = () => {
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

  return { isPending, removeChannelCall };
};
