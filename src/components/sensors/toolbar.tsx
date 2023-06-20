import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "~/ui/button";
import { Input } from "~/ui/input";
import { DataTableViewOptions } from "~/ui/table/table-view-options";

import { DataTableFacetedFilter } from "~/ui/table/table-faceted-filter";
import type { SensorData } from "./columns";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  const tableOptions = table.options.data as SensorData[];
  const locations = tableOptions.map((option) => option.location);
  const uniqueLocations = [...new Set(locations)];

  const locationOptions: { label: string; value: string }[] =
    uniqueLocations.map((location) => ({
      label: location,
      value: location,
    }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter ids..."
          value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("id")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("location") && (
          <DataTableFacetedFilter
            column={table.getColumn("location")}
            title="Location"
            options={locationOptions}
          />
        )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
