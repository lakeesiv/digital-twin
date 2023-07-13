/**
 * toolbar.tsx: A component that renders the toolbar for the sensor data table.
 *
 * @description This file exports a React component that renders the toolbar for the sensor data table. The toolbar contains various filter options and a search bar to filter the data in the table. The component receives a Table object as a prop and uses it to filter the data in the table.
 *
 * @example
 *
 * ```
 * import { DataTableToolbar } from '~/components/sensors/toolbar';
 * import { useTable } from '@tanstack/react-table';
 * import { columns } from './columns';
 * import { data } from './data';
 *
 * function SensorPage() {
 *   const table = useTable({ columns, data });
 *
 *   return (
 *     <div>
 *       <h1>Sensor Page</h1>
 *       <DataTableToolbar table={table} />
 *       <DataTable table={table} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param {Object} props The props object that contains the Table object.
 * @param {Table} props.table The Table object that contains the data to be displayed in the table.
 *
 * @returns {JSX.Element} A React component that renders the toolbar for the sensor data table.
 *
 *
 * @author
 * Lakee Sivaraya <ls914@cam.ac.uk>
 */

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button, DataTableViewOptions, Input } from "ui";

import { DataTableFacetedFilter } from "ui";
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
