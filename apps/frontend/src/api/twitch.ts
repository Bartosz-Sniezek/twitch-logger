import { useQuery, UseQueryResult } from "@tanstack/react-query";

export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  description: string;
  created_at: string;
  broadcaster_type: string;
}

export interface SearchResult {
  data: TwitchUser[];
}

async function searchAPI(username: string): Promise<SearchResult> {
  const response = await fetch(
    `http://localhost:8080/twitch/users?username=${encodeURIComponent(username)}`
  );
  if (!response.ok) throw new Error("Search failed");
  return response.json();
}

export function useTwitchUserSearch(
  username: string
): UseQueryResult<SearchResult, Error> {
  return useQuery({
    queryKey: ["twitch_user", username],
    queryFn: () => searchAPI(username),
    enabled: username.trim().length >= 3,
    staleTime: 5 * 60 * 1000,
  });
}
