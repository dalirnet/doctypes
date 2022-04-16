import { Id, Name, Age } from "./_types";
import { UserAbstract } from "./_abstract";
import { PersonInterface } from "./_interface";

/**
 * Description
 *
 * @class
 * @name User
 * @kind class
 * @extends UserAbstract
 * @implements PersonInterface
 * @exports
 */
export class User extends UserAbstract implements PersonInterface {
    /**
     * Description
     *
     * @method
     * @name id
     * @kind property
     * @memberof User
     * @public
     * @readonly
     */
    public readonly id: Id;

    /**
     * Description
     *
     * @method
     * @name name
     * @kind property
     * @memberof User
     * @public
     */
    public name?: Name;

    /**
     * Description
     *
     * @method
     * @name _age
     * @kind property
     * @memberof User
     * @protected
     */
    protected _age?: Age;

    /**
     * Description
     *
     * @constructor
     * @name User
     * @param {Id} id
     * @param {Name} name?
     */
    constructor(id: Id, name?: Name) {
        super();

        this.id = id;

        if (name) {
            this.name = name;
        }
    }

    /**
     * Description
     *
     * @method
     * @name (set) nickname
     * @kind property
     * @memberof User
     */
    set nickname(name: Name) {
        this.name = name;
    }

    /**
     * Description
     *
     * @method
     * @name getNickname
     * @kind property
     * @memberof User
     * @public
     * @returns {Name}
     */
    public getNickname: () => Name = (): Name => {
        return this.name as Name;
    };

    /**
     * Description
     *
     * @method
     * @name setAge
     * @kind method
     * @memberof User
     * @public
     * @param {Age} age
     * @returns {this}
     */
    public setAge(age: Age): this {
        this._age = age;

        return this;
    }

    /**
     * Description
     *
     * @method
     * @name getAge
     * @kind method
     * @memberof User
     * @public
     * @returns {Age}
     */
    public getAge(): Age {
        return this._age as Age;
    }
}
