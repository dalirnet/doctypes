import * as vscode from "vscode";

/**
 * A type definition.
 *
 * @typedef
 * @name DoctypesRetuenType
 * @kind variable
 * @exports
 */
export type DoctypesRetuenType = {
    type: string;
    value: string;
};

/**
 * A type definition.
 *
 * @typedef
 * @name EditorSymbolTypes
 * @kind variable
 * @exports
 */
export type EditorSymbolTypes = {
    name: string;
    kind: string;
    memberof: string[];
    position: {
        start: number;
        end: number;
    };
};

/**
 * A type definition.
 *
 * @typedef
 * @name EditorWordTypes
 * @kind variable
 * @exports
 */
export type EditorWordTypes = {
    value: string;
    position: vscode.Position;
};

/**
 * A type definition.
 *
 * @typedef
 * @name EditorDefinitionsTipTypes
 * @kind variable
 * @exports
 */
export type EditorDefinitionsTipTypes = {
    value: string;
    symbol?: EditorSymbolTypes;
};

/**
 * A type definition.
 *
 * @typedef
 * @name EditorDefinitionTypes
 * @kind variable
 * @exports
 */
export type EditorDefinitionTypes = {
    code: string;
    whitespace: string;
    tips: EditorDefinitionsTipTypes[];
    position: vscode.Position;
};

/**
 * A type definition.
 *
 * @typedef
 * @name EditorSnippetTypes
 * @kind variable
 * @exports
 */
export type EditorSnippetTypes = {
    caption: string;
    placeholder?: string;
};

/**
 * A type definition.
 *
 * @typedef
 * @name DocumentTypes
 * @kind variable
 * @exports
 */
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
    _static: boolean;
    _instance: boolean;
    _type: string;
    _param: { kind?: string; name?: string; description?: string }[];
    _returns: string;
    _exports: boolean;
};

/**
 * A type definition.
 *
 * @typedef
 * @name DocumentContextTypes
 * @kind variable
 * @exports
 */
export type DocumentContextTypes = Partial<DocumentTypes>;

/**
 * A type definition.
 *
 * @typedef
 * @name DocumentBuilderInputTypes
 * @kind variable
 * @exports
 */
export type DocumentBuilderInputTypes = DocumentTypes[keyof DocumentTypes];

/**
 * A type definition.
 *
 * @typedef
 * @name DocumentBuilderCallbackTypes
 * @kind variable
 * @param {unknown} T
 * @exports
 */
export type DocumentBuilderCallbackTypes<T = DocumentBuilderInputTypes> = (input: T) => string[];

/**
 * A type definition.
 *
 * @typedef
 * @name DocumentBuilderEntrieTypes
 * @kind variable
 * @exports
 */
export type DocumentBuilderEntrieTypes = [keyof DocumentBuilderTypes, DocumentBuilderCallbackTypes];

/**
 * A type definition.
 *
 * @typedef
 * @name DocumentBuilderTypes
 * @kind variable
 * @exports
 */
export type DocumentBuilderTypes = {
    [T in keyof DocumentTypes]: DocumentBuilderCallbackTypes<DocumentTypes[T]>;
};

/**
 * A type definition.
 *
 * @typedef
 * @name DocumentReturnTypes
 * @kind variable
 * @exports
 */
export type DocumentReturnTypes = {
    tags: string[];
    snippet: vscode.SnippetString;
};

/**
 * A type definition.
 *
 * @typedef
 * @name ConfigKeysTypes
 * @kind variable
 * @exports
 */
export type ConfigKeysTypes =
    | keyof {
          [P in keyof DocumentTypes as string & P extends `${"_"}${infer V}` ? V | P : P]: any;
      }
    | "mintlifyUserId"
    | "mintlifyContext";

/**
 * A type definition.
 *
 * @typedef
 * @name ConfigValuesTypes
 * @kind variable
 * @exports
 */
export type ConfigValuesTypes = "Full" | "Single" | "Auto" | "Manual" | "Off";

/**
 * A type definition.
 * 
 * @typedef
 * @name DescriptorPayloadTypes
 * @kind variable
 * @exports
 */
export type DescriptorPayloadTypes = {
    userId: ConfigValuesTypes;
    languageId: string;
    context: string;
    code: string;
    source: string;
    docStyle: string;
    commented: boolean;
};
