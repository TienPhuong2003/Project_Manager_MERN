import {
  Building2,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  Eye,
  EyeOff,
  FileEdit,
  FolderEdit,
  FolderPlus,
  LogIn,
  MessageSquare,
  Upload,
  UserMinus,
  UserPlus,
} from "lucide-react";

import type { ActionType } from "app/types";

export type ActivityIconConfig = {
  icon: React.ElementType;
  className: string;
};

export const ACTIVITY_ICON: Record<ActionType, ActivityIconConfig> = {
  // ===== Task =====
  created_task: {
    icon: FolderPlus,
    className: "text-blue-500",
  },
  updated_task: {
    icon: FileEdit,
    className: "text-yellow-500",
  },
  completed_task: {
    icon: CheckCircle,
    className: "text-green-500",
  },

  // ===== Subtask =====
  created_subtask: {
    icon: FolderPlus,
    className: "text-blue-400",
  },
  updated_subtask: {
    icon: FileEdit,
    className: "text-yellow-400",
  },
  completed_subtask: {
    icon: CheckSquare,
    className: "text-green-400",
  },

  // ===== Project =====
  created_project: {
    icon: FolderPlus,
    className: "text-indigo-500",
  },
  updated_project: {
    icon: FolderEdit,
    className: "text-indigo-400",
  },
  completed_project: {
    icon: CheckCircle2,
    className: "text-green-600",
  },

  // ===== Workspace =====
  created_workspace: {
    icon: Building2,
    className: "text-purple-500",
  },
  updated_workspace: {
    icon: FolderEdit,
    className: "text-purple-400",
  },
  joined_workspace: {
    icon: LogIn,
    className: "text-blue-500",
  },

  // ===== Member =====
  added_member: {
    icon: UserPlus,
    className: "text-green-500",
  },
  removed_member: {
    icon: UserMinus,
    className: "text-red-500",
  },

  // ===== Comment & Attachment =====
  added_comment: {
    icon: MessageSquare,
    className: "text-sky-500",
  },
  added_attachment: {
    icon: Upload,
    className: "text-slate-500",
  },
};

export const FALLBACK_ACTIVITY_ICON: ActivityIconConfig = {
  icon: Eye,
  className: "text-muted-foreground",
};
