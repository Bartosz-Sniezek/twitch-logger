"use client";

import { useMemo } from "react";
import {
  GetAddedTwitchChannelsQuery,
  TwitchChannelsSortBy,
} from "@twitch-logger/shared";
import { SortOrder } from "@twitch-logger/shared/common";
import { useState } from "react";
import { useDebounce } from "./use-debounce";
import { useDateRange } from "./use-date-range";
import { useQuery } from "@tanstack/react-query";
import QUERY_KEYS from "@/constants/query-keys";
import { getAddedTwitchChannels } from "@/api/get-added-twitch-channels";

export interface ChannelsTableFilters {
  page: number;
  pageSize: number;
  sortBy?: TwitchChannelsSortBy;
  sortOrder?: SortOrder;
  searchQuery: string;
}

export const useChannelsTable = () => {
  const pageSizes = [10, 20, 50, 100];
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<TwitchChannelsSortBy | undefined>(
    TwitchChannelsSortBy.LOGIN
  );
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(
    SortOrder.ASC
  );
  const [searchQuery, setSearchQuery] = useState("");
  const deboucedSearchQuery = useDebounce(searchQuery, 500);
  const createdAtDateRange = useDateRange();
  const accountCreatedAtDateRange = useDateRange();

  const queryParams: GetAddedTwitchChannelsQuery = useMemo(() => {
    const params: GetAddedTwitchChannelsQuery = {
      page,
      page_size: pageSize,
    };

    if (sortBy) params.sort_by = sortBy;
    if (sortOrder) params.sort_order = sortOrder;
    if (deboucedSearchQuery.length >= 2)
      params.search_phrase = deboucedSearchQuery;
    const createdAtRangeISO = createdAtDateRange.toISO();

    if (createdAtRangeISO.from) params.created_at_from = createdAtRangeISO.from;
    if (createdAtRangeISO.to) params.created_at_to = createdAtRangeISO.to;

    const accountCreatedAtRangeISO = accountCreatedAtDateRange.toISO();

    if (accountCreatedAtRangeISO.from)
      params.account_created_at_from = accountCreatedAtRangeISO.from;
    if (accountCreatedAtRangeISO.to)
      params.account_created_at_to = accountCreatedAtRangeISO.to;

    return params;
  }, [
    page,
    pageSize,
    sortBy,
    sortOrder,
    deboucedSearchQuery,
    createdAtDateRange,
    accountCreatedAtDateRange,
  ]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEYS.GET_ADDED_CHANNELS, queryParams],
    queryFn: () => getAddedTwitchChannels(queryParams),
    placeholderData: (prev) => prev,
  });

  const handleSort = (column: TwitchChannelsSortBy) => {
    if (sortBy === column) {
      if (sortOrder === SortOrder.ASC) {
        setSortOrder(SortOrder.DESC);
      } else if (sortOrder === SortOrder.DESC) {
        setSortBy(undefined);
        setSortOrder(undefined);
      }
    } else {
      setSortBy(column);
      setSortOrder(SortOrder.ASC);
    }
  };

  return {
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
  };
};
