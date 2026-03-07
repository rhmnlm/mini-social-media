import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApi, type PostPayload } from "../api/posts";

export function usePosts(enabled = true){
    return useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: ({ pageParam }) => postApi.list({ cursor: pageParam as string | undefined }),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
        staleTime: 2 * 60 * 1000,
        enabled,
    })
}

export function usePost(id: string) {
    return useQuery({
        queryKey: ["post", id],
        queryFn: () => postApi.get(id),
        enabled: !!id,
    })
}

export function useUploadPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PostPayload) => postApi.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"]
            })
        }
    })
}