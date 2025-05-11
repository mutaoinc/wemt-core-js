class Modules {
  public instances: Record<string, any> = {};

  constructor(private config: Record<string, any>) {
    this.init();
  }

  init() {
    const initModule = (moduleName: string) => {
      if (this.instances[moduleName]) {
        return this.instances[moduleName];
      }

      const moduleConfig = this.config.modules[moduleName];

      if (moduleConfig.enable == false) {
        return null;
      }

      const dependencies = (moduleConfig.require || []).map((dep: string) => {
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

export default Modules;
