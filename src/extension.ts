import * as vscode from "vscode";
import * as utils from "./lib/utils";
import { Editor } from "./lib/Editor";

namespace docTypes {
    export const activate = (extensionContext: vscode.ExtensionContext) => {
        try {
            utils.registerCommand(extensionContext, "generate", async () => {
                const editor = new Editor(extensionContext);
                await editor.init();
                await editor.generate();
            });
        } catch ({ message }) {
            console.error(message);
        }
    };

    export const deactivate = () => {};
}

export const activate = docTypes.activate;
export const deactivate = docTypes.deactivate;
