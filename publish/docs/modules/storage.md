# Storage 存储模块

Storage 模块用于处理本地存储。

## 方法说明

### constructor(config: any)
- **参数**：
  - `config`: 配置对象

### set(key: string, value: any): void
设置存储值
- **参数**：
  - `key`: 键名
  - `value`: 值

### get(key: string): any
获取存储值
- **参数**：
  - `key`: 键名
- **返回**：any

### remove(key: string): void
移除存储值
- **参数**：
  - `key`: 键名

### clear(): void
清除所有存储值

### has(key: string): boolean
检查键是否存在
- **参数**：
  - `key`: 键名
- **返回**：boolean

### keys(): string[]
获取所有键名
- **返回**：string[]

### values(): any[]
获取所有值
- **返回**：any[]

### entries(): [string, any][]
获取所有键值对
- **返回**：[string, any][]

### size(): number
获取存储数量
- **返回**：number

## 使用示例

### 1. 基础使用
```typescript
const storage = new Storage({
  prefix: 'app_',
  storage: 'localStorage'
});

// 存储数据
storage.set('user', {
  id: 1,
  name: 'John',
  email: 'john@example.com'
});

// 获取数据
const user = storage.get('user');
console.log(user); // 输出: { id: 1, name: 'John', email: 'john@example.com' }
```

### 2. 存储不同类型的数据
```typescript
const storage = new Storage({
  prefix: 'app_',
  storage: 'localStorage'
});

// 存储字符串
storage.set('name', 'John');

// 存储数字
storage.set('age', 25);

// 存储布尔值
storage.set('isActive', true);

// 存储数组
storage.set('tags', ['javascript', 'typescript', 'vue']);

// 存储对象
storage.set('settings', {
  theme: 'dark',
  language: 'zh-CN',
  notifications: true
});

// 获取数据
console.log(storage.get('name')); // 输出: John
console.log(storage.get('age')); // 输出: 25
console.log(storage.get('isActive')); // 输出: true
console.log(storage.get('tags')); // 输出: ['javascript', 'typescript', 'vue']
console.log(storage.get('settings')); // 输出: { theme: 'dark', language: 'zh-CN', notifications: true }
```

### 3. 检查和管理数据
```typescript
const storage = new Storage({
  prefix: 'app_',
  storage: 'localStorage'
});

// 存储数据
storage.set('user', { name: 'John' });
storage.set('settings', { theme: 'dark' });

// 检查键是否存在
console.log(storage.has('user')); // 输出: true
console.log(storage.has('nonExistent')); // 输出: false

// 获取所有键名
console.log(storage.keys()); // 输出: ['user', 'settings']

// 获取所有值
console.log(storage.values()); // 输出: [{ name: 'John' }, { theme: 'dark' }]

// 获取所有键值对
console.log(storage.entries()); // 输出: [['user', { name: 'John' }], ['settings', { theme: 'dark' }]]

// 获取存储数量
console.log(storage.size()); // 输出: 2
```

### 4. 移除数据
```typescript
const storage = new Storage({
  prefix: 'app_',
  storage: 'localStorage'
});

// 存储数据
storage.set('user', { name: 'John' });
storage.set('settings', { theme: 'dark' });

// 移除单个数据
storage.remove('user');

// 检查数据是否被移除
console.log(storage.has('user')); // 输出: false
console.log(storage.get('user')); // 输出: null

// 清除所有数据
storage.clear();

// 检查所有数据是否被清除
console.log(storage.size()); // 输出: 0
console.log(storage.keys()); // 输出: []
```

### 5. 使用会话存储
```typescript
const sessionStorage = new Storage({
  prefix: 'app_',
  storage: 'sessionStorage'
});

// 存储会话数据
sessionStorage.set('sessionId', 'abc123');
sessionStorage.set('tempData', { timestamp: Date.now() });

// 获取会话数据
console.log(sessionStorage.get('sessionId')); // 输出: abc123
```

### 6. 使用自定义前缀
```typescript
const userStorage = new Storage({
  prefix: 'user_',
  storage: 'localStorage'
});

// 存储用户数据
userStorage.set('profile', { name: 'John' });

// 存储应用数据
appStorage.set('settings', { theme: 'dark' });

// 获取数据
console.log(userStorage.get('profile')); // 输出: { name: 'John' }
console.log(appStorage.get('settings')); // 输出: { theme: 'dark' }

// 检查键是否存在
console.log(userStorage.has('settings')); // 输出: false
console.log(appStorage.has('profile')); // 输出: false
```

### 7. 存储过期时间
```typescript
const storage = new Storage({
  prefix: 'app_',
  storage: 'localStorage'
});

// 存储带过期时间的数据
storage.set('token', 'abc123', {
  expires: Date.now() + 3600000 // 1小时后过期
});

// 获取数据
console.log(storage.get('token')); // 输出: abc123

// 等待过期后
setTimeout(() => {
  console.log(storage.get('token')); // 输出: null
}, 3600000);
```

### 8. 存储加密数据
```typescript
const storage = new Storage({
  prefix: 'app_',
  storage: 'localStorage',
  encrypt: true,
  secret: 'your-secret-key'
});

// 存储加密数据
storage.set('sensitiveData', {
  password: 'secret123',
  creditCard: '1234-5678-9012-3456'
});

// 获取解密后的数据
console.log(storage.get('sensitiveData')); // 输出: { password: 'secret123', creditCard: '1234-5678-9012-3456' }
```