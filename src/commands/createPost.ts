import * as vscode from 'vscode';
import { ConfigManager } from '../configManager';
import { ApiClient } from '../utils/apiClient';
import { FrontMatterUtils } from '../utils/frontMatter';

export async function createPost(configManager: ConfigManager) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('Please open a Markdown file to create a post.');
        return;
    }

    const config = configManager.getConfig();
    if (!config) {
        vscode.window.showErrorMessage('No blog configuration found.');
        return;
    }

    const document = editor.document;
    const text = document.getText();
    const { data, content } = FrontMatterUtils.parse(text);

    // Check if already linked
    if (data.blog_id) {
        vscode.window.showWarningMessage(`This file is already linked to post ID: ${data.blog_id}`);
        return;
    }

    // Require a title
    if (!data.title) {
        const titleInput = await vscode.window.showInputBox({
            prompt: 'Enter a title for the new post',
            placeHolder: 'My New Blog Post'
        });
        if (!titleInput) return;
        data.title = titleInput;
    }

    const api = new ApiClient(config);

    try {
        vscode.window.setStatusBarMessage('Creating post...', 2000);

        // Create post via API
        const newPost = await api.createPost(
            data.title,
            content,
            data.subtitle,
            data.image,
            data.tags
        );

        // Update Front Matter with new ID
        data.blog_id = newPost.id;

        const newContent = FrontMatterUtils.stringify(content, data);

        // Apply edit
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(text.length)
        );

        await editor.edit(editBuilder => {
            editBuilder.replace(fullRange, newContent);
        });

        vscode.window.showInformationMessage(`Created post: ${newPost.title} (ID: ${newPost.id})`);

    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to create post: ${error.message}`);
    }
}
