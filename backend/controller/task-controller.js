import { recordActivity } from "../libs/index.js";
import ActivityLog from "../models/activity.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";
import Comment from "../models/comment.js";

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assignees } =
      req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }
    const workspace = await Workspace.findById(project.workspace);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "you are no longer the member of this workspace",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
      project: projectId,
      createdBy: req.user._id,
    });

    project.tasks.push(newTask._id);
    await project.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId)
      .populate("assignees", "name profilePicture")
      .populate("watchers", "name profilePicture");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const project = await Project.findById(task.project).populate(
      "members.user",
      "name profilePicture",
    );

    res.status(200).json({ task, project });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are no longer a member of this workspace",
      });
    }

    const activities = [];

    // ---- TITLE ----
    if (typeof title === "string" && title.trim() && title !== task.title) {
      activities.push(`updated task title from "${task.title}" to "${title}"`);
      task.title = title;
    }

    // ---- DESCRIPTION ----
    if (typeof description === "string" && description !== task.description) {
      activities.push("updated task description");
      task.description = description;
    }

    // ---- STATUS ----
    if (typeof status === "string" && status !== task.status) {
      activities.push(`changed status from "${task.status}" to "${status}"`);
      task.status = status;
    }
    // --- PRIORITY ---
    if (typeof priority === "string" && priority !== task.priority) {
      activities.push(
        `changed priority from "${task.priority}" to "${priority}"`,
      );
      task.priority = priority;
    }

    if (activities.length === 0) {
      return res.status(400).json({
        message: "No valid fields to update",
      });
    }

    await task.save();

    if (activities.length > 0) {
      await recordActivity(req.user._id, "updated_task", taskId, "Task", {
        description: activities.join(", "),
      });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTaskAssignees = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignees } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are no longer a member of this workspace",
      });
    }

    const oldAssignees = task.assignees;
    task.assignees = assignees;
    await task.save();

    await recordActivity(req.user._id, "updated_task", taskId, "Task", {
      description: `updated task assignee from ${oldAssignees.length} to ${assignees.length}`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const addSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are no longer a member of this workspace",
      });
    }

    await Task.findByIdAndUpdate(
      taskId,
      {
        $push: {
          subTasks: {
            $each: [
              {
                title,
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            $position: 0,
          },
        },
      },
      { new: true },
    );

    await recordActivity(req.user._id, "created_subtask", taskId, "Task", {
      description: `created sub task "${title}"`,
    });
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtask = task.subTasks.id(subTaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Sub Task not found" });
    }
    const oldTitle = subtask.title;
    subtask.title = title;
    subtask.updatedAt = new Date();
    await task.save();

    await recordActivity(req.user._id, "updated_subtask", taskId, "Task", {
      description: `updated sub task from"${oldTitle}" to "${title}"`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const completedSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { completed } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const subtask = task.subTasks.id(subTaskId);
    if (!subtask) {
      return res.status(404).json({ message: "Sub Task not found" });
    }
    subtask.completed = completed;
    subtask.updatedAt = new Date();
    await task.save();

    await recordActivity(req.user._id, "completed_subtask", taskId, "Task", {
      completed,
      description: completed
        ? `completed sub task "${subtask.title}"`
        : `incomplete sub task "${subtask.title}"`,
    });

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTaskActivity = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const activity = await ActivityLog.find({ resourceId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getCommentsByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comments = await Comment.find({ task: taskId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({
        message: "You are no longer a member of this workspace",
      });
    }

    const newComment = await Comment.create({
      text,
      task: taskId,
      author: req.user._id,
    });

    task.comments.push(newComment._id);
    await task.save();

    await recordActivity(req.user._id, "added_comment", taskId, "Task", {
      description: `${req.user.name} commented on the task "${task.title}" of project "${project.title}""`,
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const watchTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({
        message: "You are no longer a member of this workspace",
      });
    }
    const isWatching = task.watchers.includes(req.user._id);

    if (!isWatching) {
      task.watchers.push(req.user._id);
    } else {
      task.watchers = task.watchers.filter(
        (userId) => userId.toString() !== req.user._id.toString(),
      );
    }

    await task.save();

    await recordActivity(
      req.user._id,
      "updated_task",
      taskId,
      "Task",
      {
        description: ` ${isWatching ? "stopped watching" : "started watching"} the task "${task.title}"`,
      },
    );

    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const archiveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(403).json({
        message: "You are no longer a member of this workspace",
      });
    }
    const isArchived = task.isArchived;
    task.isArchived = !isArchived;
    await task.save();

    await recordActivity(
      req.user._id,
      "updated_task",
      taskId,
      "Task",
      {
        description: `${req.user.name} ${isArchived ? "unarchived" : "archived"} the task "${task.title}"`,
      },
    );
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createTask,
  getTaskById,
  updateTask,
  updateTaskAssignees,
  addSubTask,
  updateSubTask,
  getTaskActivity,
  completedSubTask,
  getCommentsByTaskId,
  addComment,
  watchTask,
  archiveTask,
};
