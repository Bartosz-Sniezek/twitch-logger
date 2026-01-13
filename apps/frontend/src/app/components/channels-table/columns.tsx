import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  AddedTwitchChannelItem,
  TwitchChannelsSortBy,
} from "@twitch-logger/shared";
import { SortOrder } from "@twitch-logger/shared/common";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown, Radio } from "lucide-react";

interface CreateColumnsOptions {
  sortBy?: TwitchChannelsSortBy;
  sortOrder?: SortOrder;
  handleSort: (col: TwitchChannelsSortBy) => void;
}

export const createColumns = ({
  sortBy,
  sortOrder,
  handleSort,
}: CreateColumnsOptions): ColumnDef<AddedTwitchChannelItem>[] => [
  {
    accessorKey: "profileImageUrl",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center justify-center w-10 h-10 min-w-[40px]">
        <img
          src={row.original.profileImageUrl}
          alt={row.original.displayName}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "displayName",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => handleSort(TwitchChannelsSortBy.DISPLAY_NAME)}
          className="hover:bg-accent"
        >
          Display Name
          {sortBy === TwitchChannelsSortBy.DISPLAY_NAME &&
            (sortOrder === SortOrder.ASC ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
          {sortBy !== TwitchChannelsSortBy.DISPLAY_NAME && (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-40" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "login",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => handleSort(TwitchChannelsSortBy.LOGIN)}
          className="hover:bg-accent"
        >
          Login
          {sortBy === TwitchChannelsSortBy.LOGIN &&
            (sortOrder === SortOrder.ASC ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
          {sortBy !== TwitchChannelsSortBy.LOGIN && (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-40" />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-md truncate">{row.original.description}</div>
    ),
  },
  {
    accessorKey: "broadcasterType",
    header: "Type",
  },
  {
    accessorKey: "channelCreatedAt",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => handleSort(TwitchChannelsSortBy.ACCOUNT_CREATED_AT)}
          className="hover:bg-accent"
        >
          Channel Created
          {sortBy === TwitchChannelsSortBy.ACCOUNT_CREATED_AT &&
            (sortOrder === SortOrder.ASC ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
          {sortBy !== TwitchChannelsSortBy.ACCOUNT_CREATED_AT && (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) =>
      format(new Date(row.original.channelCreatedAt), "MMM d, yyyy"),
  },
  {
    accessorKey: "createdAt",
    header: () => {
      return (
        <Button
          variant="ghost"
          onClick={() => handleSort(TwitchChannelsSortBy.CREATED_AT)}
          className="hover:bg-accent"
        >
          Added On
          {sortBy === TwitchChannelsSortBy.CREATED_AT &&
            (sortOrder === SortOrder.ASC ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            ))}
          {sortBy !== TwitchChannelsSortBy.CREATED_AT && (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-40" />
          )}
        </Button>
      );
    },
    cell: ({ row }) => format(new Date(row.original.createdAt), "MMM d, yyyy"),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="default"
        size="sm"
        onClick={() => alert("not implemented yet/in progress")}
        className="gap-2"
      >
        <Radio className="h-4 w-4" />
        Start Logging
      </Button>
    ),
  },
];
