import * as path from "path";
import * as Mocha from "mocha";
import * as glob from "glob";

export const run = (): Promise<void> => {
    const mocha = new Mocha({ ui: "tdd", color: true });
    const testPath = path.resolve(__dirname, "..");

    return new Promise((resolve, reject) => {
        glob("**/**.test.js", { cwd: testPath }, (error, files) => {
            if (error) {
                reject(error);
            } else {
                files.forEach((file) => {
                    mocha.addFile(path.resolve(testPath, file));
                });

                try {
                    mocha.run((failures) => {
                        if (failures > 0) {
                            reject(new Error(`${failures} tests failed.`));
                        } else {
                            resolve();
                        }
                    });
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
};
