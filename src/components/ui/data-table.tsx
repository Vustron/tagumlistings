"use client"

// components
// import CreateReportModal from "@/components/modals/create-report"
import CreateUserModal from "@/app/(admin)/users/_components/create-user"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronLeft,
  ChevronRight,
  PlusIcon,
  Settings2,
  Trash,
} from "lucide-react"

// hooks
import { useConfirm } from "@/lib/hooks/use-confirm"
import { useReactTable } from "@tanstack/react-table"

// utils
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"
import * as React from "react"

// types
import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { useRouter } from "next-nprogress-bar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterKey: string
  onDelete: (rows: Row<TData>[]) => void
  disabled?: boolean
  isOnUsers?: boolean
  isOnProperties?: boolean
  placeholder: string
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onDelete,
  disabled,
  isOnUsers,
  isOnProperties,
  placeholder,
}: DataTableProps<TData, TValue>) {
  // init router
  const router = useRouter()

  // confirmation state
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to perform a bulk delete accounts.",
  )

  // init sorting state
  const [sorting, setSorting] = React.useState<SortingState>([])

  // column filters state
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )

  // select state
  const [rowSelection, setRowSelection] = React.useState({})

  // init visibility state
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  // init table
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div>
      <ConfirmDialog />

      <ScrollArea>
        <ScrollBar orientation="horizontal" />
        <div className="flex flex-row justify-between gap-5">
          {/* actions */}
          <div className="ml-1 flex py-4 items-center gap-5">
            {/* search */}
            <FloatingLabelInput
              id={`${filterKey}`}
              type="text"
              label={`Filter ${filterKey}...`}
              placeholder={placeholder}
              disabled={disabled}
              value={
                (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(filterKey)?.setFilterValue(event.target.value)
              }
              className="w-auto shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* delete */}
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <Button
                disabled={disabled}
                size="sm"
                variant="outline"
                className=" text-xs font-normal shadow-sm"
                onClick={async () => {
                  const ok = await confirm()

                  if (ok) {
                    onDelete(table.getFilteredSelectedRowModel().rows)
                    table.resetRowSelection()
                  }
                }}
              >
                <Trash className="mr-2 size-4" />
                Delete ({table.getFilteredSelectedRowModel().rows.length})
              </Button>
            )}

            {/* create new user */}
            {isOnUsers && <CreateUserModal />}

            {/* create ne report */}
            {isOnProperties && (
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm"
                onClick={() => router.push("/properties/new")}
              >
                <PlusIcon className="mr-2 size-4" aria-hidden="true" />
                New Property
              </Button>
            )}

            {/* visibility */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-normal mr-1 shadow-sm"
                >
                  <Settings2 className="mr-2 size-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ScrollArea>

      <ScrollArea className="h-[calc(80vh-220px)] rounded-md border md:h-[calc(80dvh-200px)]">
        <Table className="relative">
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
                            header.getContext(),
                          )}
                    </TableHead>
                  )
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
                        cell.getContext(),
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="max-sm:flex-col max-sm:justify-center flex items-center justify-end space-x-2 py-4">
        {/* no of rows selected */}
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="max-sm:mt-4 flex flex-row text-center items-center justify-between gap-2">
          {/* pagination */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-6 " />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}
