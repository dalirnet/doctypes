import { Id } from "./type.spec";
import { MAX, MIN } from "./variable.spec";

/**
 * Exporting a function called `createUserId` that takes a parameter called `nonce` that is a number and returns a value of type `Id`.
 *
 * @function
 * @name createUserId
 * @kind function
 * @param {number} nonce?
 * @returns {Id}
 * @exports
 */
export function createUserId(nonce: number = 0): Id {
    /**
     * Generating a random number between the `MAX` and `MIN` variables.
     *
     * @constant
     * @name perfix
     * @kind variable
     * @memberof createUserId
     * @type {number}
     */
    const perfix: number = Math.floor(Math.random() * (MAX - MIN)) + MIN;

    return perfix + nonce;
}
