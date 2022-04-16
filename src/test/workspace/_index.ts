import { User } from "./_class";
import { createUserId } from "./_function";
import { Id } from "./_types";

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
