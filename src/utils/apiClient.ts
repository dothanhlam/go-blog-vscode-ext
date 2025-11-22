import axios, { AxiosInstance } from 'axios';
import { BlogConfig } from '../configManager';

// 1. Define what a Post looks like coming from the API
export interface BlogPost {
    id: string | number;
    title: string;
    content?: string;
    // Add other fields your API returns (status, author, etc.)
}

export class ApiClient {
    private client: AxiosInstance;
    private config: BlogConfig;

    constructor(config: BlogConfig) {
        this.config = config;

        // 2. Create an axios instance with the base URL
        // You can also add default headers here (like Authorization tokens)
        this.client = axios.create({
            baseURL: config.api.baseUrl,
            timeout: 5000, // Fail fast if API is down
            headers: {
                'Content-Type': 'application/json',
                ...(config.api.apiToken ? { 'Authorization': `Bearer ${config.api.apiToken}` } : {})
            }
        });
    }

    // --- API Methods ---

    /**
     * Fetch a list of all posts (for the "Link Post" dropdown)
     */
    async getPosts(): Promise<BlogPost[]> {
        try {
            const response = await this.client.get<BlogPost[]>(this.config.api.listPostsEndpoint);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch posts: ${this.formatError(error)}`);
        }
    }

    /**
     * Create a new post
     */
    async createPost(title: string, content: string, subtitle?: string, image?: string, tags?: string[]): Promise<BlogPost> {
        try {
            const response = await this.client.post<BlogPost>(this.config.api.createPostEndpoint, {
                title,
                content,
                sub_title: subtitle,
                image,
                tags
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to create post: ${this.formatError(error)}`);
        }
    }

    /**
     * Update an existing post
     */
    async updatePost(id: string | number, content: string, title?: string, subtitle?: string, image?: string, tags?: string[]): Promise<BlogPost> {
        try {
            // Replace the {id} placeholder in the config string (e.g. "/posts/{id}")
            const url = this.config.api.updatePostEndpoint.replace('{id}', id.toString());

            const response = await this.client.put<BlogPost>(url, {
                title,
                content,
                sub_title: subtitle,
                image,
                tags
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to update post ${id}: ${this.formatError(error)}`);
        }
    }

    // --- Helper ---

    private formatError(error: any): string {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || error.message;
        }
        return 'Unknown error occurred';
    }
}