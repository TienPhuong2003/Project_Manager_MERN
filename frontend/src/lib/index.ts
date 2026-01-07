import type { ProjectStatus } from "app/types";

export const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "verify-email",
  "/forgot-password",
  "/reset-password",
  "/",
];

export const getProjectStatusColor = (status: ProjectStatus) => {
  switch (status) {
    case "Planning":
      return "bg-blue-100 text-blue-700 border border-blue-200";

    case "In Progress":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";

    case "Completed":
      return "bg-green-100 text-green-700 border border-green-200";

    case "On Hold":
      return "bg-purple-100 text-purple-700 border border-purple-200";

    case "Cancelled":
      return "bg-red-100 text-red-700 border border-red-200";

    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
  }
};
