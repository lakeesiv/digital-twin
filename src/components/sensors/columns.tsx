import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "~/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/ui/dropdown-menu";

export type SensorData = {
  id: string;
  location: string;
  lastUpdateTimestamp: string;
  lastReading: object;
};

export const columns: ColumnDef<SensorData>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const data = row.original.id;
      return (
        <a href={`/sensors/${data}`} className="font-mono text-blue-500">
          {data}
        </a>
      );
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "lastUpdateTimestamp",
    header: "Last Update",
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
      const stringified = JSON.stringify(data, null, 2);
      // const stringified = JSON.stringify(data);
      return (
        <span className="whitespace-pre font-mono transition-all ease-in-out line-clamp-4 hover:line-clamp-none">
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
                const url = `/sensors/${id}`;
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
