export const REGEXP_ANY_WORDS = /\w+/g;

export const REGEXP_VALID_TIP = /\n```typescript\n(.*)\n```\n/is;

export const REGEXP_FIRST_SPACES = /^\s+/;
export const REGEXP_FIRST_UDERLINE = /^\_+/;

export const REGEXP_MULTI_SPACES = /\s+/g;

export const REGEXP_DOT_BETWEEN = /\w+\.\w+/g;

export const REGEXP_PARENS_LINE = /^\((.*?)\)/;

export const REGEXP_IGNORE_LINE =
    /^(((import|this|if|switch|else|for|while|do|try|catch|finally|return|yield|break|continue|super)[\(\.\;\s]|\[)|(\/\*|\*)|$)/i;

export const REGEXP_CLASS_LINE =
    /^(export\s)?(abstract\s)?(class\s+(\w+))(?:\s+)?(extends\s+(\w+))?(?:\s+)?(implements\s+?(.*?))?\{?\}?$/i;

export const REGEXP_INTERFACE_LINE = /^(export\s)?(interface\s+(\w+))/i;

export const REGEXP_TYPEDEF_LINE = /^(export\s)?(type\s+(\w+))/i;

export const REGEXP_ENUM_LINE = /^(export\s)?(enum\s+(\w+))/i;

export const REGEXP_PUBLIC_LINE = /^public\s/i;

export const REGEXP_PRIVATE_LINE = /^private\s/i;

export const REGEXP_PROTECTED_LINE = /^protected\s/i;

export const REGEXP_READONY_LINE = /^(public|private|protected)\s+readonly\s+/i;

export const REGEXP_FUNCTION_TIP =
    /(constructor|function|method|property|const|let|var)(?:\s+)([\w.]+)(?:\s+)?(?::)?(?:\s+)?(?:\((.*)\)|function)(?:\s+)?(?:(?::|=>)(?:\s+)?(.*))?/i;

export const REGEXP_GETTER_SETTER_TIP = /(getter|setter)(?:\s+)([\w.]+)(?:\s+)?(?::)?(?:\s+)?(.*)?/i;

export const REGEXP_VARIABLE_TIP =
    /(property|enum\smember|const|let|var)(?:\s+)([\w.]+)(?:<.*>)?([\w.]+)?(?:\s+)?(?:[\?\:\=]+)(?:\s+)?(.*)?/i;

export const REGEXP_TYPE_PARAMETER_TIP = /type\s+parameter\s+(\w+)\s+in\s+/i;

export const REGEXP_ADDITIONAL_PARENS = /\((.*)\)/;

export const REGEXP_SEQUENCE_LETTERS_OPEN = /[\(\{\[]/;

export const REGEXP_SEQUENCE_LETTERS_CLOSE = /[\]\}\)]/;

export const REGEXP_EXPORT_LINE = /^export\s/i;

export const REGEXP_CONTAINS_ASYNC = /(^|[\=\s])async[\(\s]/i;

export const REGEXP_CONTAINS_NEW = /[\=\s]new\s/i;
