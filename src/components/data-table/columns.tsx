"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PlayerData } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

// Role-specific color mapping
const roleColors = {
  citizen: "text-[#ff9344]",
  mafia: "text-[#fe1e4c]",
  don: "text-[#2787f5]",
  sheriff: "text-[#2acd91]",
};

// Utility function to color-code values
const colorizeValue = (
  value: number,
  type: "percentage" | "number" = "number",
  role?: "citizen" | "mafia" | "don" | "sheriff" | "overall" | "10_games"
) => {
  // Special case for overall winrate and 10 games avg points
  if (role === "overall" || role === "10_games") {
    return "text-black";
  }

  if (role && roleColors[role]) {
    return `${roleColors[role]} font-bold`;
  }

  let colorClass = "text-gray-500";

  if (type === "percentage") {
    if (value > 60) colorClass = "text-green-600 font-bold";
    else if (value > 50) colorClass = "text-yellow-600";
    else if (value > 40) colorClass = "text-orange-600";
    else colorClass = "text-red-600";
  } else {
    if (value > 100) colorClass = "text-green-600 font-bold";
    else if (value > 50) colorClass = "text-blue-600";
    else if (value > 25) colorClass = "text-yellow-600";
    else colorClass = "text-red-600";
  }

  return colorClass;
};

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

// Define the custom sorting order for player categories
const playerCategorySortOrder = [
  "Expert",
  "Advanced",
  "Intermediate",
  "Beginner",
  "Novice",
];

export const columns: ColumnDef<PlayerData>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const statsUrl = row.original.statsUrl;
      const name = row.getValue("name");
      return statsUrl ? (
        <Link
          href={statsUrl}
          target="_blank"
          className="text-blue-600 hover:underline"
        >
          {name as string}
        </Link>
      ) : (
        <span>{name as string}</span>
      );
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const year = row.original.year;
      return <div>{year || "N/A"}</div>;
    },
  },
  {
    accessorKey: "region",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Region
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const region = row.original.region;
      const mappedRegion = regionNameMap[region] || region;
      return <div>{mappedRegion ?? "N/A"}</div>;
    },
    enableSorting: true,
    filterFn: (row, columnId, filterValue) => {
      // Special case: show all rows for empty, null, or special filter
      if (
        !filterValue ||
        (Array.isArray(filterValue) &&
          (filterValue.length === 0 ||
            filterValue[0] === "__ALL__" ||
            filterValue[0] === ""))
      ) {
        return true;
      }

      // Defensive handling of row and region
      if (!row?.original?.region) return true;

      const region = row.original.region;
      const mappedRegion = regionNameMap[region] || region;

      // Normalize filter values
      const filterValues = Array.isArray(filterValue)
        ? filterValue
        : [filterValue];

      // Comprehensive matching logic
      return filterValues.some((val) => {
        // Direct match with region key
        if (val === region) return true;

        // Match with mapped region display name
        if (val === mappedRegion) return true;

        // Case-insensitive match with display name
        const normalizedVal = val.toLowerCase();
        const normalizedMappedRegion = mappedRegion.toLowerCase();

        // Check if the filter value matches the display name
        return normalizedVal === normalizedMappedRegion;
      });
    },
  },
  {
    accessorKey: "games",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Games
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const games = row.getValue("games");
      return (
        <div>{games != null ? (games as number).toLocaleString() : "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "citizen_games",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Citizen Games
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.citizen_games;
      return (
        <span className={colorizeValue(value, "number", "citizen")}>
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "sheriff_games",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sheriff Games
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.sheriff_games;
      return (
        <span className={colorizeValue(value, "number", "sheriff")}>
          {value}
        </span>
      );
    },
  },
  {
    accessorKey: "mafia_games",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Mafia Games
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.mafia_games;
      return (
        <span className={colorizeValue(value, "number", "mafia")}>{value}</span>
      );
    },
  },
  {
    accessorKey: "don_games",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Don Games
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.don_games;
      return (
        <span className={colorizeValue(value, "number", "don")}>{value}</span>
      );
    },
  },
  {
    accessorKey: "overall_winrate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Overall Winrate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.overall_winrate;
      return <span>{value}%</span>;
    },
  },
  {
    accessorKey: "citizen_winrate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Citizen Winrate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.citizen_winrate;
      return (
        <span className={colorizeValue(value, "percentage", "citizen")}>
          {value}%
        </span>
      );
    },
  },
  {
    accessorKey: "sheriff_winrate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sheriff Winrate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.sheriff_winrate;
      return (
        <span className={colorizeValue(value, "percentage", "sheriff")}>
          {value}%
        </span>
      );
    },
  },
  {
    accessorKey: "mafia_winrate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Mafia Winrate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.mafia_winrate;
      return (
        <span className={colorizeValue(value, "percentage", "mafia")}>
          {value}%
        </span>
      );
    },
  },
  {
    accessorKey: "don_winrate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Don Winrate
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.don_winrate;
      return (
        <span className={colorizeValue(value, "percentage", "don")}>
          {value}%
        </span>
      );
    },
  },
  {
    accessorKey: "extra_points_avg_10_games",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        10 Games Avg Points
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.extra_points_avg_10_games;
      return <span>{value ? value.toFixed(2) : "N/A"}</span>;
    },
  },
  {
    accessorKey: "extra_points_mafia_avg",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Mafia Avg Points
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.extra_points_mafia_avg;
      return (
        <span className={value ? colorizeValue(value, "number", "mafia") : ""}>
          {value ? value.toFixed(2) : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "extra_points_don_avg",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Don Avg Points
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.extra_points_don_avg;
      return (
        <span className={value ? colorizeValue(value, "number", "don") : ""}>
          {value ? value.toFixed(2) : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "extra_points_citizen_avg",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Citizen Avg Points
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.extra_points_citizen_avg;
      return (
        <span
          className={value ? colorizeValue(value, "number", "citizen") : ""}
        >
          {value ? value.toFixed(2) : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "extra_points_sheriff_avg",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sheriff Avg Points
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number;
      const b = rowB.getValue(columnId) as number;
      return a > b ? -1 : a < b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.original.extra_points_sheriff_avg;
      return (
        <span
          className={value ? colorizeValue(value, "number", "sheriff") : ""}
        >
          {value ? value.toFixed(2) : "N/A"}
        </span>
      );
    },
  },
  {
    accessorKey: "overall_rank",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Overall Rank
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const rank = row.original.overall_rank;
      return rank !== null ? rank : "N/A";
    },
    sortingFn: (rowA, rowB, columnId) => {
      const rankA = rowA.original.overall_rank;
      const rankB = rowB.original.overall_rank;

      // Prioritize 0 ranks to the end
      if (rankA === 0) return 1;
      if (rankB === 0) return -1;

      // Handle cases where rank might be undefined
      if (rankA === undefined && rankB === undefined) return 0;
      if (rankA === undefined) return 1; // undefined ranks go to the end
      if (rankB === undefined) return -1; // undefined ranks go to the end

      // Normal numeric comparison
      return rankA - rankB;
    },
  },
  {
    accessorKey: "citizen_rank",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Citizen Rank
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const rank = row.original.citizen_rank;
      return rank !== null ? rank : "N/A";
    },
    sortingFn: (rowA, rowB, columnId) => {
      const rankA = rowA.original.citizen_rank;
      const rankB = rowB.original.citizen_rank;

      // Prioritize 0 ranks to the end
      if (rankA === 0) return 1;
      if (rankB === 0) return -1;

      // Handle cases where rank might be undefined
      if (rankA === undefined && rankB === undefined) return 0;
      if (rankA === undefined) return 1; // undefined ranks go to the end
      if (rankB === undefined) return -1; // undefined ranks go to the end

      // Normal numeric comparison
      return rankA - rankB;
    },
  },
  {
    accessorKey: "sheriff_rank",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sheriff Rank
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const rank = row.original.sheriff_rank;
      return rank !== null ? rank : "N/A";
    },
    sortingFn: (rowA, rowB, columnId) => {
      const rankA = rowA.original.sheriff_rank;
      const rankB = rowB.original.sheriff_rank;

      // Prioritize 0 ranks to the end
      if (rankA === 0) return 1;
      if (rankB === 0) return -1;

      // Handle cases where rank might be undefined
      if (rankA === undefined && rankB === undefined) return 0;
      if (rankA === undefined) return 1; // undefined ranks go to the end
      if (rankB === undefined) return -1; // undefined ranks go to the end

      // Normal numeric comparison
      return rankA - rankB;
    },
  },
  {
    accessorKey: "mafia_rank",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Mafia Rank
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const rank = row.original.mafia_rank;
      return rank !== null ? rank : "N/A";
    },
    sortingFn: (rowA, rowB, columnId) => {
      const rankA = rowA.original.mafia_rank;
      const rankB = rowB.original.mafia_rank;

      // Prioritize 0 ranks to the end
      if (rankA === 0) return 1;
      if (rankB === 0) return -1;

      // Handle cases where rank might be undefined
      if (rankA === undefined && rankB === undefined) return 0;
      if (rankA === undefined) return 1; // undefined ranks go to the end
      if (rankB === undefined) return -1; // undefined ranks go to the end

      // Normal numeric comparison
      return rankA - rankB;
    },
  },
  {
    accessorKey: "don_rank",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Don Rank
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableSorting: true,
    cell: ({ row }) => {
      const rank = row.original.don_rank;
      return rank !== null ? rank : "N/A";
    },
    sortingFn: (rowA, rowB, columnId) => {
      const rankA = rowA.original.don_rank;
      const rankB = rowB.original.don_rank;

      // Prioritize 0 ranks to the end
      if (rankA === 0) return 1;
      if (rankB === 0) return -1;

      // Handle cases where rank might be undefined
      if (rankA === undefined && rankB === undefined) return 0;
      if (rankA === undefined) return 1; // undefined ranks go to the end
      if (rankB === undefined) return -1; // undefined ranks go to the end

      // Normal numeric comparison
      return rankA - rankB;
    },
  },
  {
    accessorKey: "player_category",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Player Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.original.player_category;
      return <div>{category ?? "N/A"}</div>;
    },
    enableSorting: true,
    sortingFn: (rowA, rowB, columnId) => {
      const categoryA = rowA.original.player_category;
      const categoryB = rowB.original.player_category;

      // Handle potential undefined values
      if (categoryA === undefined) return 1;
      if (categoryB === undefined) return -1;

      // Get the indices of categories in the custom sort order
      const indexA = playerCategorySortOrder.indexOf(categoryA);
      const indexB = playerCategorySortOrder.indexOf(categoryB);

      // If both categories are in the custom sort order, use that
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If one category is in the custom sort order, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // If neither category is in the custom sort order, use default string comparison
      return categoryA.localeCompare(categoryB, undefined, {
        sensitivity: "base",
      });
    },
  },
];
