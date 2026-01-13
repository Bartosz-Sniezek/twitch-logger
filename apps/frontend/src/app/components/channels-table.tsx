import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { createColumns } from "./channels-table/columns";
import { ChannelsTableFilters } from "./channels-table/channels-table-filters";
import { useChannelsTable } from "@/hooks/use-channels-table";
import { ChannelsTableContent } from "./channels-table/channels-table-content";
import { ChannelsTablePagination } from "./channels-table/channels-table-pagination";
import { useRemoveChannel } from "@/api/twitch";

export const ChannelsTable = () => {
  const {
    data,
    isLoading,
    isError,
    page,
    pageSize,
    sortBy,
    sortOrder,
    searchQuery,
    createdAtDateRange,
    accountCreatedAtDateRange,
    setPage,
    setPageSize,
    setSearchQuery,
    handleSort,
  } = useChannelsTable();
  const { removeChannelCall } = useRemoveChannel();
  const columns = createColumns({
    sortBy,
    sortOrder,
    handleSort,
    handleDelete: (item) => removeChannelCall(item.twitchUserId),
  });
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: data?.totalPages ?? 0,
  });

  return (
    <div className="space-y-4 p-6">
      <ChannelsTableFilters
        createdAtDateRange={createdAtDateRange}
        accountCreatedAtDateRange={accountCreatedAtDateRange}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      <ChannelsTableContent
        table={table}
        columnsLength={columns.length}
        isError={isError}
        isLoading={isLoading}
      />
      <ChannelsTablePagination
        data={data}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  );
};
