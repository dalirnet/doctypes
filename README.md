# DocTypes

JSDoc generator for JavaScript, TypeScript using AI.

### Test

```bash
# yarn compile
npm start compile

# yarn test
npm start test
```

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
