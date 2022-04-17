import * as vscode from "vscode";
import { resolve } from "path";

/**
 * A function that takes a string as a parameter and returns a Thenable<unknown>
 *
 * @function
 * @name openWorkspaceFile
 * @kind variable
 * @param {string} file
 * @returns {Thenable<unknown>}
 * @exports
 */
export const openWorkspaceFile = (file: string): Thenable<unknown> => {
    /**
     * Resolving the path to the file.
     *
     * @constant
     * @name filePath
     * @kind variable
     * @memberof openWorkspaceFile
     * @type {string}
     */
    const filePath: string = resolve(__dirname, "../../../src/test/workspace", file);

    return vscode.commands.executeCommand("vscode.open", vscode.Uri.file(filePath));
};

/**
 * A function that takes a range as a parameter and returns a string.
 *
 * @function
 * @name getText
 * @kind variable
 * @param {vscode.Range} range
 * @returns {string}
 * @exports
 */
export const getText = (range: vscode.Range): string => {
    /**
     * Getting the text from the active editor.
     *
     * @constant
     * @name text
     * @kind variable
     * @memberof getText
     * @type {string}
     */
    const text: string = vscode.window.activeTextEditor?.document.getText(range) ?? "";

    return text.trim();
};

/**
 * Exporting a function that takes two parameters and returns an array of strings.
 *
 * @function
 * @name readComments
 * @kind variable
 * @param {number} start
 * @param {number} end
 * @returns {string[]}
 * @exports
 */
export const readComments = (start: number, end: number): string[] => {
    /**
     * Getting the text from the active editor and splitting it into an array of strings.
     *
     * @constant
     * @name lines
     * @kind variable
     * @memberof readComments
     * @type {string[]}
     */
    const lines: string[] = getText(new vscode.Range(start - 1, 0, end - 1, 0)).split("\n");

    /**
     * Taking the lines array and reducing it to a single value.
     *
     * @constant
     * @name comments
     * @kind variable
     * @memberof readComments
     * @type {string[]}
     */
    const comments: string[] = lines.reduce((lines, line) => {
        /**
         * Removing the leading spaces, asterisks, and slashes from the line.
         *
         * @constant
         * @name commentLine
         * @kind variable
         * @memberof readComments.comments.lines.reduce() callback
         * @type {string}
         */
        const commentLine: string = line.replace(/^([\s/*]+)/, "").trim();

        if (commentLine.match(/^\@/)) {
            lines.push(commentLine);
        }

        return lines;
    }, [] as string[]);

    return comments;
};
