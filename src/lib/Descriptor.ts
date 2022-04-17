import axios, { AxiosInstance } from "axios";
import { ConfigValuesTypes } from "./Types";
import { errorHandler, getConfig, runtimeAwait } from "./Utils";

/**
 * Exporting the class Descriptor.
 *
 * @class
 * @name Descriptor
 * @kind class
 * @exports
 */
export class Descriptor {
    /**
     * Creating a new instance of Axios.
     *
     * @property
     * @name mintlify
     * @kind property
     * @memberof Descriptor
     * @private
     * @readonly
     * @type {AxiosInstance}
     */
    private readonly mintlify: AxiosInstance;

    /**
     * Defining a public property called `retry` and assigning it an object literal.
     *
     * @property
     * @name retry
     * @kind property
     * @memberof Descriptor
     * @public
     * @type {{ max: number; delay: number; }}
     */
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

    /**
     * A getter.
     *
     * @method
     * @name (get) mintlifyPayload
     * @kind property
     * @memberof Descriptor
     * @returns {{ userId: ConfigValuesTypes; languageId: string; context: string; code: string; source: string; docStyle: string; commented: boolean; }}
     */
    get mintlifyPayload(): {
        userId: ConfigValuesTypes;
        languageId: string;
        context: string;
        code: string;
        source: string;
        docStyle: string;
        commented: boolean;
    } {
        return {
            userId: getConfig("mintlifyUserId"),
            languageId: "auto",
            context: this.context,
            code: this.code,
            source: "web",
            docStyle: "Auto-detect",
            commented: false,
        };
    }

    /**
     * Call mintlify write method.
     *
     * @async
     * @method
     * @name write
     * @kind method
     * @memberof Descriptor
     * @returns {Promise<string | false>}
     */
    async write(): Promise<string | false> {
        try {
            /**
             * Destructuring the data property from the response object.
             *
             * @constant
             * @name data
             * @kind variable
             * @memberof Descriptor.write
             * @type {any}
             */
            const { data }: { data: any } = await this.mintlify.post("write/v3", this.mintlifyPayload);

            /**
             * Declaring a variable called `workerState` and assigning it a value of `false`.
             *
             * @let
             * @name workerState
             * @kind variable
             * @memberof Descriptor.write
             * @type {string | boolean}
             */
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

    /**
     * Call mintlify worker method.
     *
     * @async
     * @method
     * @name worker
     * @kind method
     * @memberof Descriptor
     * @param {number} workerId
     * @returns {Promise<string | boolean>}
     */
    async worker(workerId: number): Promise<string | boolean> {
        try {
            await runtimeAwait(this.retry.delay);
            /**
             * Destructuring the data property from the response object.
             *
             * @constant
             * @name data
             * @kind variable
             * @memberof Descriptor.worker
             * @type {any}
             */
            const { data }: { data: any } = await this.mintlify.get(`worker/${workerId}`);

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
