import { Id, Name } from "./type.spec";

/**
 * Description
 *
 * @interface
 * @name PersonInterface
 * @kind interface
 * @exports
 */
export interface PersonInterface {
    /**
     * Description
     *
     * @property
     * @name id
     * @kind property
     * @memberof PersonInterface
     * @type {Id}
     */
    id: Id;

    /**
     * Description
     *
     * @property
     * @name name
     * @kind property
     * @memberof PersonInterface
     * @type {string}
     */
    name?: Name;
}
