/**
 * columns.tsx: A component that defines the columns for the sensor data table.
 *
 * @description This file exports an array of column definitions for the sensor data table. Each column definition includes an accessor key, header, and cell component. The table is built using the @tanstack/react-table library.
 *
 * @see {@link https://tanstack.com/table/v8/docs/guide/introduction}
 *
 * @example
 *
 * ```
 * import { columns } from '~/components/sensors/columns';
 * import { DataTable } from "~/ui/table/data-table";
 *
 * function SensorDataTable() {
 *   return (
 *     <DataTable columns={columns} data={sensorData} />
 *   );
 * }
 * ```
 *
 * @author
 * Lakee Sivaraya <ls914@cam.ac.uk>
 */

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { SortableColumn } from "ui";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "ui";

export type SensorData = {
  id: string;
  location: string;
  lastUpdateTimestamp: string | number;
  lastReading: Record<string, number>;
};

export const columns: ColumnDef<SensorData>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const data = row.original.id;
      return (
        <a href={`/sensors/live/${data}`} className="font-mono text-blue-500">
          {data}
        </a>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "lastUpdateTimestamp",
    id: "lastUpdateTimestamp",
    header: ({ column }) => {
      return <SortableColumn column={column} title="Last Update" />;
    },
    cell: ({ row }) => {
      const data = row.original.lastUpdateTimestamp;

      // check if data is a number and convert to date
      if (!isNaN(Number(data))) {
        const date = new Date(Number(data) * 1000);
        return <span>{date.toLocaleString()}</span>;
      }

      return <span>{data}</span>;
    },
  },
  {
    accessorKey: "lastReading",
    header: "Last Reading",
    cell: ({ row }) => {
      const data = row.original.lastReading;
      let stringified = JSON.stringify(data, null, 2) || "";
      // remove first and last curly braces
      stringified = stringified.slice(2, -2);
      // remove quotation marks
      stringified = stringified.replace(/"/g, "");
      stringified = stringified.replace(/,/g, "");

      return (
        <span className="line-clamp-4 whitespace-pre font-mono transition-all ease-in-out hover:line-clamp-none">
          {stringified}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sensorData: SensorData = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                const res = navigator.clipboard.writeText(
                  JSON.stringify(sensorData.lastReading)
                );
                console.log(res);
              }}
            >
              Copy Reading
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const res = navigator.clipboard.writeText(
                  JSON.stringify(sensorData)
                );
                console.log(res);
              }}
            >
              Copy Row Data (JSON)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                const { id } = sensorData;
                const url = `/sensors/live/${id}`;
                window.open(url, "_blank");
              }}
            >
              Plot Data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
