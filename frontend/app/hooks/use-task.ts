import { fetchData, postData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateTaskFormData } from "@/components/task/create-task"

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(data: {
            taskData: CreateTaskFormData;
            projectId: string;
        }) => 
            postData(
                `/tasks/${data.projectId}/create-task`, data.taskData
            ),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['project', data.project]
            })
        }
    })
}