import { User } from "./class.spec";
import { createUserId } from "./function.spec";
import { Id } from "./type.spec";

/**
 * Description
 *
 * @constant
 * @name userId
 * @kind variable
 * @type {Id}
 */
const userId: Id = createUserId();

/**
 * Description
 *
 * @constant
 * @name john
 * @kind variable
 * @instance
 * @type {User}
 */
const john: User = new User(userId, "John");

/**
 * Description
 *
 * @constant
 * @name john
 * @type {User}
 */
john.getAge();
