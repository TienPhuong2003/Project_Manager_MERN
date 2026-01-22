import { XCircle } from "lucide-react";
import type { ActivityLog } from "app/types";
import {
  ACTIVITY_ICON,
  FALLBACK_ACTIVITY_ICON,
} from "@/lib/activity-icon";

export function getActivityIcon(log: ActivityLog) {
  if (
    log.action === "completed_subtask" &&
    log.details?.completed === false
  ) {
    return {
      icon: XCircle,
      className: "text-red-500",
    };
  }

  return ACTIVITY_ICON[log.action] ?? FALLBACK_ACTIVITY_ICON;
}
