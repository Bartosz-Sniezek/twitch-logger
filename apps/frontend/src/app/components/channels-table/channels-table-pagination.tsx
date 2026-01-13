import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { GetAddedTwitchChannelsPaginatedResponse } from "@twitch-logger/shared";
import { Check, ChevronsUpDown } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export interface ChannelsTablePaginationParams {
  data: GetAddedTwitchChannelsPaginatedResponse;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: (value: number) => void;
  isLoading: boolean;
}

export const ChannelsTablePagination = ({
  data,
  page,
  setPage,
  pageSize,
  setPageSize,
  isLoading,
}: ChannelsTablePaginationParams) => {
  const pageSizes = [10, 20, 50, 100];
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {data ? (page - 1) * pageSize + 1 : 0} to{" "}
        {data ? Math.min(page * pageSize, data.totalItems) : 0} of{" "}
        {data?.totalItems ?? 0} results
      </div>
      <div className="flex items-center space-x-4">
        <p className="text-muted-foreground text-sm">Page size</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[80px] justify-between"
            >
              {pageSize}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {pageSizes.map((size) => (
                    <CommandItem
                      key={size}
                      value={size.toString()}
                      onSelect={(currentValue) => {
                        setPageSize(
                          parseInt(currentValue) === pageSize
                            ? pageSize
                            : parseInt(currentValue)
                        );
                        setOpen(false);
                      }}
                    >
                      {size}
                      <Check
                        className={cn(
                          "ml-auto",
                          pageSize === size ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={cn(
                  page === 1 || isLoading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                )}
              />
            </PaginationItem>

            <PaginationItem>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  max={data?.totalPages ?? 1}
                  value={page}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= (data?.totalPages ?? 1)) {
                      setPage(value);
                    }
                  }}
                  className="w-16 h-9 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground">
                  of {data?.totalPages ?? 0}
                </span>
              </div>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => p + 1)}
                className={cn(
                  !data || page >= data.totalPages || isLoading
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
