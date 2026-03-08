import type { PaginatedPosts, Post } from "../types"
import { apiClient } from "./client"

export type Pagination = {
    cursor?: string,
    limit?: number
}

export interface PostPayload {
    author: string;
    caption: string;
    image: File;
    onUploadProgress?: (percent: number) => void;
}

export const postApi = {
    list: async (pagination: Pagination = {}): Promise<PaginatedPosts> => {
        const response = await apiClient.get("api/posts", {
            params: {...pagination}
        })
        return response.data;
    },

    create: async (payload: PostPayload): Promise<Post> => {
        const formData = new FormData();
        formData.append("author", payload.author);
        formData.append("caption", payload.caption);
        formData.append("image", payload.image);

        const response = await apiClient.post("api/posts", formData, {
            headers: { "Content-Type": undefined },
            onUploadProgress: payload.onUploadProgress
                ? (e) => {
                      const percent = Math.round((e.loaded * 100) / (e.total ?? e.loaded));
                      payload.onUploadProgress!(percent);
                  }
                : undefined,
        });
        return response.data;
    },

    get: async(id:string): Promise<Post> => {
        const response = await apiClient.get(`/api/posts/${id}`);
        return response.data;
    }
}