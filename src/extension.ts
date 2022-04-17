import * as vscode from "vscode";
import { DocTypes } from "./lib/DocTypes";
import { errorHandler, registerCommand } from "./lib/utils";

/**
 * This is the entry point of the extension.
 *
 * @function
 * @name activate
 * @kind variable
 * @param {vscode.ExtensionContext} extensionContext
 * @returns {void}
 * @exports
 */
export const activate = (extensionContext: vscode.ExtensionContext): void => {
    try {
        /**
         * Registering a command that can be called from the command palette.
         *
         * @async
         */
        registerCommand(extensionContext, "custom.line", async (line?: any, emmit: boolean = true) => {
            if (!line) {
                /**
                 * Parsing the input value to an integer.
                 *
                 */
                line = parseInt(
                    (await vscode.window.showInputBox({
                        /**
                         * The title of the input box.
                         *
                         * @property
                         * @name title
                         * @kind property
                         * @memberof activate.registerCommand("custom.line") callback
                         * @type {string}
                         */
                        title: "Enter line number number",

                        /**
                         * A function that will validate the input value.
                         *
                         * @method
                         * @name validateInput
                         * @kind method
                         * @memberof activate.registerCommand("custom.line") callback
                         * @param {any} value
                         * @returns {string | null | Thenable<string>}
                         */
                        validateInput(value: any): string | null | Thenable<string> {
                            const line: number = parseInt(value);

                            return isNaN(line) || line <= 0 ? "Invalid value." : null;
                        },
                    })) ?? "1"
                );
            }

            /**
             * Calling the `generateForCustomLine` method from the `DocTypes` class.
             *
             * @constant
             * @name documents
             * @kind variable
             * @memberof activate.registerCommand("custom.line") callback
             * @instance
             * @type {string[]}
             */
            const documents: string[] = await new DocTypes(extensionContext).generateForCustomLine(line, emmit);

            return documents;
        });

        /**
         * Registering a command that can be called from the command palette.
         *
         * @async
         */
        registerCommand(extensionContext, "current.line", async () => {
            /**
             * Calling the `generateForCurrentLine` method from the `DocTypes` class.
             *
             * @constant
             * @name documents
             * @kind variable
             * @memberof activate.registerCommand("current.line") callback
             * @instance
             * @type {string[]}
             */
            const documents: string[] = await new DocTypes(extensionContext).generateForCurrentLine();

            return documents;
        });
    } catch (error) {
        /**
         * A function that will log the error to the console and show a message to the user.
         *
         */
        errorHandler(error, "Ooops! The DocTypes has an unexpected error.");
    }
};

/**
 * It does nothing
 *
 * @function
 * @name deactivate
 * @kind variable
 * @returns {void}
 * @exports
 */
export const deactivate = (): void => {};
