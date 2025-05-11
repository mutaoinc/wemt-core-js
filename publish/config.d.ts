declare const _default: {
    modules: {
        readonly language: {
            readonly type: "class";
            readonly class: typeof import("./modules/language").default;
            readonly instance: "language";
            readonly require: readonly ["config"];
            readonly enable: true;
        };
        readonly hook: {
            readonly type: "class";
            readonly class: typeof import("./modules/hook").default;
            readonly instance: "hook";
            readonly require: readonly ["config"];
            readonly enable: true;
        };
        readonly storage: {
            readonly type: "class";
            readonly class: typeof import("./modules/storage").default;
            readonly instance: "storage";
            readonly require: readonly ["config", "hook"];
            readonly enable: false;
        };
        readonly request: {
            readonly type: "class";
            readonly class: typeof import("./modules/request").default;
            readonly instance: "request";
            readonly require: readonly ["config", "language", "hook"];
            readonly enable: true;
        };
        readonly crypto: {
            readonly type: "class";
            readonly class: typeof import("./modules/crypto").default;
            readonly instance: "crypto";
            readonly require: readonly ["config", "hook"];
            readonly enable: true;
        };
        readonly event: {
            readonly type: "class";
            readonly class: typeof import("./modules/event").default;
            readonly instance: "event";
            readonly require: readonly ["config"];
            readonly enable: false;
        };
    };
    request: {
        request: {
            baseURL: string;
            header: {
                "Content-Type": string;
                "X-Token": string;
                "X-Sign": string;
                "X-Time": number;
            };
            params: {};
            data: {};
            timeout: number;
        };
        response: {
            code: string;
            data: string;
            message: string;
            timestamp: string;
        };
    };
    hook: {};
    language: {
        original: string;
        translated: string;
        locales: {
            'zh-CN': {
                hello: string;
                welcome: string;
            };
            'en-US': {
                hello: string;
                welcome: string;
            };
        };
    };
    crypto: {
        key: string;
        iv: string;
        algorithm: string;
        saltLength: number;
        iterations: number;
    };
};
export default _default;
