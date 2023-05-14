import * as vscode from "vscode";
import { inspect } from "util";
import { ConfigKeysTypes, ConfigValuesTypes } from "./Types";
import { REGEXP_FIRST_UNDERSCORES } from "./RegExp";

/**
 * A function that returns a promise.
 *
 * @function
 * @name runtimeAwait
 * @kind variable
 * @param {number} delay?
 * @returns {Promise<any>}
 * @exports
 */
export const runtimeAwait = (delay: number = 1000): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

/**
 * A function that takes an input and logs it to the console.
 *
 * @function
 * @name debug
 * @kind variable
 * @param {any} input
 * @returns {void}
 * @exports
 */
export const debug = (input: any): void => {
    console.log(inspect(input, { depth: null, colors: true }));
};

/**
 * The function splits the input string into words.
 *
 * @function
 * @name wrapLongDescription
 * @kind variable
 * @param {string} description
 * @returns {string[]}
 * @exports
 */
export const wrapLongDescription = (description: string): string[] => {
    const descriptionWrap = Math.min(Math.max(parseInt(getConfig("descriptionWrap")), 16), 1024);

    const words: string[] = description.split(/\s+/g);
    const lines: string[] = [];

    for (const word of words) {
        if (!lines.length) {
            lines.push(word);
        } else {
            if (lines[lines.length - 1].length + word.length < descriptionWrap) {
                lines[lines.length - 1] += " " + word;
            } else {
                lines.push(word);
            }
        }
    }

    return lines;
};

/**
 * A function that takes an object, a string, and a function as parameters.
 *
 * @function
 * @name registerCommand
 * @kind variable
 * @param {vscode.ExtensionContext} { subscriptions }
 * @param {string} command
 * @param {(...rest: any[]) => void} callback
 * @returns {void}
 * @exports
 */
export const registerCommand = (
    { subscriptions }: vscode.ExtensionContext,
    command: string,
    callback: (...rest: any[]) => void
): void => {
    subscriptions.push(vscode.commands.registerCommand(`doctypes.${command}`, callback));
};

/**
 * A function that takes a string and an array of any type as parameters. It returns a promise.
 *
 * @function
 * @name executeCommand
 * @kind variable
 * @param {string} command
 * @param {any[]} ...rest
 * @returns {Thenable<unknown>}
 * @exports
 */
export const executeCommand = (command: string, ...rest: any[]): Thenable<unknown> => {
    return vscode.commands.executeCommand(command, ...rest);
};

/**
 * A function that takes a string as a parameter and returns a string.
 *
 * @function
 * @name getConfig
 * @kind variable
 * @param {ConfigKeysTypes} key
 * @returns {ConfigValuesTypes}
 * @exports
 */
export const getConfig = (key: ConfigKeysTypes): ConfigValuesTypes => {
    /**
     * Replacing the first underscore in the key with an empty string.
     *
     * @constant
     * @name configKey
     * @kind variable
     * @memberof getConfig
     * @type {string}
     */
    const configKey: string = `doctypes.${key.replace(REGEXP_FIRST_UNDERSCORES, "")}`;

    return vscode.workspace.getConfiguration().get(configKey) as ConfigValuesTypes;
};

/**
 * A function that update workspace config.
 *
 * @function
 * @name updateConfig
 * @kind variable
 * @param {ConfigKeysTypes} key
 * @param {ConfigValuesTypes} value
 * @returns {Thenable<void>}
 * @exports
 */
export const updateConfig = (key: ConfigKeysTypes, value: ConfigValuesTypes): Thenable<void> => {
    /**
     * Replacing the first underscore in the key with an empty string.
     *
     * @constant
     * @name configKey
     * @kind variable
     * @memberof getConfig
     * @type {string}
     */
    const configKey: string = `doctypes.${key.replace(REGEXP_FIRST_UNDERSCORES, "")}`;

    return vscode.workspace.getConfiguration().update(configKey, value);
};

/**
 * A function that takes an error and a message as parameters and logs the error to the console and shows the message in a window.
 *
 * @function
 * @name errorHandler
 * @kind variable
 * @param {any} error
 * @param {string} message
 * @returns {void}
 * @exports
 */
export const errorHandler = (error: any, message: string): void => {
    console.error(error);
    vscode.window.showErrorMessage(message);
};
