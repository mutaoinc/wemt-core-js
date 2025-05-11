declare class Modules {
    private config;
    instances: Record<string, any>;
    constructor(config: Record<string, any>);
    init(): Record<string, any>;
}
export default Modules;
