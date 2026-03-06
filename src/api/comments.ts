import type { CommentsResponse } from "../types";
import { apiClient } from "./client"

export const commentApi = {
    /**
     * 
     * @param id id of post
     */
    get: async (id: string): Promise<CommentsResponse> => {
        const response = await apiClient.get(`/api/comments/${id}`);
        return response.data;
    }
}