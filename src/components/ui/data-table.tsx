"use client"

// components
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Trash,
  Settings2,
  PlusIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import CreateUserModal from "@/components/admin/users/create-user"
import { Button } from "@/components/ui/button"

// hooks
import { useConfirm } from "@/lib/hooks/utils/use-confirm"
import { useReactTable } from "@tanstack/react-table"
import { useRouter } from "next-nprogress-bar"
import { useMemo, useState } from "react"

// utils
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"
import { AnimatePresence, motion } from "framer-motion"
import { deepSearch } from "@/lib/utils"
import * as React from "react"

// types
import type {
  Row,
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table"

import type { Appointment, AppointmentDate } from "@/lib/types"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDelete?: (rows: Row<TData>[]) => void
  disabled?: boolean
  isOnUsers?: boolean
  isOnProperties?: boolean
  isOnPayments?: boolean
  isOnClient?: boolean
  isOnClientAppointments?: boolean
  noBulkDelete?: boolean
  placeholder: string
  appointment?: Appointment[]
  appointmentDates?: AppointmentDate[]
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  onDelete,
  disabled,
  isOnUsers,
  isOnProperties,
  noBulkDelete,
  isOnClient,
  placeholder,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to perform a bulk delete.",
  )
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [filterValue, setFilterValue] = useState<string>("")
  const filteredData = useMemo(
    () => data.filter((item) => deepSearch(item, filterValue)),
    [data, filterValue],
  )

  // init table
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
  })

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length
  const memoizedRows = useMemo(
    () => table.getRowModel().rows,
    [table.getRowModel().rows],
  )

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
              id="filter-input"
              type="text"
              label="Search..."
              placeholder={placeholder}
              disabled={disabled}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-auto shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AnimatePresence>
              {/* delete */}
              {!noBulkDelete && selectedRowsCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    disabled={disabled}
                    size="sm"
                    variant="outline"
                    className=" text-xs font-normal shadow-sm"
                    onClick={async () => {
                      const ok = await confirm()

                      if (ok) {
                        onDelete?.(table.getFilteredSelectedRowModel().rows)
                        table.resetRowSelection()
                      }
                    }}
                  >
                    <Trash className="mr-2 size-4" />
                    Delete ({table.getFilteredSelectedRowModel().rows.length})
                  </Button>
                </motion.div>
              )}

              {/* create new user */}
              {isOnUsers && !isOnClient && <CreateUserModal />}
            </AnimatePresence>

            {/* create new property */}
            {isOnProperties && !isOnClient && (
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm"
                onClick={() => router.push("/admin/properties/new")}
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

      <ScrollArea className="h-[calc(100vh-220px)] rounded-md border md:h-[calc(100vh-200px)]">
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
            <AnimatePresence>
              {memoizedRows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={row.getIsSelected() ? "bg-muted/50" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
            {table.getRowModel().rows.length === 0 && (
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
            <ChevronLeft className="size-6" />
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
