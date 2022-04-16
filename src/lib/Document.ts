import * as vscode from "vscode";
import {
    REGEXP_ADDITIONAL_PARENS,
    REGEXP_CLASS_LINE,
    REGEXP_CONTAINS_ASYNC,
    REGEXP_CONTAINS_NEW,
    REGEXP_DOT_BETWEEN,
    REGEXP_ENUM_LINE,
    REGEXP_EXPORT_LINE,
    REGEXP_FUNCTION_TIP,
    REGEXP_INTERFACE_LINE,
    REGEXP_PRIVATE_LINE,
    REGEXP_PROTECTED_LINE,
    REGEXP_PUBLIC_LINE,
    REGEXP_READONY_LINE,
    REGEXP_SEQUENCE_LETTERS_CLOSE,
    REGEXP_SEQUENCE_LETTERS_OPEN,
    REGEXP_TYPEDEF_LINE,
    REGEXP_TYPE_PARAMETER_TIP,
    REGEXP_VARIABLE_TIP,
} from "./Regexp";
import {
    DocumentBuilderEntrieTypes,
    DocumentBuilderInputTypes,
    DocumentBuilderTypes,
    DocumentContextTypes,
    DocumentTypes,
    EditorDefinitionTypes,
} from "./Types";
import { getConfig } from "./Utils";

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
                    : kind === "property" || kind === "method"
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

export class Document {
    private builders = documentBuilders;
    private context: DocumentContextTypes = {
        _description: true,
    };

    constructor(private readonly definition: EditorDefinitionTypes) {
        this.parse();
    }

    get code() {
        return this.definition.code;
    }

    get tips() {
        return this.definition.tips;
    }

    get whitespace() {
        return this.definition.whitespace;
    }

    parse(): void {
        const classLine = this.code.match(REGEXP_CLASS_LINE);
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
            const interfaceLine = this.code.match(REGEXP_INTERFACE_LINE);
            if (interfaceLine) {
                this.context._interface = true;
                this.context._name = interfaceLine[3];
            } else {
                const typedefLine = this.code.match(REGEXP_TYPEDEF_LINE);
                if (typedefLine) {
                    this.context._typedef = true;
                    this.context._name = typedefLine[3];
                } else {
                    const enumLine = this.code.match(REGEXP_ENUM_LINE);
                    if (enumLine) {
                        this.context._enum = true;
                        this.context._name = enumLine[3];
                    }
                }
            }
        }

        const containsAsync = this.code.match(REGEXP_CONTAINS_ASYNC);
        if (containsAsync) {
            this.context._async = true;
        }

        if (this.tips.length > 0) {
            const firstTip = this.tips[0];

            const functionTip = firstTip.value.match(REGEXP_FUNCTION_TIP);
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
                const variableTip = firstTip.value.match(REGEXP_VARIABLE_TIP);
                if (variableTip) {
                    this.context._variable = variableTip[1];
                    this.context._name = variableTip[2] + (variableTip[3] || "");
                    this.context._type = variableTip[4];

                    if (this.code.match(REGEXP_CONTAINS_NEW)) {
                        this.context._instance = true;
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

            if (this.context._interface || this.context._typedef) {
                this.context._param = this.tips.reduce((params, tip) => {
                    const typeParameterTip = tip.value.match(REGEXP_TYPE_PARAMETER_TIP);
                    if (typeParameterTip) {
                        params.push({ kind: "unknown", name: typeParameterTip[1] });
                    }

                    return params;
                }, [] as DocumentTypes["_param"]);
            }

            if (this.context._returns) {
                const inlineParameters = firstTip.value.match(REGEXP_ADDITIONAL_PARENS);
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

        const startWithExport = this.code.match(REGEXP_EXPORT_LINE);
        if (startWithExport) {
            this.context._exports = true;
        }
    }

    build(): vscode.SnippetString {
        let lines: string[] = [];
        lines.push(`${this.whitespace}/**`);
        for (const [name, builder] of Object.entries(this.builders) as DocumentBuilderEntrieTypes[]) {
            if (this.context[name] && getConfig(name) !== "Off") {
                for (const line of builder(this.context[name] as DocumentBuilderInputTypes)) {
                    lines.push(`\n${this.whitespace} * ${line}`);
                }
            }
        }
        lines.push(`\n${this.whitespace} */\n`);

        return new vscode.SnippetString(lines.join(""));
    }
}
