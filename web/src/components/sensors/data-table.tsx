/**
 * DataTable: A reusable table component for displaying data.
 *
 * @template TData - The type of data to be displayed in the table.
 * @template TValue - The type of value for each column in the table.
 *
 * @param {DataTableProps<TData, TValue>} props - The props for the DataTable component.
 * @param {ColumnDef<TData, TValue>[]} props.columns - An array of column definitions for the table.
 * @param {TData[]} props.data - An array of data to be displayed in the table.
 *
 * @returns {JSX.Element} - A React component that renders a table with the given data and columns.
 *
 * @description This file contains the DataTable component, which is a reusable table component for displaying data. The component takes in an array of column definitions and an array of data to be displayed in the table. The component also includes features such as sorting, filtering, and pagination. The table is built using the @tanstack/react-table library.
 *
 * @example
 *
 * ```
 * import { DataTable } from '~/ui/data-table';
 *
 * const columns = [
 *   {
 *     header: 'Name',
 *     accessor: 'name',
 *   },
 *   {
 *     header: 'Age',
 *     accessor: 'age',
 *   },
 *   {
 *     header: 'Email',
 *     accessor: 'email',
 *   },
 * ];
 *
 * const data = [
 *   {
 *     name: 'John Doe',
 *     age: 25,
 *     email: 'john.doe@example.com',
 *   },
 *   {
 *     name: 'Jane Smith',
 *     age: 30,
 *     email: 'jane.smith@example.com',
 *   },
 *   {
 *     name: 'Bob Johnson',
 *     age: 40,
 *     email: 'bob.johnson@example.com',
 *   },
 * ];
 *
 * function App() {
 *   return (
 *     <DataTable columns={columns} data={data} />
 *   );
 * }
 * ```
 *
 * @see {@link https://tanstack.com/table/v8/docs/guide/introduction}
 *
 * @author
 * Lakee Sivaraya <ls914@cam.ac.uk>
 */

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui";

import { DataTablePagination } from "ui";
import { DataTableToolbar } from "./toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [mounted, setMounted] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
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
                  key={row.id}
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
      <DataTablePagination table={table} />
    </div>
  );
}
