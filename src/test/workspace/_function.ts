import { Id } from "./_types";
import { MAX, MIN } from "./_variable";

/**
 * Description
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
     * Description
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
