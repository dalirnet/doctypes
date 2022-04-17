import * as vscode from "vscode";
import { Document } from "./Document";
import { Descriptor } from "./Descriptor";
import { errorHandler, executeCommand, getConfig } from "./Utils";
import { EditorDefinitionTypes, EditorSymbolTypes, EditorWordTypes } from "./Types";
import {
    REGEXP_ANY_WORDS,
    REGEXP_FIRST_SPACES,
    REGEXP_IGNORE_LINE,
    REGEXP_MULTI_SPACES,
    REGEXP_PARENS_LINE,
    REGEXP_VALID_TIP,
} from "./Regexp";

export class DocTypes {
    public readonly symbols: Record<number, EditorSymbolTypes[]> = {};
    constructor(public readonly extensionContext: vscode.ExtensionContext) {}

    get context(): vscode.TextEditor {
        return vscode.window.activeTextEditor as vscode.TextEditor;
    }

    get uri(): vscode.Uri {
        return this.context.document.uri;
    }

    get languageId(): string {
        return this.context.document.languageId;
    }

    get activeLine(): number {
        return this.context.selection.active.line;
    }

    initSymbols(symbols: vscode.DocumentSymbol[], ...memberof: string[]) {
        for (const symbol of symbols) {
            const line = symbol.selectionRange.start.line;
            if (typeof this.symbols[line] === "undefined") {
                this.symbols[line] = [];
            }

            this.symbols[line].push({
                memberof,
                name: symbol.name,
                kind: vscode.SymbolKind[symbol.kind].toLowerCase(),
                position: {
                    start: symbol.selectionRange.start.character,
                    end: symbol.selectionRange.end.character,
                },
            });

            this.initSymbols(symbol.children, ...memberof, symbol.name);
        }
    }

    lineCode(line: number): string {
        try {
            const { text } = this.context.document.lineAt(line);

            return text;
        } catch (error) {
            errorHandler(error, "Invalid line number.");

            return "";
        }
    }

    lineSymbols(line: number): EditorSymbolTypes[] {
        if (typeof this.symbols[line] !== "undefined") {
            return this.symbols[line];
        }

        return [];
    }

    getWords(line: number): EditorWordTypes[] {
        const lineCode = this.lineCode(line);
        const anyWords = [...lineCode.matchAll(REGEXP_ANY_WORDS)];
        return anyWords.map((word) => {
            return {
                value: word[0],
                position: new vscode.Position(line, word.index ?? 0),
            };
        });
    }

    async getDefinitions(line: number): Promise<EditorDefinitionTypes> {
        const lineCode = this.lineCode(line);
        const lineWhitespace = lineCode.match(REGEXP_FIRST_SPACES)?.[0]?.length ?? 0;
        let definitionTips: EditorDefinitionTypes["tips"] = [];
        if (lineCode) {
            const lineWords = this.getWords(line);
            const lineSymbols = this.lineSymbols(line);

            for (const { position } of lineWords) {
                const symbol = lineSymbols.find(
                    (symbol) => position.character >= symbol.position.start && position.character <= symbol.position.end
                );

                try {
                    const hoverTips = await executeCommand("vscode.executeHoverProvider", this.uri, position);
                    for (const { contents } of hoverTips as vscode.Hover[]) {
                        for (const { value } of contents as vscode.MarkdownString[]) {
                            const validTip = value.match(REGEXP_VALID_TIP);
                            if (validTip) {
                                const value = validTip[1]
                                    .replace("(loading...)", "")
                                    .replace(REGEXP_MULTI_SPACES, " ")
                                    .trim()
                                    .replace(REGEXP_PARENS_LINE, "$1")
                                    .trim();

                                const existedTip = definitionTips.findIndex((tip) => tip.value === value);
                                if (existedTip === -1) {
                                    definitionTips.push({ value, symbol });
                                } else if (!definitionTips[existedTip].symbol && symbol) {
                                    definitionTips[existedTip].symbol = symbol;
                                }
                            }
                        }
                    }
                } catch (error) {
                    errorHandler(error, "Vscode command.executeHoverProvider has an unexpected error.");
                }
            }
        }

        return {
            code: lineCode.trim(),
            tips: definitionTips,
            position: new vscode.Position(line, 0),
            whitespace: String(" ").repeat(lineWhitespace),
        };
    }

    async addDocument(
        snippetString: vscode.SnippetString,
        position: EditorDefinitionTypes["position"]
    ): Promise<boolean> {
        try {
            return await this.context.insertSnippet(snippetString, position);
        } catch (error) {
            errorHandler(error, "Vscode editor.insertSnippet has an unexpected error.");

            return false;
        }
    }

    async addDescription({ position, code, whitespace }: EditorDefinitionTypes): Promise<boolean> {
        try {
            let context = "";
            if (getConfig("mintlifyContext") === "Full") {
                context = this.context.document.getText();
            }

            const newDescription = await new Descriptor(context, code, this.languageId).write();
            if (newDescription) {
                const currentDescription = this.context.document.lineAt(position.line + 1).text;
                return await this.context.edit((builder: vscode.TextEditorEdit) => {
                    builder.replace(
                        new vscode.Range(
                            new vscode.Position(position.line + 1, whitespace.length + 3),
                            new vscode.Position(position.line + 1, currentDescription.length)
                        ),
                        newDescription
                    );
                });
            }

            return false;
        } catch (error) {
            errorHandler(error, "Vscode editor.edit has an unexpected error.");

            return false;
        }
    }

    async init() {
        try {
            const documentSymbol = await executeCommand("vscode.executeDocumentSymbolProvider", this.uri);
            if (documentSymbol) {
                this.initSymbols(documentSymbol as vscode.DocumentSymbol[]);
            }
        } catch (error) {
            errorHandler(error, "Vscode command.executeDocumentSymbolProvider has an unexpected error.");
        }
    }

    async generate(line: number, emmit: boolean): Promise<string[]> {
        const progressOptions = {
            title: "DocTypes is being describe",
            location: vscode.ProgressLocation.Notification,
        };
        return await vscode.window.withProgress(progressOptions, async (progress): Promise<string[]> => {
            const definition = await this.getDefinitions(line);
            if (!definition.code.match(REGEXP_IGNORE_LINE)) {
                const documents = new Document(definition).build();
                if (emmit && (await this.addDocument(documents.snippet, definition.position))) {
                    if (getConfig("_description") === "Auto") {
                        let attempt = 1;
                        let percent = 0;
                        const progressTimer = setInterval(() => {
                            percent++;
                            if (percent > 100) {
                                attempt++;
                                percent = 0;
                            }
                            progress.report({ message: `Attempt ${attempt} - ${percent}%` });
                        }, 100);
                        await this.addDescription(definition);
                        clearInterval(progressTimer);
                    }
                }

                return documents.tags;
            }

            return [];
        });
    }

    async generateForCurrentLine(emmit: boolean = true): Promise<string[]> {
        await this.init();
        return await this.generate(this.activeLine, emmit);
    }

    async generateForCustomLine(line: number = 1, emmit: boolean = true): Promise<string[]> {
        await this.init();
        return await this.generate(line - 1, emmit);
    }
}
