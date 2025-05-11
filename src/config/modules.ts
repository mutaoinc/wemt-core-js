import Request from "../modules/request";
import Hook from "../modules/hook";
import Storage from "../modules/storage";
import Language from "../modules/language";
import Crypto from "../modules/crypto";
import Event from "../modules/event";

export default {
  language: {
    type: "class",
    class: Language,
    instance: "language",
    require: ["config"],
    enable: true,
  },
  hook: {
    type: "class",
    class: Hook,
    instance: "hook",
    require: ["config"],
    enable: true,
  },
  storage: {
    type: "class",
    class: Storage,
    instance: "storage",
    require: ["config", "hook"],
    enable: false,
  },
  request: {
    type: "class",
    class: Request,
    instance: "request",
    require: ["config", "language", "hook"],
    enable: true,
  },
  crypto: {
    type: "class",
    class: Crypto,
    instance: "crypto",
    require: ["config", "hook"],
    enable: true,
  },
  event: {
    type: "class",
    class: Event,
    instance: "event",
    require: ["config"],
    enable: false,
  },
} as const;
