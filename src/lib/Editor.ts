import * as vscode from "vscode";
import * as typeAlias from "./typeAlias";
import * as regExp from "./regExp";
import * as utils from "./utils";
import { Comment } from "./Comment";
import { Descriptor } from "./Descriptor";

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

        const lineText = this.lineReader(lineNumber);

        if (!lineText.trim().match(regExp.ignoreLine)) {
            for (const word of this.wordsOfLine(lineNumber)) {
                const hoverTips = await utils.executeCommand("vscode.executeHoverProvider", this.uri, word.position);

                for (const { contents } of hoverTips as vscode.Hover[]) {
                    for (const { value } of contents as vscode.MarkdownString[]) {
                        const validTip = value.match(regExp.validTip);

                        if (validTip) {
                            definitionTips.push(
                                validTip[1]
                                    .replace("(loading...)", "")
                                    .replace(regExp.multiSpaces, " ")
                                    .trim()
                                    .replace(regExp.additionalParens, "$1")
                                    .trim()
                            );
                        }
                    }
                }
            }
        }

        return {
            code: lineText.trim(),
            space: (lineText.match(regExp.firstSpaces) as any[])?.[0]?.length ?? 0,
            tips: [...new Set(definitionTips)],
            position: new vscode.Position(lineNumber, 0),
        };
    }

    async addJsDoc(position: vscode.Position, space: number = 0, lines: string[] = []): Promise<any> {
        return await this.context.edit((builder: vscode.TextEditorEdit) => {
            const firstSpaces = " ".repeat(space);
            const lineValue = ["@description", "", ...lines].map((line) => {
                return `\n${firstSpaces} * ${line}`;
            });

            builder.insert(position, `${firstSpaces}/**${lineValue.join("")}\n${firstSpaces} */\n`);
        });
    }

    async addDescription(line: number, context: string, code: string): Promise<any> {
        const descriptor = new Descriptor(context, code);
        try {
            const { data } = await descriptor.write();
            return await this.context.edit((builder: vscode.TextEditorEdit) => {
                const currentDescription = this.lineReader(line);
                const replaceRange = new vscode.Range(
                    new vscode.Position(line, 0),
                    new vscode.Position(line, currentDescription.length)
                );
                builder.replace(replaceRange, currentDescription.replace(/@\w+/, data.docstring));
            });
        } catch ({ message }) {
            console.error(message);
        }
    }

    generateJsDoc() {
        const progressOptions = {
            title: "DocTypes is running",
            location: vscode.ProgressLocation.Notification,
        };
        vscode.window.withProgress(progressOptions, (progress): Thenable<unknown> => {
            return new Promise(async (resolve: Function) => {
                let progressPercent = 0;
                const definition = await this.definitionOfLine();
                if (definition.tips.length) {
                    const progressTimer = setInterval(() => {
                        progressPercent += 5;
                        progress.report({ message: `${progressPercent > 100 ? 100 : progressPercent}%` });
                    }, 250);
                    const commentLines = new Comment(definition).generate();
                    await this.addJsDoc(definition.position, definition.space, commentLines);
                    await this.addDescription(
                        definition.position.line + 1,
                        this.context.document.getText(
                            new vscode.Range(
                                new vscode.Position(definition.position.line, 0),
                                new vscode.Position(definition.position.line + commentLines.length + 4, 0)
                            )
                        ),
                        definition.code
                    );

                    clearInterval(progressTimer);
                }
                resolve();
            });
        });
    }
}
