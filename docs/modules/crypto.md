# Crypto 加密模块

Crypto 模块提供了数据加密、解密和哈希功能，支持 AES 加密算法。

## 配置项

```typescript
interface Config {
  key?: string;      // 加密密钥，默认值：'default-key'
  iv?: string;       // 初始化向量，默认值：'default-iv'
  algorithm?: string; // 加密算法，默认值：'AES'
}
```

## 方法说明

### constructor(config: Config, hook: Hook)
- **参数**：
  - `config`: 配置对象
  - `hook`: 钩子实例，用于处理加密前后的数据

### encrypt(data: any): Promise<string>
加密数据
- **参数**：
  - `data`: 要加密的数据，可以是字符串或对象
- **返回**：Promise<string> 加密后的字符串

### decrypt(encryptedData: string): Promise<any>
解密数据
- **参数**：
  - `encryptedData`: 加密后的字符串
- **返回**：Promise<any> 解密后的数据

### hash(data: string, algorithm?: string): Promise<string>
生成哈希值
- **参数**：
  - `data`: 要哈希的数据
  - `algorithm`: 哈希算法，可选值：'MD5'|'SHA1'|'SHA256'|'SHA512'，默认：'SHA256'
- **返回**：Promise<string> 哈希后的字符串

## 使用示例

### 1. 基础使用
```typescript
const crypto = new Crypto({
  key: 'your-secret-key',
  iv: 'your-iv',
  algorithm: 'AES'
}, hook);

// 加密数据
const encrypted = await crypto.encrypt('sensitive data');

// 解密数据
const decrypted = await crypto.decrypt(encrypted);

// 生成哈希
const hashed = await crypto.hash('data to hash', 'SHA256');
```

### 2. 加密对象数据
```typescript
const data = {
  username: 'john_doe',
  password: 'secret123'
};

// 加密对象
const encrypted = await crypto.encrypt(data);

// 解密后得到原始对象
const decrypted = await crypto.decrypt(encrypted);
```

### 3. 使用不同的哈希算法
```typescript
// MD5 哈希
const md5Hash = await crypto.hash('data', 'MD5');

// SHA1 哈希
const sha1Hash = await crypto.hash('data', 'SHA1');

// SHA256 哈希（默认）
const sha256Hash = await crypto.hash('data');

// SHA512 哈希
const sha512Hash = await crypto.hash('data', 'SHA512');
``` 