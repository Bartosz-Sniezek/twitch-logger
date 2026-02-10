import QUERY_KEYS from "@/constants/query-keys";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  AddedTwitchChannelItem,
  AddUserTwitchChannelDto,
  TwitchUsersResponse,
} from "@twitch-logger/shared";
import { apiRequest } from "./helpers/api-request";

async function searchAPI(username: string): Promise<TwitchUsersResponse> {
  return apiRequest<TwitchUsersResponse>(
    `/twitch/users?username=${encodeURIComponent(username)}`,
  );
}

export const addChannel = async (twitchUserId: string): Promise<void> => {
  return apiRequest("/twitch/channels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ twitchUserId } as AddUserTwitchChannelDto),
  });
};

export const removeChannel = async (twitchUserId: string): Promise<void> => {
  return apiRequest(`/twitch/channels/${twitchUserId}`, {
    method: "DELETE",
  });
};

export const startTwitchChannelLogging = async (
  twitchUserId: string,
): Promise<void> => {
  return apiRequest(`/twitch/channels/${twitchUserId}/start-logging`, {
    method: "POST",
  });
};

export const stopTwitchChannelLogging = async (
  twitchUserId: string,
): Promise<void> => {
  return apiRequest(`/twitch/channels/${twitchUserId}/stop-logging`, {
    method: "POST",
  });
};

export function useTwitchUserSearch(
  username: string,
): UseQueryResult<TwitchUsersResponse, Error> {
  return useQuery({
    queryKey: [QUERY_KEYS.TWITCH_USERS, username],
    queryFn: () => searchAPI(username),
    enabled: username.trim().length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}

export const useAddChannel = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TWITCH_USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ADDED_CHANNELS],
      });
    },
  });

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    addChannelMutation: mutation.mutate,
    addChannelMutationAsync: mutation.mutateAsync,
  };
};

export const useRemoveChannel = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: removeChannel,
    onMutate: async (twitchUserId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEYS.GET_ADDED_CHANNELS],
      });

      const previousChannels = queryClient.getQueryData([
        QUERY_KEYS.GET_ADDED_CHANNELS,
      ]);

      queryClient.setQueryData(
        [QUERY_KEYS.GET_ADDED_CHANNELS],
        (old: AddedTwitchChannelItem[]) => {
          if (!old) return old;
          return old.filter(
            (channel: any) => channel.twitchUserId !== twitchUserId,
          );
        },
      );

      return { previousChannels };
    },
    onError: (_err, _twitchUserId, context) => {
      if (context?.previousChannels) {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_ADDED_CHANNELS],
          context.previousChannels,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TWITCH_USERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ADDED_CHANNELS],
      });
    },
  });

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    removeChannelMutation: mutation.mutate,
    removeChannelMutationAsync: mutation.mutateAsync,
  };
};

export const useStartTwitchChannelLogging = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: startTwitchChannelLogging,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ADDED_CHANNELS],
      });
    },
  });

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    startTwitchChannelLoggingMutation: mutation.mutate,
    startTwitchChannelLoggingAsync: mutation.mutateAsync,
  };
};

export const useStopTwitchChannelLogging = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: stopTwitchChannelLogging,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ADDED_CHANNELS],
      });
    },
  });

  return {
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    stopTwitchChannelLoggingMutation: mutation.mutate,
    stopTwitchChannelLoggingAsync: mutation.mutateAsync,
  };
};
