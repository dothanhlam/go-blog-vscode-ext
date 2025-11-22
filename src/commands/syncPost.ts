// src/commands/syncPost.ts
import * as vscode from 'vscode';
import { ConfigManager } from '../configManager';
import { ApiClient } from '../utils/apiClient';
import { FrontMatterUtils } from '../utils/frontMatter';

export async function syncPostOnSave(document: vscode.TextDocument, configManager: ConfigManager) {

    // 1. Get Config
    const config = configManager.getConfig();
    if (!config) return;

    // 2. Check if file is in the posts directory (if configured)
    if (config.postsDirectory) {
        // Normalize paths for comparison
        const fileUri = document.uri;
        // We need to find if the document is within the workspace and under the postsDirectory
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
        if (workspaceFolder) {
            const postsPath = vscode.Uri.joinPath(workspaceFolder.uri, config.postsDirectory).fsPath;
            if (!fileUri.fsPath.startsWith(postsPath)) {
                // Not in the posts directory, ignore
                return;
            }
        }
    }

    // 3. Parse File using our new Utility
    const text = document.getText();
    const { data, content } = FrontMatterUtils.parse(text);

    // 4. Check for ID
    if (!data.blog_id) {
        // No ID, so this isn't a linked post. Do nothing.
        return;
    }

    // 5. Instantiate API Client
    const api = new ApiClient(config);

    try {
        // 6. Send Update
        await api.updatePost(
            data.blog_id,
            content,
            data.title,
            data.subtitle,
            data.image,
            data.tags
        );
        vscode.window.setStatusBarMessage(`✅ ${config.name}: Synced`, 3000);
    } catch (err: any) {
        vscode.window.showErrorMessage(err.message);
    }
}