import { User } from "./class.spec";
import { createUserId } from "./function.spec";
import { Id } from "./type.spec";

/**
 * Creating a constant variable called `userId` of type `Id` and assigning it the value of `createUserId()`.
 *
 * @constant
 * @name userId
 * @kind variable
 * @type {Id}
 */
const userId: Id = createUserId();

/**
 * Creating a constant variable called `john` of type `User` and assigning it the value of `new User(userId, "John")`.
 *
 * @constant
 * @name john
 * @kind variable
 * @instance
 * @type {User}
 */
const john: User = new User(userId, "John");

/**
 * Calling the `getAge()` method on the `john` instance.
 *
 * @constant
 * @name john
 * @type {User}
 */
john.getAge();
