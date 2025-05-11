interface Hook {
    exec: (name: string, data: any, ...args: any[]) => Promise<any>;
}
interface Config {
    prefix?: string;
    expires?: number | null;
}
declare class Storage {
    private config;
    private hook;
    private prefix;
    private expires;
    constructor(config: Config, hook: Hook);
    /**
     * 设置存储项
     * @param key 键名
     * @param value 值
     * @param expire 过期时间(秒)，不传则使用默认值
     */
    set(key: string, value: any, expire?: number): Promise<void>;
    /**
     * 获取存储项
     * @param key 键名
     * @param defaultValue 默认值
     */
    get<T = any>(key: string, defaultValue?: T): Promise<T | null>;
    /**
     * 移除存储项
     * @param key 键名
     */
    remove(key: string): void;
    /**
     * 清空所有存储项
     */
    clear(): void;
    /**
     * 获取所有存储项的键名
     */
    keys(): string[];
    /**
     * 判断是否存在某个存储项
     * @param key 键名
     */
    has(key: string): boolean;
    /**
     * 获取存储项数量
     */
    count(): number;
    /**
     * 获取所有存储项
     */
    getAll(): Promise<{
        [key: string]: any;
    }>;
    /**
     * 获取完整的键名
     * @param key 键名
     */
    private getKey;
}
export default Storage;
