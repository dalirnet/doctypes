import * as vscode from "vscode";
import {
    REGEXP_ADDITIONAL_PARENS,
    REGEXP_CLASS_LINE,
    REGEXP_CONTAINS_ASYNC,
    REGEXP_CONTAINS_NEW,
    REGEXP_DOT_BETWEEN,
    REGEXP_ENUM_LINE,
    REGEXP_EXPORT_LINE,
    REGEXP_FIRST_ATSIGN,
    REGEXP_FUNCTION_TIP,
    REGEXP_GETTER_SETTER_TIP,
    REGEXP_INTERFACE_LINE,
    REGEXP_PRIVATE_LINE,
    REGEXP_PROTECTED_LINE,
    REGEXP_PUBLIC_LINE,
    REGEXP_READONY_LINE,
    REGEXP_SEQUENCE_LETTERS_CLOSE,
    REGEXP_SEQUENCE_LETTERS_OPEN,
    REGEXP_STATIC_LINE,
    REGEXP_TYPEDEF_LINE,
    REGEXP_TYPE_PARAMETER_TIP,
    REGEXP_VARIABLE_TIP,
} from "./Regexp";
import {
    DocumentBuilderEntrieTypes,
    DocumentBuilderInputTypes,
    DocumentBuilderTypes,
    DocumentContextTypes,
    DocumentReturnTypes,
    DocumentTypes,
    EditorDefinitionsTipTypes,
    EditorDefinitionTypes,
} from "./Types";
import { getConfig } from "./Utils";

/**
 * A constant that is being exported.
 *
 * @constant
 * @name documentBuilders
 * @kind variable
 * @type {DocumentBuilderTypes}
 * @exports
 */
export const documentBuilders: DocumentBuilderTypes = {
    _description() {
        return ["${1:Description}", ""];
    },
    _class() {
        return ["@class"];
    },
    _abstract() {
        return ["@abstract"];
    },
    _interface() {
        return ["@interface"];
    },
    _typedef() {
        return ["@typedef"];
    },
    _enum() {
        return ["@enum"];
    },
    _async() {
        return ["@async"];
    },
    _function(kind) {
        return [
            `@${
                kind === "constructor"
                    ? "constructor"
                    : kind === "property" || kind === "method" || kind === "getter" || kind === "setter"
                    ? "method"
                    : "function"
            }`,
        ];
    },
    _variable(kind) {
        return [`@${kind === "enum member" ? "member" : kind === "const" ? "constant" : kind}`];
    },
    _name(value) {
        return [`@name ${value}`];
    },
    _kind(kind) {
        return [`@kind ${kind}`];
    },
    _memberof(value: string[]) {
        return [`@memberof ${value.join(".")}`];
    },
    _public() {
        return ["@public"];
    },
    _private() {
        return ["@private"];
    },
    _protected() {
        return ["@protected"];
    },
    _readonly() {
        return ["@readonly"];
    },
    _static() {
        return ["@static"];
    },
    _instance() {
        return ["@instance"];
    },
    _type(kind) {
        return [`@type {${kind === "{}" ? "object" : kind}}`];
    },
    _param(params = []) {
        return params.map(({ kind = "any", name, description }) => {
            return `@param {${kind === "{}" ? "object" : kind}} ${name || ""} ${
                description ? `- ${description}` : ""
            }`.trim();
        });
    },
    _returns(kind) {
        return [`@returns {${kind === "{}" ? "object" : kind}}`];
    },
    _extends(value) {
        return [`@extends ${value}`];
    },
    _implements(values = []) {
        return values.map((value) => {
            return `@implements ${value.trim()}`;
        });
    },
    _exports() {
        return ["@exports"];
    },
};

/**
 * Exporting the class Document.
 *
 * @class
 * @name Document
 * @kind class
 * @exports
 */
export class Document {
    /**
     * Assigning the value of the variable `documentBuilders` to the variable `builders`
     *
     * @property
     * @name builders
     * @kind property
     * @memberof Document
     * @private
     * @type {DocumentBuilderTypes}
     */
    private builders: DocumentBuilderTypes = documentBuilders;

    /**
     * Creating a new interface called DocumentContextTypes.
     *
     * @property
     * @name context
     * @kind property
     * @memberof Document
     * @private
     * @type {Partial<DocumentTypes>}
     */
    private context: DocumentContextTypes = {
        _description: true,
    };

    /**
     * A constructor that is being called when the class is being instantiated.
     *
     * @constructor
     * @name Document
     * @param {EditorDefinitionTypes} definition
     */
    constructor(private readonly definition: EditorDefinitionTypes) {
        this.parse();
    }

    /**
     * A getter method.
     *
     * @method
     * @name (get) code
     * @kind property
     * @memberof Document
     * @returns {string}
     */
    get code(): string {
        return this.definition.code;
    }

    /**
     * A getter method.
     *
     * @method
     * @name (get) tips
     * @kind property
     * @memberof Document
     * @returns {EditorDefinitionsTipTypes[]}
     */
    get tips(): EditorDefinitionsTipTypes[] {
        return this.definition.tips;
    }

    /**
     * A getter method.
     *
     * @method
     * @name (get) whitespace
     * @kind property
     * @memberof Document
     * @returns {string}
     */
    get whitespace(): string {
        return this.definition.whitespace;
    }

    /**
     * A function declaration.
     *
     * @method
     * @name parse
     * @kind method
     * @memberof Document
     * @returns {void}
     */
    parse(): void {
        /**
         * Matching the class line in the code.
         *
         * @constant
         * @name classLine
         * @kind variable
         * @memberof Document.parse
         * @type {RegExpMatchArray}
         */
        const classLine: RegExpMatchArray = this.code.match(REGEXP_CLASS_LINE) as RegExpMatchArray;

        if (classLine) {
            this.context._class = true;
            this.context._name = classLine[4];

            if (classLine[2]) {
                this.context._abstract = true;
            }

            if (classLine[6]) {
                this.context._extends = classLine[6];
            }

            if (classLine[8]) {
                this.context._implements = classLine[8].split(",");
            }
        } else {
            /**
             * It's using a regular expression to find the interface line in the code.
             *
             * @constant
             * @name interfaceLine
             * @kind variable
             * @memberof Document.parse
             * @type {RegExpMatchArray}
             */
            const interfaceLine: RegExpMatchArray = this.code.match(REGEXP_INTERFACE_LINE) as RegExpMatchArray;

            if (interfaceLine) {
                this.context._interface = true;
                this.context._name = interfaceLine[3];
            } else {
                /**
                 * Matching the typedefLine with the regular expression.
                 *
                 * @constant
                 * @name typedefLine
                 * @kind variable
                 * @memberof Document.parse
                 * @type {RegExpMatchArray}
                 */
                const typedefLine: RegExpMatchArray = this.code.match(REGEXP_TYPEDEF_LINE) as RegExpMatchArray;

                if (typedefLine) {
                    this.context._typedef = true;
                    this.context._name = typedefLine[3];
                } else {
                    /**
                     * Matching the regular expression REGEXP_ENUM_LINE to the code.
                     *
                     * @constant
                     * @name enumLine
                     * @kind variable
                     * @memberof Document.parse
                     * @type {RegExpMatchArray}
                     */
                    const enumLine: RegExpMatchArray = this.code.match(REGEXP_ENUM_LINE) as RegExpMatchArray;

                    if (enumLine) {
                        this.context._enum = true;
                        this.context._name = enumLine[3];
                    }
                }
            }
        }

        /**
         * Checking if the code contains the word async.
         *
         * @constant
         * @name containsAsync
         * @kind variable
         * @memberof Document.parse
         * @type {RegExpMatchArray}
         */
        const containsAsync: RegExpMatchArray = this.code.match(REGEXP_CONTAINS_ASYNC) as RegExpMatchArray;

        if (containsAsync) {
            this.context._async = true;
        }

        if (this.tips.length > 0) {
            /**
             * Accessing the first element in the tips array.
             *
             * @constant
             * @name firstTip
             * @kind variable
             * @memberof Document.parse
             * @type {EditorDefinitionsTipTypes}
             */
            const firstTip: EditorDefinitionsTipTypes = this.tips[0];

            /**
             * Using the regular expression to match the firstTip.value.
             *
             * @constant
             * @name functionTip
             * @kind variable
             * @memberof Document.parse
             * @type {RegExpMatchArray}
             */
            const functionTip: RegExpMatchArray = firstTip.value.match(REGEXP_FUNCTION_TIP) as RegExpMatchArray;

            if (functionTip) {
                this.context._name = functionTip[2];
                if (functionTip[1] !== "property" || this.context._name.match(REGEXP_DOT_BETWEEN)) {
                    this.context._function = functionTip[1];
                } else {
                    this.context._variable = functionTip[1];
                    this.context._type = "function";
                }

                this.context._returns = functionTip[4];
            } else {
                /**
                 * The above code is using the regular expression to match the getter and setter tip.
                 *
                 * @constant
                 * @name getterSetterTip
                 * @kind variable
                 * @memberof Document.parse
                 * @type {RegExpMatchArray}
                 */
                const getterSetterTip: RegExpMatchArray = firstTip.value.match(
                    REGEXP_GETTER_SETTER_TIP
                ) as RegExpMatchArray;

                if (getterSetterTip) {
                    this.context._name = getterSetterTip[2];
                    this.context._function = getterSetterTip[1];

                    if (getterSetterTip[1] === "getter") {
                        this.context._returns = getterSetterTip[3];
                    }
                } else {
                    /**
                     * The above code is using the match() method to find the firstTip variable and return the value of the variable.
                     *
                     * @constant
                     * @name variableTip
                     * @kind variable
                     * @memberof Document.parse
                     * @type {RegExpMatchArray}
                     */
                    const variableTip: RegExpMatchArray = firstTip.value.match(REGEXP_VARIABLE_TIP) as RegExpMatchArray;

                    if (variableTip) {
                        this.context._variable = variableTip[1];
                        this.context._name = variableTip[2] + (variableTip[3] || "");
                        this.context._type = variableTip[4];

                        if (this.code.match(REGEXP_CONTAINS_NEW)) {
                            this.context._instance = true;
                        }
                    }
                }
            }

            if (this.code.match(REGEXP_PUBLIC_LINE)) {
                this.context._public = true;
            } else if (this.code.match(REGEXP_PRIVATE_LINE)) {
                this.context._private = true;
            } else if (this.code.match(REGEXP_PROTECTED_LINE)) {
                this.context._protected = true;
            }

            if (this.code.match(REGEXP_READONY_LINE)) {
                this.context._readonly = true;
            }

            if (this.code.match(REGEXP_STATIC_LINE)) {
                this.context._static = true;
            }

            if (this.context._interface || this.context._typedef) {
                this.context._param = this.tips.reduce((params, tip) => {
                    /**
                     * Using a regular expression to match the tip.value to the REGEXP_TYPE_PARAMETER_TIP.
                     *
                     * @constant
                     * @name typeParameterTip
                     * @kind variable
                     * @memberof Document.parse.tips.reduce() callback
                     * @type {RegExpMatchArray}
                     */
                    const typeParameterTip: RegExpMatchArray = tip.value.match(
                        REGEXP_TYPE_PARAMETER_TIP
                    ) as RegExpMatchArray;

                    if (typeParameterTip) {
                        params.push({ kind: "unknown", name: typeParameterTip[1] });
                    }

                    return params;
                }, [] as DocumentTypes["_param"]);
            }

            if (this.context._returns) {
                /**
                 * Using a regular expression to find the first set of parentheses in the first tip.
                 *
                 * @constant
                 * @name inlineParameters
                 * @kind variable
                 * @memberof Document.parse
                 * @type {RegExpMatchArray}
                 */
                const inlineParameters: RegExpMatchArray = firstTip.value.match(
                    REGEXP_ADDITIONAL_PARENS
                ) as RegExpMatchArray;

                if (inlineParameters) {
                    let temp = "";
                    let sequence = 0;
                    let newParam = true;
                    const letters = inlineParameters[1].split("");

                    this.context._param = letters.reduce((params, letter, index) => {
                        if (letter.match(REGEXP_SEQUENCE_LETTERS_OPEN)) {
                            sequence++;
                        } else if (letter.match(REGEXP_SEQUENCE_LETTERS_CLOSE)) {
                            sequence--;
                        }

                        const lastLetter = index + 1 === letters.length;
                        const newParamItem = sequence === 0 && (letter === ":" || letter === ",");

                        if ((lastLetter || !newParamItem) && letter !== ";") {
                            temp += letter;
                        }

                        if (lastLetter || newParamItem) {
                            if (newParam) {
                                params.push({ name: temp.trim() });
                            } else {
                                params[params.length - 1].kind = temp.trim();
                            }
                        }

                        if (newParamItem) {
                            newParam = !newParam;
                            temp = "";
                        }

                        return params;
                    }, [] as DocumentTypes["_param"]);
                }

                if (this.context._function === "constructor") {
                    this.context._returns = "";
                }
            }

            if (this.context._name && firstTip.symbol) {
                if (firstTip.symbol.kind !== "constructor") {
                    this.context._name = firstTip.symbol.name;
                    this.context._kind = firstTip.symbol.kind;
                    if (firstTip.symbol.memberof.length) {
                        this.context._memberof = firstTip.symbol.memberof;
                    }
                }
            }
        }

        /**
         * Checking if the code starts with an export statement.
         *
         * @constant
         * @name startWithExport
         * @kind variable
         * @memberof Document.parse
         * @type {RegExpMatchArray}
         */
        const startWithExport: RegExpMatchArray = this.code.match(REGEXP_EXPORT_LINE) as RegExpMatchArray;

        if (startWithExport) {
            this.context._exports = true;
        }
    }

    /**
     * Creating a new instance of the DocumentReturnTypes class.
     *
     * @method
     * @name build
     * @kind method
     * @memberof Document
     * @returns {DocumentReturnTypes}
     */
    build(): DocumentReturnTypes {
        /**
         * Declaring a variable called snippets and assigning it an empty array.
         *
         * @let
         * @name snippets
         * @kind variable
         * @memberof Document.build
         * @type {string[]}
         */
        let snippets: string[] = [];

        /**
         * Declaring a variable called tags and assigning it an empty array.
         *
         * @let
         * @name tags
         * @kind variable
         * @memberof Document.build
         * @type {string[]}
         */
        let tags: string[] = [];

        for (const [name, builder] of Object.entries(this.builders) as DocumentBuilderEntrieTypes[]) {
            if (this.context[name] && getConfig(name) !== "Off") {
                /**
                 * Using the builder function to create a new document.
                 *
                 * @constant
                 * @name builderOutput
                 * @kind variable
                 * @memberof Document.build
                 * @type {string[]}
                 */
                const builderOutput: string[] = builder(this.context[name] as DocumentBuilderInputTypes);

                for (const line of builderOutput) {
                    snippets.push(`\n${this.whitespace} * ${line}`);
                    if (line.match(REGEXP_FIRST_ATSIGN)) {
                        tags.push(line);
                    }
                }
            }
        }

        snippets.unshift(`${this.whitespace}/**`);
        snippets.push(`\n${this.whitespace} */\n`);

        return {
            tags,
            snippet: new vscode.SnippetString(snippets.join("")),
        };
    }
}
