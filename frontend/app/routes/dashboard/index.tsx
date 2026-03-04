import { Loader } from "@/components/ui/loader";
import { useGetWorkspaceStats } from "app/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "app/types";
import { useSearchParams } from "react-router";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatisticCharts } from "@/components/dashboard/statistic-chart";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { UpcomingTasks } from "@/components/dashboard/upcoming-task";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  const { data, isPending } = useGetWorkspaceStats(workspaceId!) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  
  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Dashboard</h1>
      </div>
      <StatCard data={data.stats} />

      <StatisticCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects data={data.recentProjects} />
        <UpcomingTasks tasks={data.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
