import * as CryptoJS from "crypto-js";

interface Config {
  key?: string;
  iv?: string;
  algorithm?: string;
}

interface Hook {
  exec: (name: string, data: any, ...args: any[]) => Promise<any>;
}

class Crypto {
  private key: string;
  private iv: string;
  private algorithm: string;

  constructor(private config: Config, private hook: Hook) {
    this.key = config.key || "default-key";
    this.iv = config.iv || "default-iv";
    this.algorithm = config.algorithm || "AES";
  }

  /**
   * 加密数据
   * @param data 要加密的数据
   */
  public async encrypt(data: any): Promise<string> {
    try {
      // 通过hook处理数据
      const processedData = await this.hook.exec("crypto.encrypt.before", data);

      // 转换数据为字符串
      const stringData = typeof processedData === "string" ? processedData : JSON.stringify(processedData);

      // 使用 crypto-js 进行 AES 加密
      const key = CryptoJS.enc.Utf8.parse(this.key);
      const iv = CryptoJS.enc.Utf8.parse(this.iv);

      const encrypted = CryptoJS.AES.encrypt(stringData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return await this.hook.exec("crypto.encrypt.after", encrypted.toString());
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  /**
   * 解密数据
   * @param encryptedData 加密的数据
   */
  public async decrypt(encryptedData: string): Promise<any> {
    try {
      const processedData = await this.hook.exec("crypto.decrypt.before", encryptedData);

      // 使用 crypto-js 进行 AES 解密
      const key = CryptoJS.enc.Utf8.parse(this.key);
      const iv = CryptoJS.enc.Utf8.parse(this.iv);

      const decrypted = CryptoJS.AES.decrypt(processedData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);

      // 尝试解析 JSON
      let result;
      try {
        result = JSON.parse(decryptedStr);
      } catch {
        result = decryptedStr;
      }

      return await this.hook.exec("crypto.decrypt.after", result);
    } catch (error) {
      console.error("Decryption error:", error);
      throw error;
    }
  }

  /**
   * 生成哈希值
   * @param data 要哈希的数据
   * @param algorithm 哈希算法 (MD5, SHA1, SHA256, SHA512 等)
   */
  public async hash(data: string, algorithm: string = "SHA256"): Promise<string> {
    try {
      const processedData = await this.hook.exec("crypto.hash.before", data);

      let hashedData: string;

      switch (algorithm.toUpperCase()) {
        case "MD5":
          hashedData = CryptoJS.MD5(processedData).toString();
          break;
        case "SHA1":
          hashedData = CryptoJS.SHA1(processedData).toString();
          break;
        case "SHA256":
          hashedData = CryptoJS.SHA256(processedData).toString();
          break;
        case "SHA512":
          hashedData = CryptoJS.SHA512(processedData).toString();
          break;
        default:
          hashedData = CryptoJS.SHA256(processedData).toString();
      }

      return await this.hook.exec("crypto.hash.after", hashedData);
    } catch (error) {
      console.error("Hash error:", error);
      throw error;
    }
  }
}

export default Crypto;
