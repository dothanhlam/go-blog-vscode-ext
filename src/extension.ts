import * as vscode from 'vscode';
import { ConfigManager } from './configManager';
import { syncPostOnSave } from './commands/syncPost';
import { linkPost } from './commands/linkPost';
import { createPost } from './commands/createPost';

export async function activate(context: vscode.ExtensionContext) {
    console.log('Activating Blog Sync Extension...');

    // 1. Initialize Config Manager
    const configManager = new ConfigManager();
    const hasConfig = await configManager.loadConfig();

    // 2. Safety Check: If config failed to load, stop here.
    if (!hasConfig) {
        console.log('No blog-config.json found. Extension entering dormant state.');
        return;
    }

    // 3. Register Commands (passing the config manager so commands know the API URL)
    let linkCommand = vscode.commands.registerCommand('blog-sync.linkPost', () => {
        linkPost(configManager);
    });

    let createCommand = vscode.commands.registerCommand('blog-sync.createPost', () => {
        createPost(configManager);
    });

    // 4. Register the "On Save" Listener
    let onSaveListener = vscode.workspace.onDidSaveTextDocument((document) => {
        // We pass the document and the config to the sync logic
        syncPostOnSave(document, configManager);
    });

    // 5. Add to subscriptions so they get disposed properly
    context.subscriptions.push(linkCommand);
    context.subscriptions.push(createCommand);
    context.subscriptions.push(onSaveListener);

    vscode.window.setStatusBarMessage(`Blog Extension Active: ${configManager.getConfig()?.name}`, 5000);
}

export function deactivate() { }