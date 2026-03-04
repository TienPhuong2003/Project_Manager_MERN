import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown, ScanEye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  PencilIcon,
  Trash2,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatDateTime } from "@/helper/format-day-time";
import type { Subtask } from "app/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ConfirmDeleteDialog } from "../ui/alert-delete";

export const subTaskColumns = (
  taskId: string,
  onToggleCompleted: (subTask: Subtask) => void,
  onDelete: (subTaskId: string) => void,
  onView: (subTask: Subtask) => void,
): ColumnDef<Subtask>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Sub Task",
    size: 999,
    cell: ({ row }) => (
      <span
        className={`
        block max-w-40 truncate
        ${row.original.completed ? "line-through text-muted-foreground" : ""}
      `}
      >
        {row.getValue("title")}
      </span>
    ),
    enableHiding: false
  },
  {
    id: "createdAt",
    accessorFn: (row) => new Date(row.createdAt).getTime(),
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="px-0 flex items-center justify-start text-left"
        onClick={column.getToggleSortingHandler()}
      >
        Created At
        {{
          asc: <ArrowUp className="ml-1 size-3" />,
          desc: <ArrowDown className="ml-1 size-3" />,
        }[column.getIsSorted() as string] ?? (
          <ArrowUpDown className="ml-1 size-3 opacity-50" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
    enableSorting: true,
    size: 140,
  },
  {
    id: "updatedAt",
    accessorFn: (row) => new Date(row.updatedAt).getTime(),
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="px-0 flex items-center justify-start text-left"
        onClick={column.getToggleSortingHandler()}
      >
        Updated At
        {{
          asc: <ArrowUp className="ml-1 size-3" />,
          desc: <ArrowDown className="ml-1 size-3" />,
        }[column.getIsSorted() as string] ?? (
          <ArrowUpDown className="ml-1 size-3 opacity-50" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {formatDateTime(row.original.updatedAt)}
      </span>
    ),
    enableSorting: true,
    size: 140,
  },
  {
    id: "completed",
    accessorFn: (row) => row.completed,
    header: () => <div className="flex justify-center">Status</div>,
    cell: ({ row }) => {
      const completed = row.original.completed;

      return (
        <div className="flex justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => onToggleCompleted(row.original)}
                className="transition hover:scale-110"
              >
                {completed ? (
                  <CheckCircle2 className="size-5 text-green-500" />
                ) : (
                  <Clock className="size-5 text-orange-400" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {completed ? <p>Done</p> : <p>In Progress</p>}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (filterValue === undefined) return true;
      return row.getValue(columnId) === filterValue;
    },
    size: 60,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onView(row.original);
            }}
          >
            <ScanEye className="mr-2 size-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PencilIcon className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>
          <ConfirmDeleteDialog
            title="Delete this sub task?"
            description="Are you sure to delete this sub task"
            onConfirm={() => onDelete(row.original._id)}
            trigger={
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    size: 40,
    enableHiding: false,
  },
];
