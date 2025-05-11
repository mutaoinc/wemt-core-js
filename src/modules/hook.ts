interface Config {
  hook: Record<string, any>;
}

// 定义钩子类型
type HookCallback<T = any> = (value: T, ...args: any[]) => T | Promise<T>;

// 合并所有钩子类型
interface HookTypes {
  [key: string]: HookCallback;
}

class Hook {
  private readonly hooks: Map<keyof HookTypes, Set<HookCallback>> = new Map();

  constructor(private config: Config) {}

  /**
   * 注册钩子函数
   * @param name 钩子名称
   * @param callback 回调函数
   * @param prepend 是否添加到回调队列开头
   * @throws {Error} 当回调函数不是函数类型时抛出错误
   */
  public register<T extends keyof HookTypes>(name: T, callback: HookTypes[T], prepend: boolean = false): void {
    if (typeof callback !== "function") {
      throw new Error(`Hook callback must be a function, got ${typeof callback}`);
    }

    if (!this.hooks.has(name)) {
      this.hooks.set(name, new Set());
    }

    const callbacks = this.hooks.get(name)!;
    callbacks.delete(callback); // 确保不会重复添加

    // 使用数组临时存储以支持 prepend 操作
    const callbackArray = Array.from(callbacks);
    if (prepend) {
      callbackArray.unshift(callback as HookCallback);
    } else {
      callbackArray.push(callback as HookCallback);
    }

    this.hooks.set(name, new Set(callbackArray));
  }

  /**
   * 执行钩子函数
   * @param name 钩子名称
   * @param args 传递给钩子函数的参数
   * @throws {Error} 当钩子执行出错时抛出错误
   */
  public async exec<T extends keyof HookTypes>(name: T, ...args: Parameters<HookTypes[T]>): Promise<ReturnType<HookTypes[T]>> {
    const callbacks = this.hooks.get(name);
    if (!callbacks?.size) {
      return args[0] as ReturnType<HookTypes[T]>;
    }

    let result = args[0];
    const remainingArgs = args.slice(1);

    try {
      for (const callback of callbacks) {
        const callbackResult = await Promise.resolve(callback(result, ...remainingArgs));
        result = callbackResult ?? result;
      }
      return result as ReturnType<HookTypes[T]>;
    } catch (error) {
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
  public remove(name: keyof HookTypes, callback?: HookCallback): boolean {
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
  public has(name: keyof HookTypes): boolean {
    return this.hooks.has(name) && this.hooks.get(name)!.size > 0;
  }

  /**
   * 获取某个钩子的所有回调函数
   * @param name 钩子名称
   */
  public get(name: keyof HookTypes): HookCallback[] {
    return Array.from(this.hooks.get(name) || []);
  }

  /**
   * 清空所有钩子
   */
  public clear(): void {
    this.hooks.clear();
  }

  /**
   * 获取所有已注册的钩子名称
   */
  public getHookNames(): string[] {
    return Array.from(this.hooks.keys()) as string[];
  }
}

export default Hook;
