import * as vscode from 'vscode';
import { ConfigManager } from '../configManager';
import { ApiClient } from '../utils/apiClient';
import { FrontMatterUtils } from '../utils/frontMatter';

export async function linkPost(configManager: ConfigManager) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Please open a Markdown file to link.');
        return;
    }

    const config = configManager.getConfig();
    if (!config) {
        vscode.window.showErrorMessage('No blog configuration found.');
        return;
    }

    const api = new ApiClient(config);

    try {
        // 1. Fetch posts from API
        vscode.window.setStatusBarMessage('Fetching posts...', 2000);
        const posts = await api.getPosts();

        // 2. Show QuickPick
        const items = posts.map(post => ({
            label: post.title,
            description: `ID: ${post.id}`,
            detail: post.content ? post.content.substring(0, 50) + '...' : '',
            postId: post.id
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select a post to link to this file'
        });

        if (!selected) {
            return; // User cancelled
        }

        // 3. Update Front Matter
        const document = editor.document;
        const text = document.getText();
        const { data, content } = FrontMatterUtils.parse(text);

        // Update metadata
        data.blog_id = selected.postId;
        data.title = selected.label;
        // Preserve other existing metadata

        const newContent = FrontMatterUtils.stringify(content, data);

        // Apply edit
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );

        await editor.edit(editBuilder => {
            editBuilder.replace(fullRange, newContent);
        });

        vscode.window.showInformationMessage(`Linked to post: ${selected.label}`);

    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to link post: ${error.message}`);
    }
}
