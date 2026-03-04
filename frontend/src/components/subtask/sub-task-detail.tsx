import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import type { Subtask } from "app/types";
import {
  ArrowLeftRightIcon,
  CheckCircleIcon,
  PlusCircleIcon,
  PlusIcon,
  Trash2Icon,
  XCircleIcon,
} from "lucide-react";
import * as React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { subTaskColumns } from "./sub-task-columns";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import {
  useAddSubTaskMutation,
  useCompleteSubTaskMutation,
} from "app/hooks/use-task";
import { toast } from "sonner";
import { SubTaskView } from "./sub-task-view-dialog";
import { SubTaskCreate } from "./sub-task-create-dialog";
type Props = {
  taskId: string;
  subTasks: Subtask[];
};

export const SubTaskDetail = ({ taskId, subTasks }: Props) => {
  const { mutate: completeSubTask } = useCompleteSubTaskMutation();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );

  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [selectedSubtask, setSelectedSubtask] = React.useState<Subtask | null>(
    null,
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const handleToggleCompleted = (subTask: Subtask) => {
    completeSubTask(
      {
        taskId,
        subTaskId: subTask._id,
        completed: !subTask.completed,
      },
      {
        onSuccess: () => {
          toast.success("Update sub task status successfully");
        },
        onError: () => {
          toast.error("Failed to complete sub task");
        },
      },
    );
  };

  const handleDeleteSubTask = (subTaskId: String) => {};
  const handleViewSubtask = (subtask: Subtask) => {
    setSelectedSubtask(subtask);
    setOpenViewDialog(true);
  };

  const table = useReactTable({
    data: subTasks,
    columns: subTaskColumns(
      taskId,
      handleToggleCompleted,
      handleDeleteSubTask,
      handleViewSubtask,
    ),
    state: { columnFilters, sorting, pagination, columnVisibility },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!subTasks.length) {
    return (
      <div className="rounded-md border p-4 text-sm italic text-muted-foreground">
        No subtasks
      </div>
    );
  }
  const hasSelectedRow = table.getSelectedRowModel().rows.length > 0;

  const totalCount = subTasks.length;
  const completedCount = subTasks.filter((t) => t.completed).length;
  const incompleteCount = totalCount - completedCount;

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const pages = React.useMemo(() => {
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    const result: number[] = [];
    result.push(0);

    const start = Math.max(pageIndex - 1, 1);
    const end = Math.min(pageIndex + 1, pageCount - 2);

    for (let i = start; i <= end; i++) {
      result.push(i);
    }
    result.push(pageCount - 1);

    return Array.from(new Set(result));
  }, [pageIndex, pageCount]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* Search */}
        <Input
          placeholder="Filter subtask..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="h-9 w-60 text-sm"
        />

        {/* Status filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 border-dashed text-sm">
              <PlusCircleIcon className="mr-2 size-4" />
              {table.getColumn("completed")?.getFilterValue() === true
                ? "Completed"
                : table.getColumn("completed")?.getFilterValue() === false
                  ? "Incomplete"
                  : "All"}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem
              onClick={() =>
                table.getColumn("completed")?.setFilterValue(undefined)
              }
              className="flex items-center justify-between"
            >
              <span>All</span>
              <Badge variant="secondary" className="text-[10px]">
                {totalCount}
              </Badge>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => table.getColumn("completed")?.setFilterValue(true)}
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <CheckCircleIcon className="size-4 text-green-600" />
                Completed
              </span>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 text-[10px]"
              >
                {completedCount}
              </Badge>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                table.getColumn("completed")?.setFilterValue(false)
              }
              className="flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <XCircleIcon className="size-4 text-red-500" />
                Incomplete
              </span>
              <Badge
                variant="secondary"
                className="bg-red-100 text-red-700 text-[10px]"
              >
                {incompleteCount}
              </Badge>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <ArrowLeftRightIcon className="ml-1 size-4" />
                View
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-sm text-center font-bold">
                  Toggle View
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllLeafColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {COLUMN_LABELS[column.id] ?? column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          {hasSelectedRow && (
            <Button variant="destructive" className="h-9 text-sm">
              <Trash2Icon className="size-4" />
            </Button>
          )}
          <Button
            className="h-9 text-sm"
            onClick={() => setOpenCreateDialog(true)}
          >
            <PlusIcon className="size-4" />
          </Button>
          <SubTaskCreate
            taskId={taskId}
            open={openCreateDialog}
            onOpenChange={setOpenCreateDialog}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onDoubleClick={() => handleViewSubtask(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-2">
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
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {selectedSubtask && (
          <SubTaskView
            open={openViewDialog}
            onOpenChange={setOpenViewDialog}
            subtask={selectedSubtask}
          />
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-2">
        {/* Info */}
        <div className="text-xs text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          -{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length}
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          {/* Previous */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>

          {/* Page numbers */}
          {pages.map((page, idx) => {
            const prev = pages[idx - 1];

            return (
              <React.Fragment key={page}>
                {prev !== undefined && page - prev > 1 && (
                  <span className="px-1 text-muted-foreground">…</span>
                )}

                <Button
                  size="sm"
                  variant={pageIndex === page ? "default" : "outline"}
                  className="h-8 w-8 px-0"
                  onClick={() => table.setPageIndex(page)}
                >
                  {page + 1}
                </Button>
              </React.Fragment>
            );
          })}

          {/* Next */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const COLUMN_LABELS: Record<string, string> = {
  select: "Select",
  title: "Sub Task",
  createdAt: "Created At",
  updatedAt: "Updated At",
  completed: "Status",
  actions: "Actions",
};
