import * as vscode from "vscode";

export type DoctypesRetuenType = {
    type: string;
    value: string;
};

export type EditorSymbolTypes = {
    name: string;
    kind: string;
    memberof: string[];
    position: {
        start: number;
        end: number;
    };
};

export type EditorWordTypes = {
    value: string;
    position: vscode.Position;
};

export type EditorDefinitionsTipTypes = {
    value: string;
    symbol?: EditorSymbolTypes;
};

export type EditorDefinitionTypes = {
    code: string;
    whitespace: string;
    tips: EditorDefinitionsTipTypes[];
    position: vscode.Position;
};

export type EditorSnippetTypes = {
    caption: string;
    placeholder?: string;
};

export type DocumentTypes = {
    _description: boolean;
    _class: boolean;
    _abstract: boolean;
    _extends: string;
    _implements: string[];
    _interface: boolean;
    _typedef: boolean;
    _enum: boolean;
    _async: boolean;
    _function: string;
    _variable: string;
    _name: string;
    _kind: string;
    _memberof: string[];
    _public: boolean;
    _private: boolean;
    _protected: boolean;
    _readonly: boolean;
    _instance: boolean;
    _type: string;
    _param: { kind?: string; name?: string; description?: string }[];
    _returns: string;
    _exports: boolean;
};

export type DocumentContextTypes = Partial<DocumentTypes>;

export type DocumentBuilderInputTypes = DocumentTypes[keyof DocumentTypes];

export type DocumentBuilderCallbackTypes<T = DocumentBuilderInputTypes> = (input: T) => string[];

export type DocumentBuilderEntrieTypes = [keyof DocumentBuilderTypes, DocumentBuilderCallbackTypes];

export type DocumentBuilderTypes = {
    [T in keyof DocumentTypes]: DocumentBuilderCallbackTypes<DocumentTypes[T]>;
};

export type DocumentReturnTypes = {
    tags: string[];
    snippet: vscode.SnippetString;
};

export type ConfigKeysTypes =
    | keyof {
          [P in keyof DocumentTypes as string & P extends `${"_"}${infer V}` ? V | P : P]: any;
      }
    | "mintlifyUserId"
    | "mintlifyContext";

export type ConfigValuesTypes = "Full" | "Single" | "Auto" | "Manual" | "Off";
