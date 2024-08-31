"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: string;
  quality: number;
  description: string;
  imageUrl: string;
};

export default function Page() {
  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        disableToggleVisibility: true,
      },
      {
        header: "Price",
        accessorKey: "price",
        sortDescFirst: true,
        sortingFn: (rowA: Row<Product>, rowB: Row<Product>) =>
          Number(rowA.original.price) - Number(rowB.original.price),
      },
      {
        header: "Quality",
        accessorKey: "quality",
      },
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Image URL",
        accessorKey: "imageUrl",
      },
    ],
    []
  );

  const data: Product[] = useMemo(
    () => [
      {
        id: "1",
        name: "name",
        price: "12",
        quality: 2,
        description: "description",
        imageUrl: "url",
      },
      {
        id: "2",
        name: "name2",
        price: "125",
        quality: 4,
        description: "description2",
        imageUrl: "url",
      },
      {
        id: "3",
        name: "name2",
        price: "1",
        quality: 2,
        description: "description2",
        imageUrl: "url",
      },
      {
        id: "4",
        name: "name2",
        price: "156",
        quality: 1,
        description: "description2",
        imageUrl: "url",
      },
    ],
    []
  );

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "name",
      desc: false,
    },
    {
      id: "price",
      desc: true,
    },
    {
      id: "quality",
      desc: true,
    },
    {
      id: "description",
      desc: true,
    },
    {
      id: "imageUrl",
      desc: true,
    },
  ]);

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
  });

  return (
    <div className="p-2">
      <div className="inline-block border border-black shadow rounded">
        <div className="px-1 border-b border-black">
          <label>
            <input
              {...{
                type: "checkbox",
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />
            Toggle All
          </label>
        </div>
        {table.getAllLeafColumns().map((column) => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />
                {column.id}
              </label>
            </div>
          );
        })}
      </div>
      <table
        {...{
          style: {
            width: table.getCenterTotalSize(),
          },
        }}
        className="border border-gray-300"
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="border-b border-r border-gray-300 px-4 py-2"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        //TODO: remove unnecercery check
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : header.column.getNextSortingOrder() === "desc"
                            ? "Sort descending"
                            : "Clear sort"
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                  <div
                    {...{
                      onDoubleClick: () => header.column.resetSize(),
                      onMouseDown: header.getResizeHandler(),
                      onTouchStart: header.getResizeHandler(),
                      className: `resizer ${
                        table.options.columnResizeDirection
                      } ${header.column.getIsResizing() ? "isResizing" : ""}`,
                    }}
                  />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <td
                    key={cell.id}
                    {...{
                      style: {
                        width: cell.column.getSize(),
                      },
                    }}
                    className="border-b border-r border-gray-300 px-4 py-2"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
