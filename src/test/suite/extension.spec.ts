import * as assert from "assert";
import { executeCommand, runtimeAwait, updateConfig } from "../../lib/Utils";
import { openWorkspaceFile, readComments } from "./SpecUtils";

/**
 * Defining a constant variable called `specs` and assigning it an array of objects.
 *
 * @constant
 * @name specs
 * @kind variable
 * @type {{ file: string; targets: { code: string; start: number; end: number; }[]; }[]}
 */
const specs: { file: string; targets: { code: string; start: number; end: number }[] }[] = [
    {
        file: "type.spec.ts",
        targets: [
            {
                code: "type Id",
                start: 1,
                end: 9,
            },
            {
                code: "type Name",
                start: 11,
                end: 19,
            },
            {
                code: "type Age",
                start: 21,
                end: 29,
            },
        ],
    },
    {
        file: "interface.spec.ts",
        targets: [
            {
                code: "interface PersonInterface",
                start: 3,
                end: 11,
            },
            {
                code: "id: Id",
                start: 12,
                end: 21,
            },
            {
                code: "name?: Name",
                start: 23,
                end: 32,
            },
        ],
    },
    {
        file: "abstract.spec.ts",
        targets: [
            {
                code: "abstract class UserAbstract",
                start: 3,
                end: 12,
            },
            {
                code: "constructor()",
                start: 13,
                end: 19,
            },
            {
                code: "abstract getAge()",
                start: 21,
                end: 31,
            },
            {
                code: "abstract setAge(age: Age)",
                start: 33,
                end: 44,
            },
            {
                code: "get isOld()",
                start: 46,
                end: 55,
            },
        ],
    },
    {
        file: "class.spec.ts",
        targets: [
            {
                code: "class User extends UserAbstract implements PersonInterface",
                start: 5,
                end: 15,
            },
            {
                code: "public readonly id: Id",
                start: 16,
                end: 27,
            },
            {
                code: "public name?: Name",
                start: 29,
                end: 39,
            },
            {
                code: "protected _age?: Age",
                start: 41,
                end: 51,
            },
            {
                code: "constructor(id: Id, name?: Name)",
                start: 53,
                end: 61,
            },
            {
                code: "set nickname(name: Name)",
                start: 71,
                end: 79,
            },
            {
                code: "public getNickname: ()",
                start: 83,
                end: 93,
            },
            {
                code: "public setAge(age: Age)",
                start: 97,
                end: 108,
            },
            {
                code: "public getAge()",
                start: 114,
                end: 124,
            },
        ],
    },
    {
        file: "variable.spec.ts",
        targets: [
            {
                code: "const MIN: 1111",
                start: 1,
                end: 10,
            },
            {
                code: "const MAX: 999",
                start: 12,
                end: 21,
            },
        ],
    },
    {
        file: "function.spec.ts",
        targets: [
            {
                code: "function createUserId(nonce: number = 0)",
                start: 4,
                end: 14,
            },
            {
                code: "const perfix: number",
                start: 15,
                end: 24,
            },
        ],
    },
    {
        file: "index.spec.ts",
        targets: [
            {
                code: "const userId: Id",
                start: 5,
                end: 13,
            },
            {
                code: "const john: User",
                start: 15,
                end: 24,
            },
            {
                code: "john.getAge()",
                start: 26,
                end: 33,
            },
        ],
    },
];

for (const { file, targets } of specs) {
    /**
     * A Mocha function that creates a suite of tests.
     *
     * @async
     * @var
     * @name suite
     * @type {Mocha.SuiteFunction (title: string, fn: (this: Mocha.Suite) => void) => Mocha.Suite (+1 overload)}
     */
    suite(file, async () => {
        /**
         * A Mocha function that creates a suite of tests.
         *
         * @var
         * @name suiteSetup
         * @type {Mocha.HookFunction (fn: Mocha.Func) => void (+3 overloads)}
         */
        suiteSetup(async () => {
            /**
             * Opening the file in the workspace.
             *
             */
            await openWorkspaceFile(file);

            /**
             * Updating the configuration of the extension.
             *
             */
            await updateConfig("description", "Manual");

            /**
             * Waiting for the extension to finish its work.
             *
             */
            await runtimeAwait(1000);
        });

        for (const { code, start, end } of targets) {
            /**
             * A Mocha function that creates a test case.
             *
             * @async
             * @var
             * @name test
             * @type {Mocha.TestFunction (title: string, fn?: Mocha.Func) => Mocha.Test (+3 overloads)}
             */
            test(code, async () => {
                /**
                 * Reading the comments from the file.
                 *
                 * @constant
                 * @name comments
                 * @kind variable
                 * @memberof suite() callback.test() callback
                 * @type {string[]}
                 */
                const comments: string[] = readComments(start, end);

                /**
                 * Executing the `doctypes.custom.line` command and passing the `end` variable as the second argument.
                 *
                 * @constant
                 * @name documents
                 * @kind variable
                 * @memberof suite() callback.test() callback
                 * @type {string[]}
                 */
                const documents: string[] = (await executeCommand("doctypes.custom.line", end, false)) as string[];

                /**
                 * Comparing the `comments` and `documents` variables.
                 *
                 * @function
                 * @name assert
                 */
                assert.deepStrictEqual(comments, documents);
            });
        }
    });
}
