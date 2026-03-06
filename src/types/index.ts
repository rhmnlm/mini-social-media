export interface PaginatedPosts {
    hasMore: boolean;
    items: Post[];
    nextCursor: string | null;
}

export interface Post {
    author: string;
    caption: string;
    createdAt: string;
    id: string;
    imageUrl: string;
    likes: number;
}

export interface ApiError {
    error: {
        code: string;
        message: string;
        details?: unknown | null;
    }
}

export interface Comment {
    author: string;
    createdAt: string;
    id: string;
    postId: string;
    text: string;
}

export interface CommentsResponse {
    items: Comment[];
    postId: string;
}