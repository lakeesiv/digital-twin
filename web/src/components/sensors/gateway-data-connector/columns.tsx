import type { ColumnDef } from "@tanstack/react-table";
import { SortableColumn } from "ui";

export type GatewayDataConnectorRow = {
  id: string;
  type: "Gateway" | "Data Connector";
  lastUpdateTimestamp: string | number;
  lastReading: Record<string, number>;
};

export const columns: ColumnDef<GatewayDataConnectorRow>[] = [
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
    accessorKey: "type",
    header: "Type",
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
];
