import type { ColumnDef } from "@tanstack/react-table";
import { SortableColumn } from "ui";

export type GatewayDataConnectorRow = {
  id: string;
  type: "Gateway" | "Data Connector";
  timestamp: string | number;
  lastReading: Record<string, number | string>;
};

export const columns: ColumnDef<GatewayDataConnectorRow>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const data = row.original.id;
      return <p className="font-mono text-blue-500">{data}</p>;
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
    accessorKey: "timestamp",
    id: "timestamp",
    header: ({ column }) => {
      return <SortableColumn column={column} title="Timestamp" />;
    },
    cell: ({ row }) => {
      const data = row.original.timestamp;
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
