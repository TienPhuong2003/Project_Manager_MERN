import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { useMyTaskQuery } from "app/hooks/use-task";
import type { Task } from "app/types";
import { FilterIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const inititalFilter = searchParams.get("filter") || "all";
  const inititalSort = searchParams.get("sort") || "desc";
  const inititalSearch = searchParams.get("search") || "";

  const [filter, setFilter] = useState<string>(inititalFilter);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    inititalSort === "asc" ? "asc" : "desc",
  );
  const [search, setSearch] = useState<string>(inititalSearch);

  const { data: myTasks, isLoading } = useMyTaskQuery() as {
    data: Task[];
    isLoading: boolean;
  };

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    params.filter = filter;
    params.sort = sortDirection;
    params.search = search;

    setSearchParams(params, { replace: true });
  }, [filter, sortDirection, search]);

  useEffect(() => {
    const urlFilter = searchParams.get("filter") || "all"
    const urlSort = searchParams.get("sort") || "desc"
    const urlSearch  = searchParams.get("search") || ""

    if (urlFilter !== filter) setFilter(urlFilter)
    if (urlSort !== sortDirection) setSortDirection(urlSort === "asc" ? "asc" : "desc")
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  //filter
  const filtererdTasks =
    myTasks?.length > 0
      ? myTasks
          .filter((task) => {
            if (filter === "all") return true;
            if (filter === "todo") return task.status === "To Do";
            if (filter === "inprogress") return task.status === "In Progress";
            if (filter === "completed") return task.status === "Completed";
            if (filter === "cancelled") return task.status === "Cancelled";
            if (filter === "archived") return task.isArchived === true;
            if (filter === "high") return task.priority === "High";

            return true;
          })
          .filter(
            (task) =>
              task.title.toLowerCase().includes(search.toLowerCase()) ||
              task.description
                ?.toLocaleLowerCase()
                .includes(search.toLowerCase()),
          )
      : [];

  //sort
  const sortedTasks = [...filtererdTasks].sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return sortDirection === "asc"
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div
          className="flex flex-col items-start md:flex-row md"
          itemScope
          gap-2
        >
          <Button
            variant={"outline"}
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
          >
            {sortDirection === "asc" ? "Oldest First" : "Newest First"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={"outline"}>
                <FilterIcon className="w-4 h-4" /> Filter
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("todo")}>
                To Do
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("inprogress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("cancelled")}>
                Cancelled
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("archived")}>
                Archived
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("high")}>
                High
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Input placeholder="Search tasks .... "
      />
    </div>
  );
};

export default MyTasks;
