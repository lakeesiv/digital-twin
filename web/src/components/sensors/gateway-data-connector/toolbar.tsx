import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button, DataTableViewOptions, Input } from "ui";

import { DataTableFacetedFilter } from "ui";
import type { GatewayDataConnectorRow } from "./columns";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getPreFilteredRowModel().rows.length >
    table.getFilteredRowModel().rows.length;

  const tableOptions = table.options.data as GatewayDataConnectorRow[];
  const type = tableOptions.map((option) => option.type);
  const uniqueTypes = [...new Set(type)];

  const typeOptions: { label: string; value: string }[] = uniqueTypes.map(
    (type) => ({
      label: type,
      value: type,
    })
  );

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
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Type"
            options={typeOptions}
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
