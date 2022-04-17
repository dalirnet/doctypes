# DocTypes

JSDoc generator for JavaScript, TypeScript using AI.

![demo](./demo.gif)

## Sample

-   Class

```typescript
/**
 * Exporting the class User, which extends the class UserAbstract
 * and implements the interface PersonInterface.
 *
 * @class
 * @name User
 * @kind class
 * @extends UserAbstract
 * @implements PersonInterface
 * @exports
 */
export class User extends UserAbstract implements PersonInterface {}
```

-   Function

```typescript
/**
 * Exporting a function called `createUserId` that takes a parameter called `nonce`
 * that is a number and returns a value of type `Id`.
 *
 * @function
 * @name createUserId
 * @kind function
 * @param {number} nonce?
 * @returns {Id}
 * @exports
 */
export function createUserId(nonce: number = 0): Id {}
```

-   Variable

```typescript
/**
 * Generating a random number between the `MAX` and `MIN` variables.
 *
 * @constant
 * @name perfix
 * @kind variable
 * @memberof createUserId
 * @type {number}
 */
const perfix: number = Math.floor(Math.random() * (MAX - MIN)) + MIN;
```

-   Interface

```typescript
/**
 * Exporting the interface.
 *
 * @interface
 * @name PersonInterface
 * @kind interface
 * @exports
 */
export interface PersonInterface {}
```

-   Type

```typescript
/**
 * It's a type alias.
 *
 * @typedef
 * @name Id
 * @kind variable
 * @exports
 */
export type Id = string | number;
```

### Shortcut keys

-   linux `ctrl+alt+d`
-   windows `ctrl+alt+d`
-   mac `cmd+alt+d`

### Configuration

| **Name**                                                                                                                                 | **Type**                                                                        |
| :--------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **doctypes.mintlifyUserId**</br>The custom Mintlify <small>`userId`</small>, See [Mintlify](https://www.mintlify.com/) for more details. | String</br>Default <small>`"4aeafe05-c396-4389-8d77-52e585e41932"`</small>      |
| **doctypes.mintlifyContext**</br>Type of Mintlify <small>`context`</small> full of page or single line.                                  | Enum <small>_Full_ , _Single_</small></br>Default <small>`Full`</small>         |
| **doctypes.description**</br>Type of <small>`description`</small> generation.                                                            | Enum <small>_Auto_ , _Manual_ , _Off_</small></br>Default <small>`Auto`</small> |
| **doctypes.class**</br>Type of <small>`@class`</small> tag generation.                                                                   | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.abstract**</br>Type of <small>`@abstract`</small> tag generation.                                                             | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.interface**</br>Type of <small>`@interface`</small> tag generation.                                                           | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.typedef**</br>Type of <small>`@typedef`</small> tag generation.                                                               | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.enum**</br>Type of <small>`@enum`</small> tag generation.                                                                     | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.async**</br>Type of <small>`@async`</small> tag generation.                                                                   | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.function**</br>Type of <small>`@function`</small> tag generation.                                                             | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.variable**</br>Type of <small>`@variable`</small> tag generation.                                                             | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.name**</br>Type of <small>`@name`</small> tag generation.                                                                     | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.kind**</br>Type of <small>`@kind`</small> tag generation.                                                                     | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.memberof**</br>Type of <small>`@memberof`</small> tag generation.                                                             | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.public**</br>Type of <small>`@public`</small> tag generation.                                                                 | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.private**</br>Type of <small>`@private`</small> tag generation.                                                               | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.protected**</br>Type of <small>`@protected`</small> tag generation.                                                           | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.readonly**</br>Type of <small>`@readonly`</small> tag generation.                                                             | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.instance**</br>Type of <small>`@instance`</small> tag generation.                                                             | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.type**</br>Type of <small>`@type`</small> tag generation.                                                                     | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.param**</br>Type of <small>`@param`</small> tag generation.                                                                   | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.returns**</br>Type of <small>`@returns`</small> tag generation.                                                               | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.extends**</br>Type of <small>`@extends`</small> tag generation.                                                               | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.implements**</br>Type of <small>`@implements`</small> tag generation.                                                         | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |
| **doctypes.exports**</br>Type of <small>`@exports`</small> tag generation.                                                               | Enum <small>_Auto_ , _Off_</small></br>Default <small>`Auto`</small>            |

### Supported filetypes

-   .conf
-   .cgf

### Test

-   [type.spec.ts](./src/test/workspace/type.spec.ts)
    -   ✔ type Id `(967ms)`
    -   ✔ type Name `(150ms)`
    -   ✔ type Age `(169ms)`
-   [interface.spec.ts](./src/test/workspace/interface.spec.ts)
    -   ✔ interface PersonInterface `(133ms)`
    -   ✔ id: Id `(73ms)`
    -   ✔ name?: Name `(74ms)`
-   [abstract.spec.ts](./src/test/workspace/abstract.spec.ts)
    -   ✔ abstract class UserAbstract `(175ms)`
    -   ✔ constructor() `(44ms)`
    -   ✔ abstract getAge() `(125ms)`
    -   ✔ abstract setAge(age: Age) `(187ms)`
    -   ✔ get isOld() `(91ms)`
-   [class.spec.ts](./src/test/workspace/class.spec.ts)
    -   ✔ class User extends UserAbstract implements PersonInterface `(240ms)`
    -   ✔ public readonly id: Id `(141ms)`
    -   ✔ public name?: Name `(91ms)`
    -   ✔ protected \_age?: Age `(67ms)`
    -   ✔ constructor(id: Id, name?: Name) `(136ms)`
    -   ✔ set nickname(name: Name) `(105ms)`
    -   ✔ public getNickname: () `(143ms)`
    -   ✔ public setAge(age: Age) `(204ms)`
    -   ✔ public getAge() `(99ms)`
-   [variable.spec.ts](./src/test/workspace/variable.spec.ts)
    -   ✔ const MIN: 1111 `(160ms)`
    -   ✔ const MAX: 999 `(137ms)`
-   [function.spec.ts](./src/test/workspace/function.spec.ts)
    -   ✔ function createUserId(nonce: number = 0) `(224ms)`
    -   ✔ const perfix: number `(317ms)`
-   [index.spec.ts](./src/test/workspace/index.spec.ts)
    -   ✔ const userId: Id `(143ms)`
    -   ✔ const john: User `(217ms)`
    -   ✔ john.getAge() `(78ms)`

---

### Note

Description values are generated by [Mintlify](https://www.mintlify.com/) AI.
