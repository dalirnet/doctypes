import { Id, Name } from "./type.spec";
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

/**
 * Exporting a function called `validateUserName` that takes a parameter called `username` that is a value of type `Name` and returns a value of type `T`.
 *
 * @function
 * @name validateUserName
 * @kind function
 * @param {In} username
 * @returns {Out}
 * @exports
 */
export function validateUserName<In extends string, Out = boolean>(username: In): Out {
    return (username.length > 4) as unknown as Out;
}
