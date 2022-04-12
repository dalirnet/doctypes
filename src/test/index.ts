import * as path from "path";
import { runTests } from "@vscode/test-electron";

(async () => {
    try {
        await runTests({
            extensionDevelopmentPath: path.resolve(__dirname, "../../"),
            extensionTestsPath: path.resolve(__dirname, "./suite/index"),
        });
    } catch (error) {
        console.error("Failed to run tests", error);
        process.exit(1);
    }
})();
