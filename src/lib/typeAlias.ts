import * as vscode from "vscode";

export type WordOfLine = {
    value: string;
    position: vscode.Position;
};

export type DefinitionOfLine = {
    code: string;
    space: number;
    tips: string[];
    position: vscode.Position;
};

export type JsDoc = {
    _class?: boolean;
    _abstract?: boolean;
    _extends?: string;
    _implements?: string[];
    _interface?: boolean;
    _typedef?: boolean;
    _enum?: boolean;
    _async?: boolean;
    _func?: string;
    _var?: string;
    _name?: string;
    _public?: boolean;
    _private?: boolean;
    _protected?: boolean;
    _readonly?: boolean;
    _instance?: boolean;
    _type?: string;
    _param?: {
        type?: string;
        name?: string;
        description?: string;
    }[];
    _returns?: string;
    _exports?: boolean;
};

export type JsDocParams = Exclude<JsDoc["_param"], undefined>;
