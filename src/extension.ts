import * as vscode from "vscode";

namespace docTypes {
    export const perfix = "doctypes";
    export namespace regExp {
        export const words = /\w+/g;
        export const validTip = /\n```typescript\n(.*)\n```\n/is;
        export const multiSpaces = /\s+/g;
    }

    export namespace utils {
        export const registerCommand = (context: vscode.ExtensionContext, command: string, callback: () => void) => {
            context.subscriptions.push(vscode.commands.registerCommand(`${perfix}.${command}`, callback));
        };

        export const executeCommand = (command: string, ...rest: any[]): Thenable<unknown> => {
            return vscode.commands.executeCommand(command, ...rest);
        };
    }

    export namespace typeAlias {
        export type WordOfLine = {
            value: string;
            position: vscode.Position;
        };

        export type DefinitionOfLine = {
            code: string;
            tips: string[];
        };
    }

    export class Editor {
        private readonly extensionContext: vscode.ExtensionContext;

        constructor(extensionContext: vscode.ExtensionContext) {
            this.extensionContext = extensionContext;
        }

        get context(): vscode.TextEditor {
            return vscode.window.activeTextEditor as vscode.TextEditor;
        }

        get uri(): vscode.Uri {
            return this.context.document.uri;
        }

        get languageId(): string {
            return this.context.document.languageId;
        }

        get activeLineNumber(): number {
            return this.context.selection.active.line;
        }

        lineReader(lineNumber: number = this.activeLineNumber): string {
            const { text } = this.context.document.lineAt(lineNumber);

            return text;
        }

        wordsOfLine(lineNumber: number = this.activeLineNumber): typeAlias.WordOfLine[] {
            const words = this.lineReader(lineNumber).matchAll(regExp.words);

            return [...words].map((word) => {
                const value = word[0];
                const position = new vscode.Position(lineNumber, word.index as number);

                return { value, position } as typeAlias.WordOfLine;
            });
        }

        async definitionOfLine(lineNumber: number = this.activeLineNumber): Promise<typeAlias.DefinitionOfLine> {
            const definitionTips: typeAlias.DefinitionOfLine["tips"] = [];

            for (const word of this.wordsOfLine(lineNumber)) {
                const hoverTips = await utils.executeCommand("vscode.executeHoverProvider", this.uri, word.position);

                for (const { contents } of hoverTips as vscode.Hover[]) {
                    for (const { value } of contents as vscode.MarkdownString[]) {
                        const validTip = value.match(regExp.validTip);

                        if (validTip) {
                            definitionTips.push(validTip[1].replace(regExp.multiSpaces, " "));
                        }
                    }
                }
            }

            return {
                code: this.lineReader(lineNumber).trim(),
                tips: [...new Set(definitionTips)],
            };
        }
    }

    export const activate = (extensionContext: vscode.ExtensionContext) => {
        const editor = new Editor(extensionContext);

        utils.registerCommand(extensionContext, "generate", async () => {
            if (editor.languageId === "typescript") {
                console.log(await editor.definitionOfLine());
            }
        });
    };

    export const deactivate = () => {};
}

export const activate = docTypes.activate;
export const deactivate = docTypes.deactivate;
