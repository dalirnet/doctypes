import * as vscode from "vscode";
import { Document } from "./Document";
import { Descriptor } from "./Descriptor";
import { errorHandler, executeCommand, getConfig } from "./Utils";
import { DocumentReturnTypes, EditorDefinitionTypes, EditorSymbolTypes, EditorWordTypes } from "./Types";
import {
    REGEXP_ANY_WORDS,
    REGEXP_FIRST_SPACES,
    REGEXP_IGNORE_LINE,
    REGEXP_MULTI_SPACES,
    REGEXP_PARENS_LINE,
    REGEXP_VALID_TIP,
} from "./Regexp";

/**
 * Exporting the class DocTypes.
 *
 * @class
 * @name DocTypes
 * @kind class
 * @exports
 */
export class DocTypes {
    /**
     * A property of the class.
     *
     * @property
     * @name symbols
     * @kind property
     * @memberof DocTypes
     * @public
     * @readonly
     * @type {Record<number, EditorSymbolTypes[]>}
     */
    public readonly symbols: Record<number, EditorSymbolTypes[]> = {};

    /**
     * Declaring a private variable called context and assigning it the value of the current text editor.
     *
     * @property
     * @name context
     * @kind property
     * @memberof DocTypes
     * @private
     * @readonly
     * @type {vscode.TextEditor}
     */
    private readonly context: vscode.TextEditor;

    /**
     * A constructor.
     *
     * @constructor
     * @name DocTypes
     * @param {vscode.ExtensionContext} extensionContext
     */
    constructor(public readonly extensionContext: vscode.ExtensionContext) {
        this.context = vscode.window.activeTextEditor as vscode.TextEditor;
    }

    /**
     * A getter.
     *
     * @method
     * @name (get) uri
     * @kind property
     * @memberof DocTypes
     * @returns {vscode.Uri}
     */
    get uri(): vscode.Uri {
        return this.context.document.uri;
    }

    /**
     * A getter.
     *
     * @method
     * @name (get) languageId
     * @kind property
     * @memberof DocTypes
     * @returns {string}
     */
    get languageId(): string {
        return this.context.document.languageId;
    }

    /**
     * A getter.
     *
     * @method
     * @name (get) activeLine
     * @kind property
     * @memberof DocTypes
     * @returns {number}
     */
    get activeLine(): number {
        return this.context.selection.active.line;
    }

    /**
     * A recursive function that is used to build a tree of symbols.
     *
     * @method
     * @name initSymbols
     * @kind method
     * @memberof DocTypes
     * @param {vscode.DocumentSymbol[]} symbols
     * @param {string[]} ...memberof
     * @returns {void}
     */
    initSymbols(symbols: vscode.DocumentSymbol[], ...memberof: string[]): void {
        for (const symbol of symbols) {
            /**
             * Getting the line number of the symbol.
             *
             * @constant
             * @name line
             * @kind variable
             * @memberof DocTypes.initSymbols
             * @type {number}
             */
            const line: number = symbol.selectionRange.start.line;

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

    /**
     * Getting the line of code from the active editor.
     *
     * @method
     * @name lineCode
     * @kind method
     * @memberof DocTypes
     * @param {number} line
     * @returns {string}
     */
    lineCode(line: number): string {
        try {
            /**
             * Destructuring the object returned by `this.context.document.lineAt(line)` and assigning the value of `text` to the variable `text`.
             *
             * @constant
             * @name text
             * @kind variable
             * @memberof DocTypes.lineCode
             * @type {string}
             */
            const { text }: { text: string } = this.context.document.lineAt(line);

            return text;
        } catch (error) {
            errorHandler(error, "Invalid line number.");

            return "";
        }
    }

    /**
     * Getting the symbols of the line.
     *
     * @method
     * @name lineSymbols
     * @kind method
     * @memberof DocTypes
     * @param {number} line
     * @returns {EditorSymbolTypes[]}
     */
    lineSymbols(line: number): EditorSymbolTypes[] {
        if (typeof this.symbols[line] !== "undefined") {
            return this.symbols[line];
        }

        return [];
    }

    /**
     * Getting the words of the line.
     *
     * @method
     * @name getWords
     * @kind method
     * @memberof DocTypes
     * @param {number} line
     * @returns {EditorWordTypes[]}
     */
    getWords(line: number): EditorWordTypes[] {
        /**
         * Getting the line of code from the active editor.
         *
         * @constant
         * @name lineCode
         * @kind variable
         * @memberof DocTypes.getWords
         * @type {string}
         */
        const lineCode: string = this.lineCode(line);

        /**
         * The above code is using the matchAll method to find all the matches of the regular expression in the lineCode string.
         *
         * @constant
         * @name anyWords
         * @kind variable
         * @memberof DocTypes.getWords
         * @type {RegExpMatchArray[]}
         */
        const anyWords: RegExpMatchArray[] = [...lineCode.matchAll(REGEXP_ANY_WORDS)];

        return anyWords.map((word) => {
            return {
                value: word[0],
                position: new vscode.Position(line, word.index ?? 0),
            };
        });
    }

    /**
     * A function that returns a promise.
     *
     * @async
     * @method
     * @name getDefinitions
     * @kind method
     * @memberof DocTypes
     * @param {number} line
     * @returns {Promise<EditorDefinitionTypes>}
     */
    async getDefinitions(line: number): Promise<EditorDefinitionTypes> {
        /**
         * Getting the line of code from the active editor.
         *
         * @constant
         * @name lineCode
         * @kind variable
         * @memberof DocTypes.getDefinitions
         * @type {string}
         */

        const lineCode: string = this.lineCode(line);

        /**
         * Getting the length of the first whitespace in the line.
         *
         * @constant
         * @name lineWhitespace
         * @kind variable
         * @memberof DocTypes.getDefinitions
         * @type {number}
         */
        const lineWhitespace: number = lineCode.match(REGEXP_FIRST_SPACES)?.[0]?.length ?? 0;

        /**
         * Defining a variable called definitionTips and assigning it a value of an empty array.
         *
         * @let
         * @name definitionTips
         * @kind variable
         * @memberof DocTypes.getDefinitions
         * @type {EditorDefinitionsTipTypes[]}
         */
        let definitionTips: EditorDefinitionTypes["tips"] = [];

        if (lineCode) {
            /**
             * Calling the `getWords` method.
             *
             * @constant
             * @name lineWords
             * @kind variable
             * @memberof DocTypes.getDefinitions
             * @type {EditorWordTypes[]}
             */
            const lineWords: EditorWordTypes[] = this.getWords(line);

            /**
             * Calling the `lineSymbols` method.
             *
             * @constant
             * @name lineSymbols
             * @kind variable
             * @memberof DocTypes.getDefinitions
             * @type {EditorSymbolTypes[]}
             */
            const lineSymbols: EditorSymbolTypes[] = this.lineSymbols(line);

            for (const { position } of lineWords) {
                /**
                 * Finding the first symbol that matches the condition.
                 *
                 * @constant
                 * @name symbol
                 * @kind variable
                 * @memberof DocTypes.getDefinitions
                 * @type {EditorSymbolTypes}
                 */
                const symbol: EditorSymbolTypes | undefined = lineSymbols.find((symbol) => {
                    return position.character >= symbol.position.start && position.character <= symbol.position.end;
                });

                try {
                    /**
                     * Calling the hoverTips command.
                     *
                     * @constant
                     * @name hoverTips
                     * @kind variable
                     * @memberof DocTypes.getDefinitions
                     * @type {unknown}
                     */
                    const hoverTips: unknown = await executeCommand("vscode.executeHoverProvider", this.uri, position);

                    for (const { contents } of hoverTips as vscode.Hover[]) {
                        for (const { value } of contents as vscode.MarkdownString[]) {
                            /**
                             * The above code is checking to see if the value of the tip is a valid number.
                             *
                             * @constant
                             * @name validTip
                             * @kind variable
                             * @memberof DocTypes.getDefinitions
                             * @type {RegExpMatchArray}
                             */
                            const validTip: RegExpMatchArray = value.match(REGEXP_VALID_TIP) as RegExpMatchArray;

                            if (validTip) {
                                /**
                                 * Assigning the value of the second element in the array to the variable value.
                                 *
                                 * @constant
                                 * @name value
                                 * @kind variable
                                 * @memberof DocTypes.getDefinitions
                                 * @type {string}
                                 */
                                const value: string = validTip[1]
                                    .replace("(loading...)", "")
                                    .replace(REGEXP_MULTI_SPACES, " ")
                                    .trim()
                                    .replace(REGEXP_PARENS_LINE, "$1")
                                    .trim();

                                /**
                                 * Finding the index of the tip that has the same value as the value of the tip that was just added.
                                 *
                                 * @constant
                                 * @name existedTip
                                 * @kind variable
                                 * @memberof DocTypes.getDefinitions
                                 * @type {number}
                                 */
                                const existedTip: number = definitionTips.findIndex((tip) => tip.value === value);

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

    /**
     * Add document snippet to editor.
     *
     * @async
     * @method
     * @name addDocument
     * @kind method
     * @memberof DocTypes
     * @param {vscode.SnippetString} snippetString
     * @param {EditorDefinitionTypes["position"]} position
     * @returns {Promise<boolean>}
     */
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

    /**
     * Update description of document snippet.
     *
     * @async
     * @method
     * @name addDescription
     * @kind method
     * @memberof DocTypes
     * @param {EditorDefinitionTypes} { position, code, whitespace }
     *  @param {vscode.CancellationToken} progressCancellation
     * @returns {Promise<boolean>}
     */
    async addDescription(
        { position, code, whitespace }: EditorDefinitionTypes,
        progressCancellation: vscode.CancellationToken
    ): Promise<boolean> {
        try {
            /**
             * Declaring a variable called context and assigning it an empty string.
             *
             * @let
             * @name context
             * @kind variable
             * @memberof DocTypes.addDescription
             * @type {string}
             */
            let context: string = "";

            if (getConfig("mintlifyContext") === "Full") {
                context = this.context.document.getText();
            }

            /**
             * Creating a new description.
             *
             * @constant
             * @name newDescription
             * @kind variable
             * @memberof DocTypes.addDescription
             * @instance
             * @type {string | false}
             */
            const newDescription: string | false = await new Descriptor(context, code, this.languageId).write(
                progressCancellation
            );

            if (newDescription) {
                /**
                 * Getting the current line of code and storing it in a variable.
                 *
                 * @constant
                 * @name currentDescription
                 * @kind variable
                 * @memberof DocTypes.addDescription
                 * @type {string}
                 */
                const currentDescription: string = this.context.document.lineAt(position.line + 1).text;

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

    /**
     * initiate document symbols.
     *
     * @async
     * @method
     * @name init
     * @kind method
     * @memberof DocTypes
     * @returns {Promise<void>}
     */
    async init(): Promise<void> {
        try {
            /**
             * Getting the document symbols for the current document.
             *
             * @constant
             * @name documentSymbol
             * @kind variable
             * @memberof DocTypes.init
             * @type {unknown}
             */
            const documentSymbol: unknown = await executeCommand("vscode.executeDocumentSymbolProvider", this.uri);

            if (documentSymbol) {
                this.initSymbols(documentSymbol as vscode.DocumentSymbol[]);
            }
        } catch (error) {
            errorHandler(error, "Vscode command.executeDocumentSymbolProvider has an unexpected error.");
        }
    }

    /**
     * Generate documents.
     *
     * @async
     * @method
     * @name generate
     * @kind method
     * @memberof DocTypes
     * @param {number} line
     * @param {boolean} emmit
     * @returns {Promise<string[]>}
     */
    async generate(line: number, emmit: boolean): Promise<string[]> {
        /**
         * A progress bar that shows up when the extension is running.
         *
         * @constant
         * @name progressOptions
         * @kind variable
         * @memberof DocTypes.generate
         * @type {vscode.ProgressOptions}
         */
        const progressOptions: vscode.ProgressOptions = {
            title: "DocTypes is being describe",
            location: vscode.ProgressLocation.Notification,
            cancellable: true,
        };

        return await vscode.window.withProgress(
            progressOptions,
            async (progress, cancellationToken): Promise<string[]> => {
                /**
                 * Getting the definition of the line.
                 *
                 * @constant
                 * @name definition
                 * @kind variable
                 * @memberof DocTypes.generate.vscode.window.withProgress() callback
                 * @type {EditorDefinitionTypes}
                 */
                const definition: EditorDefinitionTypes = await this.getDefinitions(line);

                if (!definition.code.match(REGEXP_IGNORE_LINE)) {
                    /**
                     * Creating a new document object and then calling the build method on it.
                     *
                     * @constant
                     * @name documents
                     * @kind variable
                     * @memberof DocTypes.generate.vscode.window.withProgress() callback
                     * @instance
                     * @type {DocumentReturnTypes}
                     */
                    const documents: DocumentReturnTypes = new Document(definition).build();

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
                            await this.addDescription(definition, cancellationToken);
                            clearInterval(progressTimer);
                        }
                    }

                    return documents.tags;
                }

                return [];
            }
        );
    }

    /**
     * Generate documents for this current line.
     *
     * @async
     * @method
     * @name generateForCurrentLine
     * @kind method
     * @memberof DocTypes
     * @param {boolean} emmit?
     * @returns {Promise<string[]>}
     */
    async generateForCurrentLine(emmit: boolean = true): Promise<string[]> {
        await this.init();
        return await this.generate(this.activeLine, emmit);
    }

    /**
     * Generate documents for this custom line.
     *
     * @async
     * @method
     * @name generateForCustomLine
     * @kind method
     * @memberof DocTypes
     * @param {number} line?
     * @param {boolean} emmit?
     * @returns {Promise<string[]>}
     */
    async generateForCustomLine(line: number = 1, emmit: boolean = true): Promise<string[]> {
        await this.init();
        return await this.generate(line - 1, emmit);
    }
}
