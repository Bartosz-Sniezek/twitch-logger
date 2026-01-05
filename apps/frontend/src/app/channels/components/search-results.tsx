import { TwitchUsersResponse } from "@twitch-logger/shared";
import ChannelCard from "./channel-card";

export interface SearchResultsProps {
  results: TwitchUsersResponse;
}

export function TwitchUserSearchResults({ results }: SearchResultsProps) {
  if (results.data.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">No results found</div>
    );
  }

  return (
    <div className="flex flex-row">
      {results.data.map((result) => (
        <ChannelCard key={result.id} channel={result} />
      ))}
    </div>
  );
}
