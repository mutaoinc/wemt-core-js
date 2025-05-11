interface Config {
    key?: string;
    iv?: string;
    algorithm?: string;
}
interface Hook {
    exec: (name: string, data: any, ...args: any[]) => Promise<any>;
}
declare class Crypto {
    private config;
    private hook;
    private key;
    private iv;
    private algorithm;
    constructor(config: Config, hook: Hook);
    /**
     * 加密数据
     * @param data 要加密的数据
     */
    encrypt(data: any): Promise<string>;
    /**
     * 解密数据
     * @param encryptedData 加密的数据
     */
    decrypt(encryptedData: string): Promise<any>;
    /**
     * 生成哈希值
     * @param data 要哈希的数据
     * @param algorithm 哈希算法 (MD5, SHA1, SHA256, SHA512 等)
     */
    hash(data: string, algorithm?: string): Promise<string>;
}
export default Crypto;
