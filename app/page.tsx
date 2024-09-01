"use client";

import { Row, SortingState } from "@tanstack/react-table";
import { useMemo } from "react";
import { Table } from "./Table";

type Product = {
  id: string;
  name: string;
  price: string;
  quality: number;
  description: string;
  imageUrl: string;
};

const data: Product[] = [
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
];

const defaultSort: SortingState = [
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
];

export default function Page() {
  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableHiding: false,
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

  return (
    <Table<Product> data={data} columns={columns} defaultSort={defaultSort} />
  );
}
