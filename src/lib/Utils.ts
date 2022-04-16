import * as vscode from "vscode";
import { inspect } from "util";
import { DocumentConfigTypes, DocumentTypes } from "./Types";

export const runtimeAwait = (delay: number = 1000): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

export const debug = (input: any) => {
    console.log(inspect(input, { depth: null, colors: true }));
};

export const registerCommand = (
    { subscriptions }: vscode.ExtensionContext,
    command: string,
    callback: (...rest: any[]) => void
) => {
    subscriptions.push(vscode.commands.registerCommand(`doctypes.${command}`, callback));
};

export const executeCommand = (command: string, ...rest: any[]): Thenable<unknown> => {
    return vscode.commands.executeCommand(command, ...rest);
};

export const getConfig = (config: keyof DocumentTypes | "_mintlifyUserId"): DocumentConfigTypes => {
    return vscode.workspace.getConfiguration().get(`doctypes.${config.substring(1)}`) as DocumentConfigTypes;
};

export const errorHandler = (error: any, message: string): void => {
    console.error(error);
    vscode.window.showErrorMessage(message);
};
