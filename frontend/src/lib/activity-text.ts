import type { ActionType } from "app/types";

export const ACTIVITY_TEXT: Record<ActionType, string> = {
  created_task: "CREATE TASK",
  updated_task: "UPDATED TASK",

  created_subtask: "CREATE SUB TASK",
  updated_subtask: "UPDATED SUB TASK",
  completed_subtask: "COMPLETE SUB TASK",

  completed_task: "COMPLETE TASK",

  created_project: "CREATE PROJECT",
  updated_project: "UPDATED PROJECT",
  completed_project: "COMPLETE PROJECT",

  created_workspace: "CREATE WORKSPACE",
  updated_workspace: "UPDATE WORKSPACE",

  added_comment: "COMMENT",

  added_member: "ADD MEMBER",
  removed_member: "REMOVE MEMBER",
  joined_workspace: "JOINED WORKSPACE",

  added_attachment: "ADDED AN ATTACHMENT",
};
