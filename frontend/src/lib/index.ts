import type { ProjectStatus, TaskStatus } from "app/types";

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

export const getProjectProgress = (tasks: {status: TaskStatus}[]) => {
  const totalTask = tasks.length;
  const completedTask = tasks.filter((task) => task?.status === "Done").length;
  const progress = totalTask > 0 ? Math.round((completedTask / totalTask)*100) : 0;
  return progress
}
