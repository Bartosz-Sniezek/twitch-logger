"use client";

import { useState } from "react";
import { SearchBar } from "./components/search-bar";
import { useTwitchUserSearch } from "@/api/twitch";
import { TwitchUserSearchResults } from "./components/search-results";
import { useDebounce } from "@/hooks/use-debounce";
import { ChannelsTable } from "./components/channels-table";

export default function Channels() {
  const [username, setUsername] = useState<string>("");
  const debouncedUsername = useDebounce(username, 500);
  const { data, error, isLoading } = useTwitchUserSearch(debouncedUsername);

  return (
    <div className="flex flex-col w-full max-w-[2000px] m-auto p-4 gap-3">
      <div className="space-y-4 p-6">
        <h3 className="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight ">
          Twitch.tv user searcher
        </h3>
        <SearchBar value={username} onChange={setUsername} />
        {isLoading && <p>Loading...</p>}
        {error && <p>Error</p>}
        {!isLoading && !error && data && (
          <TwitchUserSearchResults result={data} />
        )}
      </div>
      <hr></hr>
      <ChannelsTable />
    </div>
  );
}
