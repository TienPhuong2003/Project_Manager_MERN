import type { ProjectStatus, TaskStatus } from "app/types";
import { CheckCircle, Clock, Loader, Flag, XCircle } from "lucide-react";
export const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "verify-email",
  "/forgot-password",
  "/reset-password",
  "/",
];

export const getProjectStatusColor = (status: string) => {
  switch (status) {
    case "Planning":
      return "bg-blue-100 text-blue-700";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700";
    case "Completed":
      return "bg-green-100 text-green-700";
    case "On Hold":
      return "bg-gray-200 text-gray-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const statusConfig = {
  "To Do": {
    icon: Clock,
    className: "text-muted-foreground",
  },
  "In Progress": {
    icon: Loader,
    className: "text-blue-600",
  },
  "Completed": {
    icon: CheckCircle,
    className: "text-green-600",
  },

  "Cancelled": {
    icon: XCircle,
    className: "text-red-600",
  },
};

export const priorityConfig = {
  Low: {
    icon: Flag,
    className: "text-muted-foreground",
  },
  Medium: {
    icon: Flag,
    className: "text-yellow-600",
  },
  High: {
    icon: Flag,
    className: "text-red-600",
  },
};

export const getProjectProgress = (tasks: {status: TaskStatus}[]) => {
  const totalTask = tasks.length;
  const completedTask = tasks.filter((task) => task?.status === "Completed").length;
  const progress = totalTask > 0 ? Math.round((completedTask / totalTask)*100) : 0;
  return progress
}
