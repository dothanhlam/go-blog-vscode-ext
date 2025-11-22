import * as vscode from 'vscode';

// Define the shape of your config file for Type Safety
export interface BlogConfig {
    name: string;
    api: {
        baseUrl: string;
        listPostsEndpoint: string;
        createPostEndpoint: string;
        updatePostEndpoint: string; // e.g., "/posts/{id}"
        apiToken?: string; // Optional for now, but recommended
    };
    postsDirectory?: string;
}

export class ConfigManager {
    private config: BlogConfig | undefined;

    // Try to load the config from the workspace root
    async loadConfig(): Promise<boolean> {
        const files = await vscode.workspace.findFiles('blog-config.json', '**/node_modules/**', 1);

        if (files.length === 0) {
            return false;
        }

        try {
            const fileData = await vscode.workspace.fs.readFile(files[0]);
            const jsonContent = Buffer.from(fileData).toString('utf8');
            this.config = JSON.parse(jsonContent);
            console.log(`Loaded config for: ${this.config?.name}`);
            return true;
        } catch (error) {
            vscode.window.showErrorMessage(`Error parsing blog-config.json: ${error}`);
            return false;
        }
    }

    // Getter to access config in other files safely
    getConfig(): BlogConfig | undefined {
        return this.config;
    }
}