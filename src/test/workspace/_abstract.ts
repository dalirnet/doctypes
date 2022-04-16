import { Age } from "./_types";

/**
 * Description
 *
 * @class
 * @abstract
 * @name UserAbstract
 * @kind class
 * @exports
 */
export abstract class UserAbstract {
    /**
     * Description
     *
     * @constructor
     * @name UserAbstract
     */
    constructor() {}

    /**
     * Description
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
     * Description
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
     * Description
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
