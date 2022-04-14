import * as vscode from "vscode";
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { resolve } from "path";

export class Descriptor {
    public retry = 0;
    public maxRetry = 10;
    public retryDelay = 500;

    private readonly mintlify: AxiosInstance;
    private readonly context: string;
    private readonly code: string;

    constructor(context: string, code: string) {
        this.context = context;
        this.code = code;
        this.mintlify = axios.create({
            baseURL: "https://api.mintlify.com/docs/",
            headers: { referer: "https://www.docstring.ai/" },
        });
    }

    async write(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.mintlify
                .post("write/v3", {
                    userId: vscode.env.machineId,
                    code: this.code,
                    context: this.context,
                    languageId: "typescript",
                    docStyle: "JSDoc",
                    source: "vscode",
                    commented: false,
                })
                .then(({ data }) => {
                    this.worker(data.id, resolve, reject);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async worker(workerId: number, resolve: Function, reject: Function) {
        this.retry++;
        setTimeout(() => {
            this.mintlify
                .get(`worker/${workerId}`)
                .then(({ data }) => {
                    if (data.state === "completed") {
                        resolve(data);
                    } else if (this.retry < this.maxRetry) {
                        this.worker(workerId, resolve, reject);
                    } else {
                        reject();
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        }, this.retryDelay);
    }
}
