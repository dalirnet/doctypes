import * as Mocha from "mocha";
import { resolve } from "path";

export const run = (): Promise<any> => {
    const mocha = new Mocha({
        ui: "tdd",
        asyncOnly: true,
        timeout: 60000,
        color: true,
        reporter: "spec",
    });

    return new Promise((success: Function, fail: Function) => {
        mocha.addFile(resolve(__dirname, "../suite/extension.spec.js")).run((failures) => {
            if (!failures) {
                success();
            } else {
                fail();
            }
        });
    });
};
