import { useMutation, useQuery } from "@tanstack/react-query";
import type {WorkspaceForm} from "@/components/workspace/create-workspace"
import { fetchData, postData } from "@/lib/fetch-util";

export const useCreateWorkspace = () =>{
    return useMutation({
        mutationFn: async(data: WorkspaceForm) => postData("/workspaces", data)
    })
}


export const useGetWorkspacesQuery = () => {
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: async () =>  fetchData("/workspaces")
    })
}