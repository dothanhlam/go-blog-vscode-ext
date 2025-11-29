import * as vscode from 'vscode';
import { ConfigManager } from "../configManager";

export async function syncAllPost(configManager: ConfigManager) {
    const config = configManager.getConfig();
    if (!config) {
        vscode.window.showErrorMessage('No config found');
        return;
    }

    const api = config.api;
    const response = await fetch(`${api.baseUrl}${api.syncAllPostsEndpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${api.apiToken}`,
        },
    });

    if (!response.ok) {
        vscode.window.showErrorMessage(`Failed to sync posts: ${response.statusText}`);
        return;
    }

    vscode.window.showInformationMessage('All posts synced successfully!');
}