import * as vscode from 'vscode';
import { ConfigManager } from '../configManager';

export async function linkPost(configManager: ConfigManager) {
    vscode.window.showInformationMessage('Link Post command executed!');
}
