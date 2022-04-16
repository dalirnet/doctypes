import * as vscode from "vscode";
import { inspect } from "util";
import { ConfigKeysTypes, ConfigValuesTypes } from "./Types";
import { REGEXP_FIRST_UDERLINE } from "./Regexp";

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

export const getConfig = (key: ConfigKeysTypes): ConfigValuesTypes => {
    return vscode.workspace
        .getConfiguration()
        .get(`doctypes.${key.replace(REGEXP_FIRST_UDERLINE, "")}`) as ConfigValuesTypes;
};

export const updateConfig = (key: ConfigKeysTypes, value: ConfigValuesTypes): Thenable<void> => {
    return vscode.workspace.getConfiguration().update(`doctypes.${key.replace(REGEXP_FIRST_UDERLINE, "")}`, value);
};

export const errorHandler = (error: any, message: string): void => {
    console.error(error);
    vscode.window.showErrorMessage(message);
};
