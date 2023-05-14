import { Id, Name } from "./type.spec";

/**
 * Exporting the interface.
 *
 * @interface
 * @name PersonInterface
 * @kind interface
 * @exports
 */
export interface PersonInterface {
    /**
     * A property of type `Id`
     *
     * @property
     * @name id
     * @kind property
     * @memberof PersonInterface
     * @type {Id}
     */
    id: Id;

    /**
     * A property with a type of `Name` and it is optional.
     *
     * @property
     * @name name
     * @kind property
     * @memberof PersonInterface
     * @type {string | undefined}
     */
    name?: Name;
}
