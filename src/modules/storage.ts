interface Hook {
  exec: (name: string, data: any, ...args: any[]) => Promise<any>;
}

interface Config {
  prefix?: string;
  expires?: number | null;
}

class Storage {
  private prefix: string;
  private expires: number | null;

  constructor(private config: Config, private hook: Hook) {
    this.prefix = config.prefix || "";
    this.expires = config.expires || null;
  }

  /**
   * 设置存储项
   * @param key 键名
   * @param value 值
   * @param expire 过期时间(秒)，不传则使用默认值
   */
  public async set(key: string, value: any, expire?: number): Promise<void> {
    const finalExpire = expire !== undefined ? expire : this.expires;
    let data = {
      value,
      time: Date.now(),
      expire: finalExpire ? Date.now() + finalExpire * 1000 : null,
    };
    try {
      data = await this.hook.exec("storage.set.before", data, { key, action: "set" });
      localStorage.setItem(this.getKey(key), JSON.stringify(data));
    } catch (e) {
      console.error("Storage set error:", e);
      throw e;
    }
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param defaultValue 默认值
   */
  public async get<T = any>(key: string, defaultValue?: T): Promise<T | null> {
    const item = localStorage.getItem(this.getKey(key));

    if (!item) return defaultValue || null;

    try {
      let data = JSON.parse(item);

      const { value, expire } = data;

      if (expire && expire < Date.now()) {
        this.remove(key);
        return defaultValue || null;
      }

      const result = await this.hook.exec("storage.get.after", value, { key, action: "get" });

      return result;
    } catch (e) {
      console.error("Storage get error:", e);
      return defaultValue || null;
    }
  }

  /**
   * 移除存储项
   * @param key 键名
   */
  public remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  /**
   * 清空所有存储项
   */
  public clear(): void {
    const keys = this.keys();
    keys.forEach((key) => {
      localStorage.removeItem(this.getKey(key));
    });
  }

  /**
   * 获取所有存储项的键名
   */
  public keys(): string[] {
    const keys: string[] = [];
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
  public has(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  /**
   * 获取存储项数量
   */
  public count(): number {
    return this.keys().length;
  }

  /**
   * 获取所有存储项
   */
  public async getAll(): Promise<{ [key: string]: any }> {
    const result: { [key: string]: any } = {};
    const keys = this.keys();

    await Promise.all(
      keys.map(async (key) => {
        result[key] = await this.get(key);
      })
    );

    return result;
  }

  /**
   * 获取完整的键名
   * @param key 键名
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

export default Storage;
