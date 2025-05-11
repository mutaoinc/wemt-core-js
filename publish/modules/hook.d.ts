interface Config {
    hook: Record<string, any>;
}
type HookCallback<T = any> = (value: T, ...args: any[]) => T | Promise<T>;
interface HookTypes {
    [key: string]: HookCallback;
}
declare class Hook {
    private config;
    private readonly hooks;
    constructor(config: Config);
    /**
     * 注册钩子函数
     * @param name 钩子名称
     * @param callback 回调函数
     * @param prepend 是否添加到回调队列开头
     * @throws {Error} 当回调函数不是函数类型时抛出错误
     */
    register<T extends keyof HookTypes>(name: T, callback: HookTypes[T], prepend?: boolean): void;
    /**
     * 执行钩子函数
     * @param name 钩子名称
     * @param args 传递给钩子函数的参数
     * @throws {Error} 当钩子执行出错时抛出错误
     */
    exec<T extends keyof HookTypes>(name: T, ...args: Parameters<HookTypes[T]>): Promise<ReturnType<HookTypes[T]>>;
    /**
     * 移除钩子函数
     * @param name 钩子名称
     * @param callback 要移除的回调函数（可选）
     * @returns {boolean} 是否成功移除
     */
    remove(name: keyof HookTypes, callback?: HookCallback): boolean;
    /**
     * 判断是否存在某个钩子
     * @param name 钩子名称
     */
    has(name: keyof HookTypes): boolean;
    /**
     * 获取某个钩子的所有回调函数
     * @param name 钩子名称
     */
    get(name: keyof HookTypes): HookCallback[];
    /**
     * 清空所有钩子
     */
    clear(): void;
    /**
     * 获取所有已注册的钩子名称
     */
    getHookNames(): string[];
}
export default Hook;
