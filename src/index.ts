import config from "./config";
import Modules from "./modules";

const modules = new Modules(config);

export default {
    ...modules.instances
};
