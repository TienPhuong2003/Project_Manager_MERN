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
    owner: User |string;
    color: string;
    members: {
        user: User;
        role: "admin" | "member" | "owner" | "viewer"
        joinedAt: Date;
    }[]
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
    subTasks? : Subtask[];
    watchers? : User[];
    attachments? : Attachment[];
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