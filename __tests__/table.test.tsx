import { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { Table } from "../app/Table";

interface IProduct {
  id: string;
  name: string;
  price: string;
  quality: number;
  description: string;
  imageUrl: string;
}

const mockColumns: ColumnDef<IProduct>[] = [
  { header: "Name", accessorKey: "name", enableHiding: false },
  {
    header: "Price",
    accessorKey: "price",
    sortingFn: (rowA: Row<IProduct>, rowB: Row<IProduct>) =>
      Number(rowA.original.price) - Number(rowB.original.price),
  },
  { header: "Quality", accessorKey: "quality" },
  { header: "Description", accessorKey: "description" },
  { header: "Image URL", accessorKey: "imageUrl" },
];

const mockData: IProduct[] = [
  {
    id: "1",
    name: "Apple",
    price: "10",
    quality: 4,
    description: "Fresh apple",
    imageUrl: "apple.jpg",
  },
  {
    id: "2",
    name: "Banana",
    price: "5",
    quality: 3,
    description: "Ripe banana",
    imageUrl: "banana.jpg",
  },
  {
    id: "3",
    name: "Cherry",
    price: "15",
    quality: 5,
    description: "Sweet cherry",
    imageUrl: "cherry.jpg",
  },
];

const defaultSort: SortingState = [
  { id: "name", desc: false },
  { id: "price", desc: true },
];

describe("Table Component", () => {
  it("renders the table with correct headers and rows", () => {
    render(
      <Table data={mockData} columns={mockColumns} defaultSort={defaultSort} />
    );

    const headers = screen.getAllByRole("columnheader");

    // Check that table columns are rendered
    expect(headers[0]).toHaveTextContent("Name");
    expect(headers[1]).toHaveTextContent("Price");
    expect(headers[2]).toHaveTextContent("Quality");
    expect(headers[3]).toHaveTextContent("Description");
    expect(headers[4]).toHaveTextContent("Image URL");

    // Check that the table rows are rendered with correct data
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Cherry")).toBeInTheDocument();
  });

  it("toggles sorting when column headers are clicked", () => {
    render(
      <Table data={mockData} columns={mockColumns} defaultSort={defaultSort} />
    );

    const priceHeader = screen.getByText("Price", {
      exact: false,
      selector: "th > div",
    });

    // Verify initial sorting
    expect(priceHeader).toHaveTextContent("🔽");

    // Click to clear sorting
    fireEvent.click(priceHeader);
    expect(priceHeader).not.toHaveTextContent("🔼");
    expect(priceHeader).not.toHaveTextContent("🔽");

    // Click again to sort in ascending order
    fireEvent.click(priceHeader);
    expect(priceHeader).toHaveTextContent("🔼");
  });

  it("toggles column visibility using checkboxes", () => {
    render(
      <Table data={mockData} columns={mockColumns} defaultSort={defaultSort} />
    );

    const toggleAllCheckbox = screen.getByLabelText("Toggle All");

    // Hide all columns
    fireEvent.click(toggleAllCheckbox);
    mockColumns.forEach((col) => {
      if (col.enableHiding !== false) {
        expect(
          screen.queryByText(col.header as string, {
            exact: false,
            selector: "th > div",
          })
        ).not.toBeInTheDocument();
      } else {
        expect(
          screen.queryByText(col.header as string, {
            exact: false,
            selector: "th > div",
          })
        ).toBeInTheDocument();
      }
    });

    // Show all columns again
    fireEvent.click(toggleAllCheckbox);
    mockColumns.forEach((col) => {
      expect(
        screen.getByText(col.header as string, {
          exact: false,
          selector: "th > div",
        })
      ).toBeInTheDocument();
    });
  });

  it("applies default sorting on initial render", () => {
    render(
      <Table data={mockData} columns={mockColumns} defaultSort={defaultSort} />
    );

    const headers = screen.getAllByRole("columnheader");

    // Check the initial sort indicator for the "Name" column (ascending)
    expect(headers[0]).toHaveTextContent("🔼");

    // Check the initial sort indicator for the "Price" column (descending)
    expect(headers[1]).toHaveTextContent("🔽");
  });

  it("sorts the table data correctly when a column header is clicked", () => {
    render(
      <Table data={mockData} columns={mockColumns} defaultSort={defaultSort} />
    );

    // Verify initial order
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("Apple");
    expect(rows[2]).toHaveTextContent("Banana");
    expect(rows[3]).toHaveTextContent("Cherry");

    // Click the Price header to sort ascending
    const priceHeader = screen.getByText("Price", {
      exact: false,
      selector: "th > div",
    });
    fireEvent.click(priceHeader);
    fireEvent.click(priceHeader);

    // Verify sorting order
    const sortedRows = screen.getAllByRole("row");
    expect(sortedRows[1]).toHaveTextContent("Banana");
    expect(sortedRows[2]).toHaveTextContent("Apple");
    expect(sortedRows[3]).toHaveTextContent("Cherry");
  });
});
