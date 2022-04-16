import { resolve } from "path";
import { runTests } from "@vscode/test-electron";

runTests({
    extensionDevelopmentPath: resolve(__dirname, "../../"),
    extensionTestsPath: resolve(__dirname, "../../dist/test/suite"),
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
