import { fetchData, postData, patchData, updateData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskFormData } from "@/components/task/create-task";

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      taskData: CreateTaskFormData;
      projectId: string;
    }) => postData(`/tasks/${data.projectId}/create-task`, data.taskData),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["project", data.project],
      });
    },
  });
};

export const useTaskById = (taskId: string) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => fetchData(`/tasks/${taskId}`),
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: Partial<{
        title: string;
        description: string;
        status: "To Do" | "In Progress" | "Completed" | "Cancelled";
        priority: "Low" | "Medium" | "High";
      }>;
    }) => patchData(`/tasks/${taskId}`, data),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};

export const useUpdateTaskAssigneesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; assignees: string[] }) =>
      updateData(`/tasks/${data.taskId}/assignees`, {
        assignees: data.assignees,
      }),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};

export const useUpdateSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      taskId: string;
      subTaskId: string;
      title: string;
    }) =>
      updateData(`/tasks/${data.taskId}/update-subtask/${data.subTaskId}`, {
        title: data.title,
      }),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};

export const useCompleteSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      taskId: string;
      subTaskId: string;
      completed: boolean;
    }) =>
      updateData(`/tasks/${data.taskId}/complete-subtask/${data.subTaskId}`, {
        completed: data.completed,
      }),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};

export const useAddSubTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { taskId: string; title: string }) =>
      postData(`/tasks/${data.taskId}/add-subtask`, { title: data.title }),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["task", data._id],
      });
    },
  });
};
