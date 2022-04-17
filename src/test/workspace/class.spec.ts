import { Id, Name, Age } from "./type.spec";
import { UserAbstract } from "./abstract.spec";
import { PersonInterface } from "./interface.spec";

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
     * @property
     * @name id
     * @kind property
     * @memberof User
     * @public
     * @readonly
     * @type {Id}
     */
    public readonly id: Id;

    /**
     * Description
     *
     * @property
     * @name name
     * @kind property
     * @memberof User
     * @public
     * @type {string}
     */
    public name?: Name;

    /**
     * Description
     *
     * @property
     * @name _age
     * @kind property
     * @memberof User
     * @protected
     * @type {number}
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
