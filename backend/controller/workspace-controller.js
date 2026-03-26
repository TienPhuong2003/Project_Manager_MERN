import Project from "../models/project.js";
import User from "../models/user.js";
import WorkspaceInvite from "../models/workspace-invite.js";
import Workspace from "../models/workspace.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../service/send-email.js";
import { inviteEmailTemplate } from "../util/emailTemplate.js";
import { recordActivity } from "../libs/index.js";

const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const userId = req.user._id;
    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: userId,
      members: [
        {
          user: userId,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).sort({ createdAt: -1 });
    return res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById({
      _id: workspaceId,
    }).populate("members.user", "name email profilePicture");
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
      // members: { $in: [req.user._id] },
    })
      // .populate("tasks", "status")
      .sort({
        createdAt: -1,
      });
    res.status(200).json({ projects, workspace });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res
        .status(403)
        .json({ message: "You are not a member of this workspace" });
    }
    const [totalProjects, projects] = await Promise.all([
      Project.countDocuments({ workspace: workspaceId }),
      Project.find({ workspace: workspaceId })
        .populate(
          "tasks",
          "title status dueDate project updatedAt isArchived priority",
        )
        .sort({ createdAt: -1 }),
    ]);
    const totalTasks = projects.reduce((acc, project) => {
      return acc + project.tasks.length;
    }, 0);

    const totalProjectInProgress = projects.filter(
      (project) => project.status === "In Progress",
    ).length;
    const totalProjectCompleted = projects.filter(
      (project) => project.status === "Completed",
    ).length;
    const totalTaskCompleted = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "Completed").length
      );
    }, 0);

    const totalTaskToDo = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "To Do").length
      );
    }, 0);

    const totalTaskInProgress = projects.reduce((acc, project) => {
      return (
        acc +
        project.tasks.filter((task) => task.status === "In Progress").length
      );
    }, 0);

    const tasks = projects.flatMap((project) => project.tasks);
    const upcomingTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      return (
        dueDate > now &&
        dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    });
    const taskTrendsData = [
      { name: "Sunday", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Monday", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Tuesday", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Wednesday", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Thursday", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Friday", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Saturday", completed: 0, inProgress: 0, toDo: 0 },
    ];

    const last7DaysTasks = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    for (const project of projects) {
      for (const task of project.tasks) {
        const taskDate = new Date(task.updatedAt);
        const dayInDate = last7DaysTasks.findIndex(
          (date) =>
            date.getDate() === taskDate.getDate() &&
            date.getMonth() === taskDate.getMonth() &&
            date.getFullYear() === taskDate.getFullYear(),
        );
        if (dayInDate !== -1) {
          const dayName = last7DaysTasks[dayInDate].toLocaleDateString(
            "vi-VN",
            { weekday: "short" },
          );
          const dayData = taskTrendsData.find((day) => day.name === dayName);
          if (dayData) {
            switch (task.status) {
              case "Completed":
                dayData.completed += 1;
                break;
              case "In Progress":
                dayData.inProgress += 1;
                break;
              case "To Do":
                dayData.toDo += 1;
                break;
            }
          }
        }
      }
    }

    const projectStatusData = [
      { name: "Completed", value: 0, color: "#10b981" },
      { name: "In Progress", value: 0, color: "#3b82f6" },
      { name: "Planning", value: 0, color: "#f59e0b" },
    ];

    for (const project of projects) {
      switch (project.status) {
        case "Completed":
          projectStatusData[0].value += 1;
          break;
        case "In Progress":
          projectStatusData[1].value += 1;
          break;
        case "Planning":
          projectStatusData[2].value += 1;
          break;
      }
    }

    const taskPriorityData = [
      { name: "High", value: 0, color: "#ef4444" },
      { name: "Medium", value: 0, color: "#f59e0b" },
      { name: "Low", value: 0, color: "#10b981" },
    ];

    for (const task of tasks) {
      switch (task.priority) {
        case "High":
          taskPriorityData[0].value += 1;
          break;
        case "Medium":
          taskPriorityData[1].value += 1;
          break;
        case "Low":
          taskPriorityData[2].value += 1;
          break;
      }
    }

    const workspaceProductivityData = [];

    for (const project of projects) {
      const projectTasks = tasks.filter(
        (task) => task.project.toString() === project._id.toString(),
      );
      const completedTasks = projectTasks.filter(
        (task) => task.status === "Completed" && !task.isArchived,
      );
      workspaceProductivityData.push({
        name: project.title,
        completed: completedTasks.length,
        total: projectTasks.length,
      });
    }

    const stats = {
      totalProjects,
      totalTasks,
      totalProjectInProgress,
      totalProjectCompleted,
      totalTaskCompleted,
      totalTaskToDo,
      totalTaskInProgress,
    };

    res.status(200).json({
      stats,
      upcomingTasks,
      taskTrendsData,
      projectStatusData,
      taskPriorityData,
      workspaceProductivityData,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const acceptInviteToken = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { user, workspaceId, role } = decoded;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === user.toString()
    );

    if (isMember) {
      return res.status(400).json({
        message: "User already a member of this workspace",
      });
    }

    const inviteInfo = await WorkspaceInvite.findOne({
      user: user,
      workspaceId: workspaceId,
    });

    if (!inviteInfo) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    if (inviteInfo.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Invitation has expired",
      });
    }

    workspace.members.push({
      user: user,
      role: role || "member",
      joinedAt: new Date(),
    });

    await workspace.save();

    await Promise.all([
      WorkspaceInvite.deleteOne({ _id: inviteInfo._id }),
      recordActivity(user, "joined_workspace", "Workspace", workspaceId, {
        description: `Joined ${workspace.name} workspace`,
      }),
    ]);

    res.status(200).json({
      message: "Invitation accepted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const inviteUserToWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const userMemberInfo = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!userMemberInfo || !["admin", "owner"].includes(userMemberInfo.role)) {
      return res.status(403).json({
        message: "You are not authorize to invite member to this workspace",
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMember = workspace.members.some(
      (member) => member.user.toString() === existingUser._id.toString(),
    );
    if (isMember) {
      return res
        .status(400)
        .json({ message: "User already a member of this workspace" });
    }
    const isInvited = await WorkspaceInvite.findOne({
      user: existingUser._id,
      workspaceId: workspaceId,
    });

    if (isInvited && isInvited.expiresAt > new Date()) {
      return res.status(400).json({
        message: " User already invited to this workspace",
      });
    } else if (isInvited && isInvited.expiresAt < new Date()) {
      await WorkspaceInvite.deleteOne({ _id: isInvited._id });
    }
    const inviteToken = jwt.sign(
      {
        user: existingUser._id,
        workspaceId: workspaceId,
        role: role || "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    await WorkspaceInvite.create({
      user: existingUser._id,
      workspaceId: workspaceId,
      token: inviteToken,
      role: role || "member",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    const invitationLink = `${process.env.FRONT_END_URL}/workspace-invite/${workspace._id}?tk=${inviteToken}`;
    const emailResult = await sendEmail({
      to: email,
      subject: "You're invited to TaskHub",
      html: inviteEmailTemplate({
        name: existingUser.name,
        workspaceName: workspace.name,
        inviter: req.user.name,
        link: invitationLink,
      }),
    });
      return res.status(200).json({
        message: "Invitation sent successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const acceptGenerateInvite = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === user.toString(),
    );
    if (isMember) {
      return res.status(400).json({
        message: "User already a member of this workspace",
      });
    }

    workspace.members.push({
      user: req.user._id,
      role: "member",
      joinedAt: new Date(),
    });

    await workspace.save();
    await recordActivity(
      req.user._id,
      "joined_workspace",
      workspaceId,
      "Workspace",
      { description: `Joined ${workspace.name} workspace` },
    );

    res.status(200).json({ message: "Invitation accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
  inviteUserToWorkspace,
  acceptInviteToken,
  acceptGenerateInvite,
};
