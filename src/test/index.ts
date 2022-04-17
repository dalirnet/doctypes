import { resolve } from "path";
import { runTests } from "@vscode/test-electron";

/**
 * A function that runs the tests.
 *
 */
runTests({
    /**
     * The path to the extension.
     *
     * @property
     * @name extensionDevelopmentPath
     * @kind property
     * @type {string}
     */
    extensionDevelopmentPath: resolve(__dirname, "../../"),

    /**
     * The path to the test suite.
     *
     * @property
     * @name extensionTestsPath
     * @kind property
     * @type {string}
     */
    extensionTestsPath: resolve(__dirname, "../../dist/test/suite"),

    /**
     * The path to the workspace that will be used for the tests.
     *
     * @property
     * @name launchArgs
     * @kind property
     * @type {string[]}
     */
    launchArgs: [resolve(__dirname, "../../src/test/workspace")],
})
    .then(() => {
        console.info("Succeed to run tests");
        process.exit(0);
    })
    .catch(() => {
        console.error("Failed to run tests");
        process.exit(1);
    });
