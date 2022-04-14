import * as vscode from "vscode";
import * as utils from "./lib/utils";
import { Editor } from "./lib/Editor";

namespace docTypes {
    export const activate = (extensionContext: vscode.ExtensionContext) => {
        try {
            utils.registerCommand(extensionContext, "generate", () => {
                const editor = new Editor(extensionContext);

                if (editor.languageId === "typescript") {
                    editor.generateJsDoc();
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    export const deactivate = () => {};
}

export const activate = docTypes.activate;
export const deactivate = docTypes.deactivate;
