import Project from "../models/project.js";
import Workspace from "../models/workspace.js";

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
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    res.status(200).json({ workspace });
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

    res
      .status(200)
      .json({
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

export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceDetails,
  getWorkspaceProjects,
  getWorkspaceStats,
};
