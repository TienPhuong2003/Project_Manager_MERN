export interface User {
  _id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: User | string;
  color: string;
  members: {
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = "To Do" | "In Progress" | "Completed" | "Cancelled";
export type TaskPriority = "High" | "Medium" | "Low";
export enum ProjectMemberRole {
  MANAGER = "manager",
  CONTRIBUTOR = "contributor",
  VIEWER = "viewer",
}

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface Attachment {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: User;
  uploadedAt: Date;
}
export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project: Project;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  dueDate: Date;
  priority: TaskPriority;
  assignees: User[];
  createdBy: User;
  subTasks?: Subtask[];
  watchers?: User[];
  attachments?: Attachment[];
}

export enum ProjectStatus {
  PLANNING = "Planning",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  ON_HOLD = "On Hold",
  CANCELLED = "Cancelled",
}
export interface Project {
  _id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  workspace: Workspace;
  startDate: Date;
  dueDate: Date;
  tasks: Task[];
  members: {
    user: User;
    role: "manager" | "contributor" | "viewer";
    joinedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
}

export interface Member {
  _id: string;
  user: User;
  role: "admin" | "member" | "viewer" | "owner";
  joinedAt: Date;
}

export type ResourceType =
  | "Task"
  | "Project"
  | "Workspace"
  | "Comment"
  | "User";

export type ActionType =
  | "created_task"
  | "updated_task"
  | "created_subtask"
  | "updated_subtask"
  | "completed_subtask"
  | "completed_task"
  | "created_project"
  | "updated_project"
  | "completed_project"
  | "created_workspace"
  | "updated_workspace"
  | "added_comment"
  | "added_member"
  | "removed_member"
  | "joined_workspace"
  | "added_attachment";

export interface ActivityLog {
  _id: string;
  user: User;
  action: ActionType;
  resourceType: ResourceType;
  resourceId: string;
  details: any;
  createdAt: Date;
}

export interface CommentReaction {
  emoji: string;
  users: User[];
}
export interface Comment {
  _id: string;
  author: User;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  reactions?: CommentReaction[];
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: number;
  }[];
}

export interface StatsCardProps {
  totalProjects: number;
  totalTasks: number;
  totalProjectInProgress: number;
  totalTaskCompleted: number;
  totalTaskToDo: number;
  totalTaskInProgress: number;
}

export interface TaskTrendsData {
  name: string;
  completed: number;
  inProgress: number;
  toDo: number;
}

export interface TaskPriorityData {
  name: string;
  value: number;
  color: string;
}

export interface ProjectStatusData {
  name: string;
  value: number;
  color: string;
}

export interface WorkspaceProductivityData {
  name: string;
  completed: number;
  total: number;
}