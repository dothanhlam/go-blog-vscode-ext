// src/commands/syncPost.ts
import * as vscode from 'vscode';
import { ConfigManager } from '../configManager';
import { ApiClient } from '../utils/apiClient';
import { FrontMatterUtils } from '../utils/frontMatter';

export async function syncPostOnSave(document: vscode.TextDocument, configManager: ConfigManager) {

    // 1. Get Config
    const config = configManager.getConfig();
    if (!config) return;

    // 2. Parse File using our new Utility
    const text = document.getText();
    const { data, content } = FrontMatterUtils.parse(text);

    // 3. Check for ID
    if (!data.blog_id) {
        // No ID, so this isn't a linked post. Do nothing.
        return;
    }

    // 4. Instantiate API Client
    const api = new ApiClient(config);

    try {
        // 5. Send Update
        await api.updatePost(data.blog_id, content, data.title);
        vscode.window.setStatusBarMessage(`✅ ${config.name}: Synced`, 3000);
    } catch (err: any) {
        vscode.window.showErrorMessage(err.message);
    }
}