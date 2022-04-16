import * as vscode from "vscode";
import { DocTypes } from "./lib/DocTypes";
import { errorHandler, registerCommand } from "./lib/utils";

export const activate = (extensionContext: vscode.ExtensionContext) => {
    try {
        registerCommand(extensionContext, "current.line", () => {
            new DocTypes(extensionContext).currentLine();
        });
    } catch (error) {
        errorHandler(error, "Ooops! The DocTypes has an unexpected error.");
    }
};

export const deactivate = () => {};
