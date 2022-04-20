import * as vscode from "vscode";
import axios, { AxiosInstance, CancelTokenSource } from "axios";
import { DescriptorPayloadTypes } from "./Types";
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
     * A property that is used to cancel the mintlify request.
     *
     * @property
     * @name mintlifyCancellation
     * @kind property
     * @memberof Descriptor
     * @private
     * @readonly
     * @type {CancelTokenSource}
     */
    private readonly mintlifyCancellation: CancelTokenSource;

    /**
     * Descriptor cancellation status.
     *
     * @property
     * @name canceled
     * @kind property
     * @memberof Descriptor
     * @private
     * @type {boolean}
     */
    private canceled: boolean = false;

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
    public retry: { max: number; delay: number } = {
        max: 10,
        delay: 500,
    };

    constructor(private readonly context: string, private readonly code: string, private readonly languageId: string) {
        /**
         * Preparing axios cancellation.
         */
        this.mintlifyCancellation = axios.CancelToken.source();

        /**
         * Preparing axios instance.
         */
        this.mintlify = axios.create({
            cancelToken: this.mintlifyCancellation.token,
            baseURL: "https://api.mintlify.com/docs/",
            headers: {
                referer: "https://www.docstring.ai/",
            },
        });
    }

    /**
     * A getter.
     *
     * @method
     * @name (get) mintlifyPayload
     * @kind property
     * @memberof Descriptor
     * @returns {DescriptorPayloadTypes}
     */
    get mintlifyPayload(): DescriptorPayloadTypes {
        return {
            userId: getConfig("mintlifyUserId"),
            languageId: "auto",
            docStyle: "Auto-detect",
            context: this.context,
            code: this.code,
            commented: false,
            source: "web",
        };
    }

    /**
     * A method that is called when the user cancels the operation.
     *
     * @method
     * @name cancellation
     * @kind method
     * @memberof Descriptor
     * @private
     * @returns {void}
     */
    private cancellation(): void {
        this.canceled = true;
        this.mintlifyCancellation.cancel();
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
    async write(progressCancellation: vscode.CancellationToken): Promise<string | false> {
        /**
         * Listening for a cancellation event.
         */
        progressCancellation.onCancellationRequested(() => {
            this.cancellation();
        });

        /**
         * Listening for a cancellation event.
         *
         * @constant
         * @name changeActiveTextEditorListener
         * @kind variable
         * @memberof Descriptor.write
         * @type {vscode.Disposable}
         */
        const changeActiveTextEditorListener: vscode.Disposable = vscode.window.onDidChangeActiveTextEditor(() => {
            this.cancellation();
        });

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

                if (this.canceled || workerState !== true) {
                    break;
                }
            }

            if (workerState === true) {
                workerState = false;
            }

            /**
             * Disposing the event listener.
             */
            changeActiveTextEditorListener.dispose();

            return workerState;
        } catch (error) {
            if (!this.canceled) {
                errorHandler(error, "The Mintlify writer has an unknown error.");
            }

            /**
             * Disposing the event listener.
             */
            changeActiveTextEditorListener.dispose();

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
            if (!this.canceled) {
                errorHandler(error, "The Mintlify worker has an unknown error.");
            }

            return false;
        }
    }
}
