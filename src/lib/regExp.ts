export const words = /\w+/g;
export const validTip = /\n```typescript\n(.*)\n```\n/is;
export const firstSpaces = /^\s+/;
export const multiSpaces = /\s+/g;
export const additionalParens = /^\((.*?)\)/;

// prettier-ignore
export const ignoreLine = /^((import|this|if|switch|else|for|while|do|try|catch|finally|return|yield|break|continue|super)[(\.\;\s]|\[)/i;

// prettier-ignore
export const classLine = /^(export\s)?(abstract\s)?(class\s+(\w+))(?:\s+)?(extends\s+(\w+))?(?:\s+)?(implements\s+?(.*?))?\{?\}?$/i;
export const interfaceLine = /^(export\s)?(interface\s+(\w+))/i;
export const typeLine = /^(export\s)?(type\s+(\w+))/i;
export const enumLine = /^(export\s)?(enum\s+(\w+))/i;
export const publicLine = /^public\s/i;
export const privateLine = /^private\s/i;
export const protectedLine = /^protected\s/i;
export const readonyLine = /^(public|private|protected)\s+readonly\s+/i;

// prettier-ignore
export const functionTip = /(constructor|function|method|property|const|let|var)(?:\s+)([\w.]+)(?:\s+)?(?::)?(?:\s+)?(?:\((.*)\)|function)(?:\s+)?(?:(?::|=>)(?:\s+)(.*))?/i;

// prettier-ignore
export const variableTip =  /(property|enum\smember|const|let|var)(?:\s+)([\w.]+)(?:<.*>)?([\w.]+)?(?:\s+)?(?:[\:\=])(?:\s+)?(.*)?/i;

export const typeParameterTip = /type\s+parameter\s+(\w+)\s+in\s+/i;
export const lineParameter = /\((.*)\)/;
export const sequenceLettersOpen = /[\(\{\[]/;
export const sequenceLettersClose = /[\]\}\)]/;

export const startWithExport = /^export\s/i;
export const containsAsync = /(^|[\=\s])async[\(\s]/i;
export const containsNew = /[\=\s]new\s/i;
