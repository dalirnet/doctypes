import axios, { AxiosInstance } from "axios";
import { errorHandler, getConfig, runtimeAwait } from "./Utils";

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
            userId: getConfig("mintlifyUserId"),
            languageId: this.languageId,
            context: this.context,
            code: this.code,
            source: "web",
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
        } catch (error) {
            errorHandler(error, "The Mintlify writer has an unknown error.");

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
        } catch (error) {
            errorHandler(error, "The Mintlify worker has an unknown error.");

            return false;
        }
    }
}
