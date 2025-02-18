"use client";

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  FilterFn,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { XIcon } from "lucide-react";
import { CheckIcon } from "lucide-react";

import { PlayerData } from "@/types";

// Declare fuzzy filter type
declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
}

// Custom fuzzy filter implementation
const fuzzyFilter = <TData extends { id: string; region: string }>(
  row: Row<TData>,
  columnId: string,
  value: string,
  addMeta: (meta: any) => void
): boolean => {
  // If the filter value is empty, show all rows
  if (!value) return true;

  const itemValue = row.getValue(columnId);

  // Convert both to lowercase for case-insensitive comparison
  const rowValueString = String(itemValue).toLowerCase();
  const filterValueString = String(value).toLowerCase();

  // Simple substring match
  return rowValueString.includes(filterValueString);
};

interface DataTableProps<TData extends { id: string; region: string }> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData extends { id: string; region: string }>({
  columns,
  data,
}: DataTableProps<TData>) {
  // Get unique years for filtering, sorted in descending order
  const years = Array.from(new Set(data.map((item: any) => item.year))).sort(
    (a, b) => b - a
  );

  const defaultYear = years[0];

  // Region name mapping
  const regionNameMap: { [key: string]: string } = {
    central: "Central",
    chernozem_region: "Chernozem",
    far_east: "Far East",
    north: "North",
    siberia_and_ural: "Siberia and Ural",
    south: "South",
    volga_region: "Volga",
  };

  // Extract unique regions from data with mapped names
  const uniqueRegions = Array.from(
    new Set(
      data
        .map((item) => item.region)
        .filter(
          (region): region is string => region !== undefined && region !== null
        )
    )
  )
    .sort()
    .map((region) => regionNameMap[region] || region);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([
    { id: "year", value: String(defaultYear) },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Default page size
  });

  // Type guard to safely extract year filter
  const getYearFilter = (filters: ColumnFiltersState): string | undefined => {
    const yearFilter = filters.find((filter) => filter.id === "year");
    const yearValue = yearFilter ? yearFilter.value : `${defaultYear}`;
    return yearValue !== undefined ? String(yearValue) : undefined;
  };

  // Get current region filter
  const getRegionFilter = (
    filters: ColumnFiltersState
  ): string[] | undefined => {
    const regionFilter = filters.find((filter) => filter.id === "region");
    if (regionFilter) {
      // Convert original region keys to mapped names
      const regions = Array.isArray(regionFilter.value)
        ? (regionFilter.value as string[])
        : [regionFilter.value as string];

      return regions.map((region) => regionNameMap[region] || region);
    }
    return undefined;
  };

  const selectedYear = getYearFilter(columnFilters);
  const selectedRegion = getRegionFilter(columnFilters);

  // Reverse mapping for filtering
  const regionFilterMap = Object.fromEntries(
    Object.entries(regionNameMap).map(([k, v]) => [v, k])
  );

  // Update column filters while preserving other filters
  const updateColumnFilters = (newFilter: {
    id: string;
    value: string | string[];
  }) => {
    setColumnFilters((prevFilters) => {
      // Remove existing filter for the same column
      const filteredPrevFilters = prevFilters.filter(
        (filter) => filter.id !== newFilter.id
      );

      // Add new filter if value is not empty
      return newFilter.value
        ? [
            ...filteredPrevFilters,
            {
              id: newFilter.id,
              value: newFilter.value,
            },
          ]
        : filteredPrevFilters;
    });
  };

  const table = useReactTable<TData>({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter as FilterFn<TData>,
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter as FilterFn<TData>,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Filters Container */}
      <div className="flex items-center space-x-4 py-4">
        {/* Global Search */}
        <Input
          placeholder="Search all fields..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />

        {/* Year Filter */}
        <div className="flex items-center space-x-2">
          <Select
            value={selectedYear}
            onValueChange={(value: string) => {
              updateColumnFilters({ id: "year", value });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Year</SelectLabel>
                {years.map((year) => (
                  <SelectItem key={year} value={`${year}`}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start">
                {selectedRegion && selectedRegion.length > 0
                  ? selectedRegion[0]
                  : "Select Regions"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search regions..." />
                <CommandList>
                  <CommandEmpty>No regions found.</CommandEmpty>
                  <CommandGroup>
                    {uniqueRegions.map((region) => {
                      // Convert the current region to its mapped name
                      const mappedRegion = regionNameMap[region] || region;

                      // Check if the region (either original or mapped) is selected
                      const isSelected = selectedRegion?.some(
                        (selectedR) =>
                          selectedR === region || selectedR === mappedRegion
                      );

                      return (
                        <CommandItem
                          key={region}
                          value={region}
                          onSelect={() => {
                            // Convert display name back to original region key
                            const originalRegion =
                              regionFilterMap[region] || region;

                            // If the region is already selected, remove it
                            const currentRegions = selectedRegion || [];
                            const newRegions = currentRegions.includes(
                              mappedRegion
                            )
                              ? currentRegions.filter((r) => r !== mappedRegion)
                              : [...currentRegions, mappedRegion];

                            // Update filters with the new regions
                            // If no regions are selected, pass an empty array to show all data
                            updateColumnFilters({
                              id: "region",
                              value:
                                newRegions.length > 0
                                  ? newRegions.map(
                                      (r) =>
                                        Object.keys(regionNameMap).find(
                                          (key) => regionNameMap[key] === r
                                        ) || r
                                    )
                                  : [""], // Pass an empty string to show all data
                            });
                          }}
                        >
                          <div className="mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary">
                            {isSelected && (
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <span>{mappedRegion}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                  {selectedRegion && selectedRegion.length > 0 && (
                    <>
                      <CommandList>
                        <CommandGroup>
                          <CommandItem
                            onSelect={() => {
                              // Remove region filter
                              setColumnFilters(
                                columnFilters.filter(
                                  (filter) => filter.id !== "region"
                                )
                              );
                            }}
                            className="text-red-500"
                          >
                            Clear Regions
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Page Number Buttons */}
            {table.getPageCount() > 0 && (
              <div className="flex items-center space-x-1">
                {table.getPageCount() > 5 && table.getState().pagination.pageIndex > 2 && (
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.setPageIndex(0)}
                  >
                    1
                  </Button>
                )}
                
                {table.getPageCount() > 5 && table.getState().pagination.pageIndex > 2 && (
                  <span className="text-sm">...</span>
                )}

                {[...Array(Math.min(5, table.getPageCount()))].map((_, index) => {
                  const pageNumber = 
                    table.getState().pagination.pageIndex < 2
                      ? index
                      : table.getState().pagination.pageIndex - 2 + index;
                  
                  // Adjust for last pages
                  const adjustedPageNumber = 
                    table.getState().pagination.pageIndex >= table.getPageCount() - 3
                      ? table.getPageCount() - 5 + index
                      : pageNumber;
                  
                  if (adjustedPageNumber < 0 || adjustedPageNumber >= table.getPageCount()) return null;
                  
                  return (
                    <Button
                      key={adjustedPageNumber}
                      variant={adjustedPageNumber === table.getState().pagination.pageIndex ? "default" : "outline"}
                      className="h-8 w-8 p-0"
                      onClick={() => table.setPageIndex(adjustedPageNumber)}
                    >
                      {adjustedPageNumber + 1}
                    </Button>
                  );
                })}
                
                {table.getPageCount() > 5 && table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                  <span className="text-sm">...</span>
                )}
                
                {table.getPageCount() > 5 && table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  >
                    {table.getPageCount()}
                  </Button>
                )}
              </div>
            )}
            
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
