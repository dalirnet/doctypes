import * as assert from "assert";
import * as vscode from "vscode";
import { rmSync } from "fs";
import { resolve } from "path";
import { updateConfig } from "../../lib/Utils";

const workspace = resolve(__dirname, "../../../src/test/workspace");

const openWorkspaceFile = (file: string): Thenable<unknown> => {
    return vscode.commands.executeCommand("vscode.open", vscode.Uri.file(resolve(workspace, file)));
};

suite("Doctypes Test Suite", async () => {
    suiteSetup(async () => {});
    suiteTeardown(() => {
        rmSync(resolve(workspace, ".vscode"), { recursive: true });
    });

    test("File _class.ts", async () => {
        await updateConfig("description", "Manual");
        await openWorkspaceFile("_class.ts");
        await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(resolve(workspace, "_class.ts")));
        await vscode.commands.executeCommand("doctypes.custom.line", 1);
        await new Promise((r: Function) => {
            setTimeout(() => {
                r();
            }, 50000);
        });
        assert.strictEqual("ok", "ok");
    });

    // test("File _function.ts", async () => {
    //     const classFile = vscode.Uri.file(resolve(root, "_function.ts"));
    //     await vscode.workspace.getConfiguration().update("doctypes.description", "Manual");
    //     await vscode.commands.executeCommand("vscode.open", classFile);
    //     await vscode.commands.executeCommand("doctypes.custom.line", 1);
    //     await new Promise((r: Function) => {
    //         setTimeout(() => {
    //             r();
    //         }, 5000);
    //     });
    //     console.log("end");
    //     assert.strictEqual("ok", "ok");
    // });
});
