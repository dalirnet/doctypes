import * as vscode from "vscode";
import { DocTypes } from "./lib/DocTypes";
import { errorHandler, registerCommand } from "./lib/utils";

export const activate = (extensionContext: vscode.ExtensionContext) => {
    try {
        registerCommand(extensionContext, "custom.line", async (line?: any) => {
            if (!line) {
                line = parseInt(
                    (await vscode.window.showInputBox({
                        title: "Enter line number number",
                        validateInput(value) {
                            const line = parseInt(value);
                            return isNaN(line) || line <= 0 ? "Invalid value." : null;
                        },
                    })) ?? "1"
                );
            }

            await new DocTypes(extensionContext).generateForCustomLine(line);
        });
        registerCommand(extensionContext, "current.line", async () => {
            await new DocTypes(extensionContext).generateForCurrentLine();
        });
    } catch (error) {
        errorHandler(error, "Ooops! The DocTypes has an unexpected error.");
    }
};

export const deactivate = () => {};
