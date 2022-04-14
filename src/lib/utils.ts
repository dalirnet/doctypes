import * as vscode from "vscode";

export const registerCommand = (context: vscode.ExtensionContext, command: string, callback: () => void) => {
    context.subscriptions.push(vscode.commands.registerCommand(`doctypes.${command}`, callback));
};

export const executeCommand = (command: string, ...rest: any[]): Thenable<unknown> => {
    return vscode.commands.executeCommand(command, ...rest);
};
