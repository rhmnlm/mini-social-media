import { useQuery } from "@tanstack/react-query";
import { commentApi } from "../api/comments";

export function useComments(id:string) {
    return useQuery({
        queryKey: ["comments", id],
        queryFn: ()=> commentApi.get(id),
        staleTime: 30 * 1000,
        enabled: !!id
    })
}