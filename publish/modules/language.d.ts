interface Config {
    original?: string;
    translated?: string;
    locales?: {
        [key: string]: {
            [key: string]: string;
        };
    };
}
declare class Language {
    private config;
    private original;
    private translated;
    private locales;
    constructor(config: Config);
    /**
     * 设置当前语言
     * @param locale 语言代码
     */
    setLocale(locale: string): void;
    /**
     * 获取当前语言
     */
    getLocale(): string;
    /**
     * 添加语言包
     * @param locale 语言代码
     * @param messages 语言包内容
     */
    add(locale: string, messages: {
        [key: string]: string;
    }): void;
    /**
     * 翻译文本
     * @param key 翻译键值
     * @param params 替换参数
     * @param locale 指定语言（可选）
     */
    translate(key: string, params?: {
        [key: string]: any;
    }, locale?: string): string;
    /**
     * 检查语言是否存在
     * @param locale 语言代码
     */
    hasLocale(locale: string): boolean;
    /**
     * 获取所有可用的语言
     */
    getAvailableLocales(): string[];
    /**
     * 获取指定语言的所有翻译
     * @param locale 语言代码
     */
    getMessages(locale: string): {
        [key: string]: string;
    };
    /**
     * 清除指定语言的翻译
     * @param locale 语言代码
     */
    clear(locale?: string): void;
    private getMessage;
    private interpolate;
}
export default Language;
