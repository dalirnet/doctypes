import * as typeAlias from "./typeAlias";

export const _class = () => {
    return "@class";
};

export const _abstract = () => {
    return "@abstract";
};

export const _interface = () => {
    return "@interface";
};

export const _typedef = () => {
    return "@typedef";
};

export const _enum = () => {
    return "@enum";
};

export const _async = () => {
    return "@async";
};

export const _func = (mode: typeAlias.JsDoc["_func"]) => {
    return `@${
        mode === "constructor" ? "constructor" : mode === "property" || mode === "method" ? "method" : "function"
    }`;
};

export const _var = (mode: typeAlias.JsDoc["_var"]) => {
    return `@${mode === "property" || mode === "enum member" ? "member" : mode === "const" ? "constant" : "var"}`;
};

export const _name = (value: typeAlias.JsDoc["_name"]) => {
    return `@name ${value}`;
};

export const _public = () => {
    return "@public";
};

export const _private = () => {
    return "@private";
};

export const _protected = () => {
    return "@protected";
};

export const _readonly = () => {
    return "@readonly";
};

export const _instance = () => {
    return "@instance";
};

export const _type = (value: typeAlias.JsDoc["_type"]) => {
    return `@type {${value === "{}" ? "object" : value}}`;
};

export const _param = (params: typeAlias.JsDoc["_param"] = []) => {
    return params.map(({ type = "any", name, description }) => {
        return `@param {${type === "{}" ? "object" : type}} ${name || ""} ${
            description ? `- ${description}` : ""
        }`.trim();
    });
};

export const _returns = (value: typeAlias.JsDoc["_returns"]) => {
    return `@returns {${value === "{}" ? "object" : value}}`;
};

export const _extends = (name: typeAlias.JsDoc["_extends"]) => {
    return `@extends ${name}`;
};

export const _implements = (names: typeAlias.JsDoc["_implements"] = []) => {
    return names.map((name) => {
        return `@implements ${name.trim()}`;
    });
};

export const _exports = () => {
    return "@exports";
};
