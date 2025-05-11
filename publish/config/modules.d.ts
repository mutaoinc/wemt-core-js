import Request from "../modules/request";
import Hook from "../modules/hook";
import Storage from "../modules/storage";
import Language from "../modules/language";
import Crypto from "../modules/crypto";
import Event from "../modules/event";
declare const _default: {
    readonly language: {
        readonly type: "class";
        readonly class: typeof Language;
        readonly instance: "language";
        readonly require: readonly ["config"];
        readonly enable: true;
    };
    readonly hook: {
        readonly type: "class";
        readonly class: typeof Hook;
        readonly instance: "hook";
        readonly require: readonly ["config"];
        readonly enable: true;
    };
    readonly storage: {
        readonly type: "class";
        readonly class: typeof Storage;
        readonly instance: "storage";
        readonly require: readonly ["config", "hook"];
        readonly enable: false;
    };
    readonly request: {
        readonly type: "class";
        readonly class: typeof Request;
        readonly instance: "request";
        readonly require: readonly ["config", "language", "hook"];
        readonly enable: true;
    };
    readonly crypto: {
        readonly type: "class";
        readonly class: typeof Crypto;
        readonly instance: "crypto";
        readonly require: readonly ["config", "hook"];
        readonly enable: true;
    };
    readonly event: {
        readonly type: "class";
        readonly class: typeof Event;
        readonly instance: "event";
        readonly require: readonly ["config"];
        readonly enable: false;
    };
};
export default _default;
