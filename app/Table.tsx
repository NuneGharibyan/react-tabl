"use client";

import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Header,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ReactElement, useState } from "react";

interface ITableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  defaultSort: SortingState;
}

const Table = <T,>({ data, columns, defaultSort }: ITableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>(defaultSort);

  const table = useReactTable({
    columns,
    data,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    defaultColumn: {
      maxSize: 500,
    },
  });

  // Renders the column visibility toggles, allowing users to show/hide columns
  const renderColumnVisibility = (): ReactElement => {
    return (
      <div className="inline-block border border-black shadow rounded m-[8px]">
        <div className="px-1 border-b border-black">
          <label>
            <input
              type={"checkbox"}
              checked={table.getIsAllColumnsVisible()}
              onChange={table.getToggleAllColumnsVisibilityHandler()}
            />
            Toggle All
          </label>
        </div>
        {table.getAllLeafColumns().map(
          (column) =>
            column.getCanHide() && (
              <div key={column.id} className="px-1">
                <label>
                  <input
                    type={"checkbox"}
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                  {column.id}
                </label>
              </div>
            )
        )}
      </div>
    );
  };

  // Renders the main table
  const renderTable = (): ReactElement => {
    return (
      <div className="overflow-x-auto lg:min-w-full">
        <table
          style={{ width: table.getCenterTotalSize() }}
          className="border border-gray-300 table-auto border-collapse w-full"
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => renderHeader(header))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => renderCell(cell))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Renders table header
  const renderHeader = (header: Header<T, unknown>): ReactElement => {
    const sortIndicator: string | null =
      {
        asc: " 🔼",
        desc: " 🔽",
      }[header.column.getIsSorted() as string] ?? null;

    return (
      <th
        key={header.id}
        colSpan={header.colSpan}
        className="group relative border-b border-r border-gray-300 px-4 py-2"
      >
        {header.isPlaceholder ? null : (
          <div
            className={"cursor-pointer select-none"}
            onClick={header.column.getToggleSortingHandler()}
            title={getHeaderTooltip(header)}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}{" "}
            {sortIndicator}
          </div>
        )}
        {renderResizeIndicator(header)}
      </th>
    );
  };

  // Generates the tooltip text
  const getHeaderTooltip = (header: Header<T, unknown>): string | undefined => {
    return header.column.getCanSort()
      ? header.column.getNextSortingOrder() === "asc"
        ? "Sort ascending"
        : header.column.getNextSortingOrder() === "desc"
        ? "Sort descending"
        : "Clear sort"
      : undefined;
  };

  // Renders the resize handle for each header
  const renderResizeIndicator = (header: Header<T, unknown>): ReactElement => {
    return (
      <div
        onDoubleClick={() => header.column.resetSize()}
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`absolute top-0 h-full w-[5px] bg-black/50 cursor-col-resize select-none touch-none right-0 opacity-0 group-hover:opacity-100 transition-opacity ${
          header.column.getIsResizing() ? "bg-blue-500 opacity-100" : ""
        }`}
      />
    );
  };

  // Renders each cell in a row with the appropriate data
  const renderCell = (cell: Cell<T, unknown>) => {
    return (
      <td
        key={cell.id}
        style={{
          width: cell.column.getSize(),
        }}
        className="border-b border-r border-gray-300 px-4 py-2"
      >
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </td>
    );
  };

  // Main component render
  return (
    <div className="p-2">
      {renderColumnVisibility()}
      {renderTable()}
    </div>
  );
};

export { Table };
