import * as typeAlias from "./typeAlias";
import * as regExp from "./regExp";
import * as jsdoc from "./jsdoc";

export class Comment {
    private jsDoc: typeAlias.JsDoc = {};

    constructor({ code, tips }: typeAlias.DefinitionOfLine) {
        const classLineMatch = code.match(regExp.classLine);
        if (classLineMatch) {
            this.jsDoc._class = true;
            this.jsDoc._name = classLineMatch[4];

            if (classLineMatch[2]) {
                this.jsDoc._abstract = true;
            }

            if (classLineMatch[6]) {
                this.jsDoc._extends = classLineMatch[6];
            }

            if (classLineMatch[8]) {
                this.jsDoc._implements = classLineMatch[8].split(",");
            }
        } else {
            const interfaceLineMatch = code.match(regExp.interfaceLine);
            if (interfaceLineMatch) {
                this.jsDoc._interface = true;
                this.jsDoc._name = interfaceLineMatch[3];
            } else {
                const typeLineMatch = code.match(regExp.typeLine);
                if (typeLineMatch) {
                    this.jsDoc._typedef = true;
                    this.jsDoc._name = typeLineMatch[3];
                } else {
                    const enumLineMatch = code.match(regExp.enumLine);
                    if (enumLineMatch) {
                        this.jsDoc._enum = true;
                        this.jsDoc._name = enumLineMatch[3];
                    }
                }
            }
        }

        const containsAsyncMatch = code.match(regExp.containsAsync);
        if (containsAsyncMatch) {
            this.jsDoc._async = true;
        }

        if (tips.length > 0) {
            const functionTipMatch = tips[0].match(regExp.functionTip);
            if (functionTipMatch) {
                this.jsDoc._name = functionTipMatch[2];
                if (this.jsDoc._name.includes(".") || functionTipMatch[1] !== "property") {
                    this.jsDoc._func = functionTipMatch[1];
                } else {
                    this.jsDoc._var = functionTipMatch[1];
                    this.jsDoc._type = "function";
                }
                this.jsDoc._returns = functionTipMatch[4];
            } else {
                const variableTipMatch = tips[0].match(regExp.variableTip);
                if (variableTipMatch) {
                    this.jsDoc._var = variableTipMatch[1];
                    this.jsDoc._name = variableTipMatch[2] + (variableTipMatch[3] || "");
                    this.jsDoc._type = variableTipMatch[4];

                    if (code.match(regExp.containsNew)) {
                        this.jsDoc._instance = true;
                    }
                }
            }

            if (code.match(regExp.publicLine)) {
                this.jsDoc._public = true;
            } else if (code.match(regExp.privateLine)) {
                this.jsDoc._private = true;
            } else if (code.match(regExp.protectedLine)) {
                this.jsDoc._protected = true;
            }

            if (code.match(regExp.readonyLine)) {
                this.jsDoc._readonly = true;
            }

            if (this.jsDoc._interface || this.jsDoc._typedef) {
                this.jsDoc._param = tips.reduce((params = [], tip) => {
                    const typeParameterTipMatch = tip.match(regExp.typeParameterTip);
                    if (typeParameterTipMatch) {
                        params.push({ type: "any", name: typeParameterTipMatch[1] });
                    }

                    return params;
                }, [] as typeAlias.JsDoc["_param"]);
            }

            if (this.jsDoc._returns) {
                const lineParameterMatch = tips[0].match(regExp.lineParameter);
                if (lineParameterMatch) {
                    let temp = "";
                    let sequence = 0;
                    let newParam = true;
                    const letters = lineParameterMatch[1].split("");
                    this.jsDoc._param = letters.reduce((params, letter, index) => {
                        if (letter.match(regExp.sequenceLettersOpen)) {
                            sequence++;
                        } else if (letter.match(regExp.sequenceLettersClose)) {
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
                                params[params.length - 1].type = temp.trim();
                            }
                        }

                        if (newParamItem) {
                            newParam = !newParam;
                            temp = "";
                        }

                        return params;
                    }, [] as typeAlias.JsDocParams);
                }
            }
        }

        const startWithExportMatch = code.match(regExp.startWithExport);
        if (startWithExportMatch) {
            this.jsDoc._exports = true;
        }
    }

    generate(): string[] {
        return (Object.keys(jsdoc) as (keyof typeAlias.JsDoc)[]).reduce((lines: string[], item) => {
            if (this.jsDoc[item]) {
                const value = (jsdoc as any)[item](this.jsDoc[item]);
                if (value) {
                    lines.push(...(Array.isArray(value) ? value : [value]));
                }
            }

            return lines;
        }, []);
    }
}
