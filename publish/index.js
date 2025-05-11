'use strict';

var axios = require('axios');
var CryptoJS = require('crypto-js');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var CryptoJS__namespace = /*#__PURE__*/_interopNamespaceDefault(CryptoJS);

class Request {
    constructor(config, language, hook) {
        this.config = config;
        this.language = language;
        this.hook = hook;
        this.instance = axios.create(config.request);
        this.setupInterceptors();
    }
    // 初始化拦截器
    setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(async (config) => {
            try {
                config = await this.hook.exec("request.before", config);
                return config;
            }
            catch (error) {
                console.error("Request interceptor error:", error);
                return config;
            }
        }, (error) => {
            return Promise.reject(error);
        });
        // 响应拦截器
        this.instance.interceptors.response.use(async (response) => {
            try {
                response = await this.hook.exec("request.response", response);
            }
            catch (error) {
                console.error("Response hook error:", error);
            }
            const { code, data, message } = response.data;
            // 这里可以根据后端约定的状态码进行统一处理
            if (code === "0" || code === 0) {
                response.data = data;
                return response;
            }
            else {
                return Promise.reject(new Error(message || "request.error"));
            }
        }, (error) => {
            var _a, _b;
            // 处理网络错误
            const message = ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || error.message;
            return Promise.reject(new Error(message));
        });
    }
    loading(show) { }
    // 发送请求
    async send(args) {
        try {
            return await this.instance.request(args);
        }
        catch (error) {
            throw error;
        }
    }
    // GET 请求
    async get(url, params, config = {}) {
        return this.send({
            method: "get",
            url,
            params,
            ...config,
        });
    }
    // POST 请求
    async post(url, data, config = {}) {
        return this.send({
            method: "post",
            url,
            data,
            ...config,
        });
    }
}

class Hook {
    constructor(config) {
        this.config = config;
        this.hooks = new Map();
    }
    /**
     * 注册钩子函数
     * @param name 钩子名称
     * @param callback 回调函数
     * @param prepend 是否添加到回调队列开头
     * @throws {Error} 当回调函数不是函数类型时抛出错误
     */
    register(name, callback, prepend = false) {
        if (typeof callback !== "function") {
            throw new Error(`Hook callback must be a function, got ${typeof callback}`);
        }
        if (!this.hooks.has(name)) {
            this.hooks.set(name, new Set());
        }
        const callbacks = this.hooks.get(name);
        callbacks.delete(callback); // 确保不会重复添加
        // 使用数组临时存储以支持 prepend 操作
        const callbackArray = Array.from(callbacks);
        if (prepend) {
            callbackArray.unshift(callback);
        }
        else {
            callbackArray.push(callback);
        }
        this.hooks.set(name, new Set(callbackArray));
    }
    /**
     * 执行钩子函数
     * @param name 钩子名称
     * @param args 传递给钩子函数的参数
     * @throws {Error} 当钩子执行出错时抛出错误
     */
    async exec(name, ...args) {
        const callbacks = this.hooks.get(name);
        if (!(callbacks === null || callbacks === void 0 ? void 0 : callbacks.size)) {
            return args[0];
        }
        let result = args[0];
        const remainingArgs = args.slice(1);
        try {
            for (const callback of callbacks) {
                const callbackResult = await Promise.resolve(callback(result, ...remainingArgs));
                result = callbackResult !== null && callbackResult !== void 0 ? callbackResult : result;
            }
            return result;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Hook '${String(name)}' execution failed: ${errorMessage}`);
        }
    }
    /**
     * 移除钩子函数
     * @param name 钩子名称
     * @param callback 要移除的回调函数（可选）
     * @returns {boolean} 是否成功移除
     */
    remove(name, callback) {
        if (!callback) {
            return this.hooks.delete(name);
        }
        const callbacks = this.hooks.get(name);
        if (!callbacks) {
            return false;
        }
        return callbacks.delete(callback);
    }
    /**
     * 判断是否存在某个钩子
     * @param name 钩子名称
     */
    has(name) {
        return this.hooks.has(name) && this.hooks.get(name).size > 0;
    }
    /**
     * 获取某个钩子的所有回调函数
     * @param name 钩子名称
     */
    get(name) {
        return Array.from(this.hooks.get(name) || []);
    }
    /**
     * 清空所有钩子
     */
    clear() {
        this.hooks.clear();
    }
    /**
     * 获取所有已注册的钩子名称
     */
    getHookNames() {
        return Array.from(this.hooks.keys());
    }
}

class Storage {
    constructor(config, hook) {
        this.config = config;
        this.hook = hook;
        this.prefix = config.prefix || "";
        this.expires = config.expires || null;
    }
    /**
     * 设置存储项
     * @param key 键名
     * @param value 值
     * @param expire 过期时间(秒)，不传则使用默认值
     */
    async set(key, value, expire) {
        const finalExpire = expire !== undefined ? expire : this.expires;
        let data = {
            value,
            time: Date.now(),
            expire: finalExpire ? Date.now() + finalExpire * 1000 : null,
        };
        try {
            data = await this.hook.exec("storage.set.before", data, { key, action: "set" });
            localStorage.setItem(this.getKey(key), JSON.stringify(data));
        }
        catch (e) {
            console.error("Storage set error:", e);
            throw e;
        }
    }
    /**
     * 获取存储项
     * @param key 键名
     * @param defaultValue 默认值
     */
    async get(key, defaultValue) {
        const item = localStorage.getItem(this.getKey(key));
        if (!item)
            return defaultValue || null;
        try {
            let data = JSON.parse(item);
            const { value, expire } = data;
            if (expire && expire < Date.now()) {
                this.remove(key);
                return defaultValue || null;
            }
            const result = await this.hook.exec("storage.get.after", value, { key, action: "get" });
            return result;
        }
        catch (e) {
            console.error("Storage get error:", e);
            return defaultValue || null;
        }
    }
    /**
     * 移除存储项
     * @param key 键名
     */
    remove(key) {
        localStorage.removeItem(this.getKey(key));
    }
    /**
     * 清空所有存储项
     */
    clear() {
        const keys = this.keys();
        keys.forEach((key) => {
            localStorage.removeItem(this.getKey(key));
        });
    }
    /**
     * 获取所有存储项的键名
     */
    keys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keys.push(key.slice(this.prefix.length));
            }
        }
        return keys;
    }
    /**
     * 判断是否存在某个存储项
     * @param key 键名
     */
    has(key) {
        return localStorage.getItem(this.getKey(key)) !== null;
    }
    /**
     * 获取存储项数量
     */
    count() {
        return this.keys().length;
    }
    /**
     * 获取所有存储项
     */
    async getAll() {
        const result = {};
        const keys = this.keys();
        await Promise.all(keys.map(async (key) => {
            result[key] = await this.get(key);
        }));
        return result;
    }
    /**
     * 获取完整的键名
     * @param key 键名
     */
    getKey(key) {
        return `${this.prefix}${key}`;
    }
}

class Language {
    constructor(config) {
        this.config = config;
        this.original = config.original || "en";
        this.translated = config.translated || "en";
        this.locales = config.locales || {};
    }
    /**
     * 设置当前语言
     * @param locale 语言代码
     */
    setLocale(locale) {
        if (this.hasLocale(locale)) {
            this.original = locale;
        }
        else {
            console.warn(`Language '${locale}' not found, using fallback`);
            this.original = this.translated;
        }
    }
    /**
     * 获取当前语言
     */
    getLocale() {
        return this.original;
    }
    /**
     * 添加语言包
     * @param locale 语言代码
     * @param messages 语言包内容
     */
    add(locale, messages) {
        if (!this.locales[locale]) {
            this.locales[locale] = {};
        }
        this.locales[locale] = { ...this.locales[locale], ...messages };
    }
    /**
     * 翻译文本
     * @param key 翻译键值
     * @param params 替换参数
     * @param locale 指定语言（可选）
     */
    translate(key, params = {}, locale) {
        const targetLocale = locale || this.original;
        let message = this.getMessage(key, targetLocale);
        if (!message && targetLocale !== this.translated) {
            message = this.getMessage(key, this.translated);
        }
        if (!message) {
            console.warn(`Translation key '${key}' not found`);
            return key;
        }
        return this.interpolate(message, params);
    }
    /**
     * 检查语言是否存在
     * @param locale 语言代码
     */
    hasLocale(locale) {
        return !!this.locales[locale];
    }
    /**
     * 获取所有可用的语言
     */
    getAvailableLocales() {
        return Object.keys(this.locales);
    }
    /**
     * 获取指定语言的所有翻译
     * @param locale 语言代码
     */
    getMessages(locale) {
        return this.locales[locale] || {};
    }
    /**
     * 清除指定语言的翻译
     * @param locale 语言代码
     */
    clear(locale) {
        if (locale) {
            delete this.locales[locale];
        }
        else {
            this.locales = {};
        }
    }
    getMessage(key, locale) {
        var _a;
        return (_a = this.locales[locale]) === null || _a === void 0 ? void 0 : _a[key];
    }
    interpolate(message, params) {
        return message.replace(/\{(\w+)\}/g, (_, key) => {
            return params[key] !== undefined ? String(params[key]) : `{${key}}`;
        });
    }
}

class Crypto {
    constructor(config, hook) {
        this.config = config;
        this.hook = hook;
        this.key = config.key || "default-key";
        this.iv = config.iv || "default-iv";
        this.algorithm = config.algorithm || "AES";
    }
    /**
     * 加密数据
     * @param data 要加密的数据
     */
    async encrypt(data) {
        try {
            // 通过hook处理数据
            const processedData = await this.hook.exec("crypto.encrypt.before", data);
            // 转换数据为字符串
            const stringData = typeof processedData === "string" ? processedData : JSON.stringify(processedData);
            // 使用 crypto-js 进行 AES 加密
            const key = CryptoJS__namespace.enc.Utf8.parse(this.key);
            const iv = CryptoJS__namespace.enc.Utf8.parse(this.iv);
            const encrypted = CryptoJS__namespace.AES.encrypt(stringData, key, {
                iv: iv,
                mode: CryptoJS__namespace.mode.CBC,
                padding: CryptoJS__namespace.pad.Pkcs7,
            });
            return await this.hook.exec("crypto.encrypt.after", encrypted.toString());
        }
        catch (error) {
            console.error("Encryption error:", error);
            throw error;
        }
    }
    /**
     * 解密数据
     * @param encryptedData 加密的数据
     */
    async decrypt(encryptedData) {
        try {
            const processedData = await this.hook.exec("crypto.decrypt.before", encryptedData);
            // 使用 crypto-js 进行 AES 解密
            const key = CryptoJS__namespace.enc.Utf8.parse(this.key);
            const iv = CryptoJS__namespace.enc.Utf8.parse(this.iv);
            const decrypted = CryptoJS__namespace.AES.decrypt(processedData, key, {
                iv: iv,
                mode: CryptoJS__namespace.mode.CBC,
                padding: CryptoJS__namespace.pad.Pkcs7,
            });
            const decryptedStr = decrypted.toString(CryptoJS__namespace.enc.Utf8);
            // 尝试解析 JSON
            let result;
            try {
                result = JSON.parse(decryptedStr);
            }
            catch (_a) {
                result = decryptedStr;
            }
            return await this.hook.exec("crypto.decrypt.after", result);
        }
        catch (error) {
            console.error("Decryption error:", error);
            throw error;
        }
    }
    /**
     * 生成哈希值
     * @param data 要哈希的数据
     * @param algorithm 哈希算法 (MD5, SHA1, SHA256, SHA512 等)
     */
    async hash(data, algorithm = "SHA256") {
        try {
            const processedData = await this.hook.exec("crypto.hash.before", data);
            let hashedData;
            switch (algorithm.toUpperCase()) {
                case "MD5":
                    hashedData = CryptoJS__namespace.MD5(processedData).toString();
                    break;
                case "SHA1":
                    hashedData = CryptoJS__namespace.SHA1(processedData).toString();
                    break;
                case "SHA256":
                    hashedData = CryptoJS__namespace.SHA256(processedData).toString();
                    break;
                case "SHA512":
                    hashedData = CryptoJS__namespace.SHA512(processedData).toString();
                    break;
                default:
                    hashedData = CryptoJS__namespace.SHA256(processedData).toString();
            }
            return await this.hook.exec("crypto.hash.after", hashedData);
        }
        catch (error) {
            console.error("Hash error:", error);
            throw error;
        }
    }
}

class Event {
    constructor(config) {
        this.config = config;
        this.events = new Map();
    }
    /**
     * 订阅事件
     * @param event 事件名称
     * @param callback 回调函数
     */
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(callback);
    }
    /**
     * 取消订阅
     * @param event 事件名称
     * @param callback 可选,特定的回调函数。如果不传则取消该事件的所有订阅
     */
    off(event, callback) {
        var _a;
        if (!callback) {
            this.events.delete(event);
            return;
        }
        (_a = this.events.get(event)) === null || _a === void 0 ? void 0 : _a.delete(callback);
    }
    /**
     * 触发事件
     * @param event 事件名称
     * @param args 传递给回调函数的参数
     */
    async emit(event, ...args) {
        const callbacks = this.events.get(event);
        if (!callbacks)
            return;
        const promises = Array.from(callbacks).map(callback => callback(...args));
        await Promise.all(promises);
    }
    /**
     * 只订阅一次
     * @param event 事件名称
     * @param callback 回调函数
     */
    once(event, callback) {
        const wrapper = async (...args) => {
            await callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
    /**
     * 获取事件的所有订阅者数量
     * @param event 事件名称
     */
    listenerCount(event) {
        var _a;
        return ((_a = this.events.get(event)) === null || _a === void 0 ? void 0 : _a.size) || 0;
    }
    /**
     * 清除所有事件订阅
     */
    clear() {
        this.events.clear();
    }
}

var modules$1 = {
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
};

var request = {
    request: {
        baseURL: "https://d2lra2xr.s13.mutaoinc.net",
        header: {
            "Content-Type": "application/json",
            "X-Token": "",
            "X-Sign": "",
            "X-Time": Date.now(),
        },
        params: {},
        data: {},
        timeout: 10000,
    },
    response: {
        code: "code",
        data: "data",
        message: "message",
        timestamp: "timestamp",
    },
};

var hook = {};

var zhCN = {
    hello: '你好',
    welcome: '欢迎，{name}！'
};

var enUS = {
    hello: "Hello",
    welcome: "Welcome, {name}!",
};

var locales = {
    'zh-CN': zhCN,
    'en-US': enUS
};

var language = {
    original: "zh-CN",
    translated: "en-US",
    locales,
};

var crypto = {
    key: 'wemt-secure-key-2024',
    iv: 'wemt-secure-iv-24',
    algorithm: 'AES',
    saltLength: 16,
    iterations: 10000
};

var config = {
    modules: modules$1,
    request,
    hook,
    language,
    crypto,
};

class Modules {
    constructor(config) {
        this.config = config;
        this.instances = {};
        this.init();
    }
    init() {
        const initModule = (moduleName) => {
            if (this.instances[moduleName]) {
                return this.instances[moduleName];
            }
            const moduleConfig = this.config.modules[moduleName];
            if (moduleConfig.enable == false) {
                return null;
            }
            const dependencies = (moduleConfig.require || []).map((dep) => {
                if (dep == "config") {
                    return this.config[moduleName];
                }
                if (!this.instances[dep]) {
                    throw new Error(`依赖模块 "${dep}" 未找到，模块 "${moduleName}" 初始化失败`);
                }
                return initModule(dep);
            });
            if (moduleConfig.type === "class") {
                this.instances[moduleName] = new moduleConfig.class(...dependencies);
            }
            return this.instances[moduleName];
        };
        Object.keys(this.config.modules).forEach(initModule);
        return this.instances;
    }
}

const modules = new Modules(config);
var index = {
    ...modules.instances
};

module.exports = index;
