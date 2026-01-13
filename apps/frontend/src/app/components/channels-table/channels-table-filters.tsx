import { Input } from "@/components/ui/input";
import { UseDateRangeReturn } from "@/hooks/use-date-range";
import { Search } from "lucide-react";
import { DateRangeFilter } from "./date-range-filter";

export interface ChannelsTableFiltersParams {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  createdAtDateRange: UseDateRangeReturn;
  accountCreatedAtDateRange: UseDateRangeReturn;
}

export const ChannelsTableFilters = ({
  onSearchChange,
  searchQuery,
  createdAtDateRange,
  accountCreatedAtDateRange,
}: ChannelsTableFiltersParams) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative self-end flex-1 min-w-[250px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DateRangeFilter label="Added at" dateRange={createdAtDateRange} />
      <DateRangeFilter
        label="Twitch account created at"
        dateRange={accountCreatedAtDateRange}
      />
    </div>
  );
};
