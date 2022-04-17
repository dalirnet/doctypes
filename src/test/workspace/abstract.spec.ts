import { Age } from "./type.spec";

/**
 * Exporting the class UserAbstract.
 *
 * @class
 * @abstract
 * @name UserAbstract
 * @kind class
 * @exports
 */
export abstract class UserAbstract {
    /**
     * A constructor.
     *
     * @constructor
     * @name UserAbstract
     */
    constructor() {}

    /**
     * A method that returns an Age.
     *
     * @method
     * @name getAge
     * @kind method
     * @memberof UserAbstract
     * @public
     * @returns {Age}
     */
    public abstract getAge(): Age;

    /**
     * A method that takes an Age and returns this.
     *
     * @method
     * @name setAge
     * @kind method
     * @memberof UserAbstract
     * @public
     * @param {Age} age
     * @returns {this}
     */
    public abstract setAge(age: Age): this;

    /**
     * A getter.
     *
     * @method
     * @name (get) isOld
     * @kind property
     * @memberof UserAbstract
     * @returns {boolean}
     */
    get isOld(): boolean {
        const age = this.getAge();
        if (age > 50) {
            return true;
        }

        return false;
    }
}
