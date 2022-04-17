import * as vscode from "vscode";
import { resolve } from "path";

export const openWorkspaceFile = (file: string): Thenable<unknown> => {
    return vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.file(resolve(__dirname, "../../../src/test/workspace", file))
    );
};

export const getText = (range: vscode.Range): string => {
    return (vscode.window.activeTextEditor?.document.getText(range) ?? "").trim();
};

export const readComments = (start: number, end: number): string[] => {
    return getText(new vscode.Range(start - 1, 0, end - 1, 0))
        .split("\n")
        .reduce((lines, line) => {
            const commentLine = line.replace(/^([\s/*]+)/, "").trim();
            if (commentLine.match(/^\@/)) {
                lines.push(commentLine);
            }

            return lines;
        }, [] as string[]);
};
