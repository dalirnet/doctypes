import { Id, Name, Age } from "./type.spec";
import { UserAbstract } from "./abstract.spec";
import { PersonInterface } from "./interface.spec";

/**
 * Exporting the class User, which extends the class UserAbstract and implements the interface PersonInterface.
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
     * A property of the class User.
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
     * A property with a getter and setter.
     *
     * @property
     * @name name
     * @kind property
     * @memberof User
     * @public
     * @type {string | undefined}
     */
    public name?: Name;

    /**
     * A property with a getter and setter.
     *
     * @property
     * @name _age
     * @kind property
     * @memberof User
     * @protected
     * @type {number | undefined}
     */
    protected _age?: Age;

    /**
     * A constructor.
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
     * A setter.
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
     * A getter.
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
     * A method with a return type of `this`.
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
     * A method with a return type of `Age`.
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

/**
 * Extending the User class.
 *
 * @class
 * @name Employee
 * @kind class
 * @extends User
 */
class Employee extends User {
    /**
     * A property of the class Employee.
     *
     * @property
     * @name role
     * @kind property
     * @memberof Employee
     * @readonly
     * @type {string | undefined}
     */
    readonly role?: string;

    /**
     * A static property of the class Employee.
     *
     * @property
     * @name department
     * @kind property
     * @memberof Employee
     * @static
     * @type {string}
     */
    static department: string = "marketing";

    /**
     * A static method.
     *
     * @method
     * @name createEmployee
     * @kind method
     * @memberof Employee
     * @public
     * @static
     * @param {Id} id
     * @returns {Employee}
     */
    public static createEmployee(id: Id): Employee {
        return new this(id);
    }
}

/**
 * Exporting the class Employee.
 *
 * @exports
 */
export default Employee;
