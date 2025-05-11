interface Config {
  original?: string;
  translated?: string;
  locales?: { [key: string]: { [key: string]: string } };
}

class Language {
  private original: string;
  private translated: string;
  private locales: { [key: string]: { [key: string]: string } };

  constructor(private config: Config) {
    this.original = config.original || "en";
    this.translated = config.translated || "en";
    this.locales = config.locales || {};
  }

  /**
   * 设置当前语言
   * @param locale 语言代码
   */
  public setLocale(locale: string): void {
    if (this.hasLocale(locale)) {
      this.original = locale;
    } else {
      console.warn(`Language '${locale}' not found, using fallback`);
      this.original = this.translated;
    }
  }

  /**
   * 获取当前语言
   */
  public getLocale(): string {
    return this.original;
  }

  /**
   * 添加语言包
   * @param locale 语言代码
   * @param messages 语言包内容
   */
  public add(locale: string, messages: { [key: string]: string }): void {
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
  public translate(key: string, params: { [key: string]: any } = {}, locale?: string): string {
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
  public hasLocale(locale: string): boolean {
    return !!this.locales[locale];
  }

  /**
   * 获取所有可用的语言
   */
  public getAvailableLocales(): string[] {
    return Object.keys(this.locales);
  }

  /**
   * 获取指定语言的所有翻译
   * @param locale 语言代码
   */
  public getMessages(locale: string): { [key: string]: string } {
    return this.locales[locale] || {};
  }

  /**
   * 清除指定语言的翻译
   * @param locale 语言代码
   */
  public clear(locale?: string): void {
    if (locale) {
      delete this.locales[locale];
    } else {
      this.locales = {};
    }
  }

  private getMessage(key: string, locale: string): string | undefined {
    return this.locales[locale]?.[key];
  }

  private interpolate(message: string, params: { [key: string]: any }): string {
    return message.replace(/\{(\w+)\}/g, (_, key) => {
      return params[key] !== undefined ? String(params[key]) : `{${key}}`;
    });
  }
}

export default Language;