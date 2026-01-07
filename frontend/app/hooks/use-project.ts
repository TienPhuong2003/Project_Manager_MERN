import { fetchData, postData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateProjectFormData } from "@/components/project/create-project"

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async(data: {
            projectData: CreateProjectFormData;
            workspaceId: string;
        }) => 
            postData(
                `/projects/${data.workspaceId}/create-project`, data.projectData
            ),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: ['workspaces', data.workspace]
            })
        }
    })
}

export const useGetProjectById = (projectId: string) => {
    return useQuery({
        queryKey: ["project", projectId],
        queryFn: () => fetchData(`projects/${projectId}/tasks`)
    })
}