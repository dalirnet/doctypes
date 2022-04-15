import * as vscode from "vscode";
import axios, { AxiosInstance } from "axios";
import { runtimeAwait } from "./utils";

export class Descriptor {
    private readonly mintlify: AxiosInstance;
    public retry = {
        max: 10,
        delay: 500,
    };

    constructor(private readonly context: string, private readonly code: string, private readonly languageId: string) {
        this.mintlify = axios.create({
            baseURL: "https://api.mintlify.com/docs/",
            headers: { referer: "https://www.docstring.ai/" },
        });
    }

    get mintlifyPayload() {
        return {
            userId: vscode.env.machineId,
            languageId: this.languageId,
            context: this.context,
            code: this.code,
            source: "vscode",
            docStyle: "JSDoc",
            commented: false,
        };
    }

    async write(): Promise<string | false> {
        try {
            const { data } = await this.mintlify.post("write/v3", this.mintlifyPayload);

            let workerState: string | boolean = false;
            for (let retry = 0; retry <= this.retry.max; retry++) {
                workerState = await this.worker(data?.id ?? 0);
                if (workerState !== true) {
                    break;
                }
            }
            if (workerState === true) {
                workerState = false;
            }

            return workerState;
        } catch ({ message }) {
            console.error(message);

            return false;
        }
    }

    async worker(workerId: number): Promise<string | boolean> {
        try {
            await runtimeAwait(this.retry.delay);
            const { data } = await this.mintlify.get(`worker/${workerId}`);
            if (data?.state === "completed") {
                return data?.data?.docstring ?? false;
            }

            return true;
        } catch ({ message }) {
            console.error(message);

            return false;
        }
    }
}
