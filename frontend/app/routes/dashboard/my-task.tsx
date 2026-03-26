import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { priorityConfig, statusConfig } from "@/lib";
import { cn } from "@/lib/utils";
import { useMyTaskQuery } from "app/hooks/use-task";
import type { Task } from "app/types";
import { format } from "date-fns";
import { useMemo } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  FilterIcon,
  Folder,
  PenIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import MyTaskCard from "@/components/task/my-task-card";

const MyTasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get("filter") || "all";
  const initialSort = searchParams.get("sort") || "desc";
  const initialSearch = searchParams.get("search") || "";
  const tabActive = searchParams.get("tab") || "list";

  const [filter, setFilter] = useState<string>(initialFilter);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSort === "asc" ? "asc" : "desc",
  );
  const [search, setSearch] = useState<string>(initialSearch);


  const { data: myTasks, isLoading } = useMyTaskQuery() as {
    data: Task[];
    isLoading: boolean;
  };


  useEffect(() => {
  const timer = setTimeout(() => {
    setSearch(search);
  }, 300);

  return () => clearTimeout(timer);
}, [search]);
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
    const urlFilter = searchParams.get("filter") || "all";
    const urlSort = searchParams.get("sort") || "desc";
    const urlSearch = searchParams.get("search") || "";

    if (urlFilter !== filter) setFilter(urlFilter);
    if (urlSort !== sortDirection)
      setSortDirection(urlSort === "asc" ? "asc" : "desc");
    if (urlSearch !== search) setSearch(urlSearch);
  }, [searchParams]);

  

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  //filter
  const filteredTasks = useMemo(() => {
    if (!myTasks?.length) return [];

    return myTasks
      .filter((task) => {
        if (filter === "all") return true;
        if (filter === "todo") return task.status === "To Do";
        if (filter === "inprogress") return task.status === "In Progress";
        if (filter === "completed") return task.status === "Completed";
        if (filter === "cancelled") return task.status === "Cancelled";
        if (filter === "archived") return task.isArchived;
        if (filter === "high") return task.priority === "High";
        return true;
      })
      .filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()),
      );
  }, [myTasks, filter, search]);

  //sort
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return sortDirection === "asc"
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      return 0;
    });
  }, [filteredTasks, sortDirection]);

  const boardTasks = useMemo(() => {
    return {
      todo: sortedTasks.filter((t) => t.status === "To Do"),
      inprogress: sortedTasks.filter((t) => t.status === "In Progress"),
      completed: sortedTasks.filter((t) => t.status === "Completed"),
      cancelled: sortedTasks.filter((t) => t.status === "Cancelled"),
    };
  }, [sortedTasks]);
  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex flex-col items-start md:flex-row gap-2" itemScope>
          <Button
            variant={"outline"}
            onClick={() =>
              setSortDirection(sortDirection === "asc" ? "desc" : "asc")
            }
          >
            {sortDirection === "asc" ? "Oldest" : "Newest"}
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

              <DropdownMenuCheckboxItem
                checked={filter === "all"}
                onCheckedChange={() => setFilter("all")}
              >
                All
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={filter === "todo"}
                onCheckedChange={() => setFilter("todo")}
              >
                To Do
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={filter === "inprogress"}
                onCheckedChange={() => setFilter("inprogress")}
              >
                In Progress
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={filter === "completed"}
                onCheckedChange={() => setFilter("completed")}
              >
                Completed
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={filter === "cancelled"}
                onCheckedChange={() => setFilter("cancelled")}
              >
                Cancelled
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={filter === "archived"}
                onCheckedChange={() => setFilter("archived")}
              >
                Archived
              </DropdownMenuCheckboxItem>

              <DropdownMenuCheckboxItem
                checked={filter === "high"}
                onCheckedChange={() => setFilter("high")}
              >
                High
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs
        value={tabActive}
        onValueChange={(value) => {
          searchParams.set("tab", value);
          setSearchParams(searchParams);
        }}
      >
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardDescription>
                {sortedTasks?.length} tasks assigned to you
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="divide-y">
                {sortedTasks?.map((task) => {
                  const status = statusConfig[task.status];
                  const priority = task.priority
                    ? priorityConfig[task.priority]
                    : null;
                  const StatusIcon = status?.icon;
                  return (
                    <div
                      key={task._id}
                      className="p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        {/* LEFT */}
                        <div className="flex items-start gap-3">
                          <div className="flex items-center mt-1">
                            {StatusIcon && (
                              <StatusIcon
                                className={`size-4 ${status.className}`}
                              />
                            )}
                          </div>

                          <div className="space-y-1">
                            <Link
                              to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                              className="font-semibold hover:text-primary hover:underline transition-colors flex items-center gap-1"
                            >
                              {task.title}
                              <ArrowUpRight className="size-4" />
                            </Link>

                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              {status && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs px-2 py-0.5 rounded-md",
                                    status.className.includes("green") &&
                                      "bg-green-100 text-green-700 border-green-200",
                                    status.className.includes("blue") &&
                                      "bg-blue-100 text-blue-700 border-blue-200",
                                    status.className.includes("red") &&
                                      "bg-red-100 text-red-700 border-red-200",
                                    status.className.includes("muted") &&
                                      "bg-muted text-muted-foreground",
                                  )}
                                >
                                  {task.status}
                                </Badge>
                              )}

                              {priority && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs px-2 py-0.5 rounded-md",
                                    priority.className.includes("red") &&
                                      "bg-red-100 text-red-700 border-red-200",
                                    priority.className.includes("yellow") &&
                                      "bg-yellow-100 text-yellow-700 border-yellow-200",
                                    priority.className.includes("muted") &&
                                      "bg-gray-100 text-gray-700 border-gray-200",
                                  )}
                                >
                                  {task.priority}
                                </Badge>
                              )}

                              {task.isArchived && (
                                <Badge
                                  variant="outline"
                                  className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                                >
                                  Archived
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <div className="text-sm grid grid-cols-[18px_65px_1fr] items-start gap-x-2 gap-y-2 md:min-w-[320px]">
                          <Calendar className="h-4 w-4 text-red-500 mt-0.5" />
                          <div className="font-medium text-red-500">Due:</div>
                          <div className="font-medium text-foreground">
                            {task.dueDate ? format(task.dueDate, "PPPP") : "—"}
                          </div>

                          <Folder className="h-4 w-4 text-blue-500 mt-0.5" />
                          <div className="font-medium text-blue-500">
                            Project:
                          </div>
                          <div className="font-semibold text-foreground truncate min-w-0">
                            {task.project?.title || "—"}
                          </div>

                          <PenIcon className="h-4 w-4 text-amber-500 mt-0.5" />
                          <div className="font-medium text-amber-500">
                            Modified:
                          </div>
                          <div className="text-muted-foreground">
                            {format(task.updatedAt, "PPPP")}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {sortedTasks?.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No Task found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="board">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-muted/30 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-semibold">
                  To Do
                  <Badge variant="secondary" className="text-xs">
                    {boardTasks.todo?.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 space-y-3 max-h-150 overflow-y-auto contain-content">
                {boardTasks.todo.map((task) => (<MyTaskCard key={task._id} task={task}/>))}

                {boardTasks.todo?.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No Tasks found
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-semibold">
                  In Progress
                  <Badge variant="secondary" className="text-xs">
                    {boardTasks.inprogress?.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 space-y-3 max-h-150 overflow-y-auto">
                {boardTasks.inprogress.map((task) => (<MyTaskCard key={task._id} task={task}/>))}

                {boardTasks.inprogress?.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No Tasks found
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-semibold">
                  Completed
                  <Badge variant="secondary" className="text-xs">
                    {boardTasks.completed?.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 space-y-3 max-h-150 overflow-y-auto">
                {boardTasks.completed.map((task) => (<MyTaskCard key={task._id} task={task}/>))}

                {boardTasks.completed?.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No Tasks found
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-muted">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-sm font-semibold">
                  Cancelled
                  <Badge variant="secondary" className="text-xs">
                    {boardTasks.cancelled?.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-3 space-y-3 max-h-150 overflow-y-auto">
                {boardTasks.cancelled.map((task) => (<MyTaskCard key={task._id} task={task}/>))}

                {boardTasks.cancelled?.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No Tasks found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;
