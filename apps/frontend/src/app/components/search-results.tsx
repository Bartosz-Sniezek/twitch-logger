import { TwitchUsersResponse } from "@twitch-logger/shared";
import ChannelCard from "./channel-card";

export interface SearchResultsProps {
  result: TwitchUsersResponse;
}

export function TwitchUserSearchResults({ result }: SearchResultsProps) {
  if (result.data === null) {
    return (
      <div className="p-4 text-sm text-muted-foreground">No results found</div>
    );
  }

  return (
    <div className="flex flex-row">
      <ChannelCard
        key={result.data.id}
        channel={result.data}
        isAdded={result.isAdded}
      />
    </div>
  );
}
