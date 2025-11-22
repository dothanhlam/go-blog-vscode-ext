import * as matter from 'gray-matter';

// 1. Define the shape of your Front Matter
// This ensures we don't accidentally check for "blogId" when we meant "blog_id"
export interface PostMetadata {
    blog_id?: string | number;
    title?: string;
    status?: 'draft' | 'published';
    [key: string]: any; // Allow other arbitrary keys
}

/**
 * Result object separating metadata from the actual markdown content
 */
export interface ParsedDocument {
    data: PostMetadata;
    content: string;
}

export class FrontMatterUtils {

    /**
     * Parse a raw string (file content) into metadata and body
     */
    static parse(fileContent: string): ParsedDocument {
        // gray-matter does the heavy lifting
        const parsed = matter(fileContent);

        return {
            data: parsed.data as PostMetadata,
            content: parsed.content
        };
    }

    /**
     * Take raw markdown content and a metadata object, 
     * and combine them into a single string with YAML front matter.
     * Used when we want to write data back to the file.
     */
    static stringify(content: string, metadata: PostMetadata): string {
        // matter.stringify recreates the "---" block at the top
        return matter.stringify(content, metadata);
    }

    /**
     * Helper to check if a file has a linked blog ID
     */
    static hasBlogId(fileContent: string): boolean {
        const { data } = this.parse(fileContent);
        return !!data.blog_id;
    }
}