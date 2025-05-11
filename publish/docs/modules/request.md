# Request 请求模块

Request 模块用于处理 HTTP 请求。

## 方法说明

### constructor(config: any)
- **参数**：
  - `config`: 配置对象

### request(options: RequestOptions): Promise<any>
发送请求
- **参数**：
  - `options`: 请求配置
- **返回**：Promise<any>

### get(url: string, params?: any, options?: RequestOptions): Promise<any>
发送 GET 请求
- **参数**：
  - `url`: 请求地址
  - `params`: 请求参数
  - `options`: 请求配置
- **返回**：Promise<any>

### post(url: string, data?: any, options?: RequestOptions): Promise<any>
发送 POST 请求
- **参数**：
  - `url`: 请求地址
  - `data`: 请求数据
  - `options`: 请求配置
- **返回**：Promise<any>

### put(url: string, data?: any, options?: RequestOptions): Promise<any>
发送 PUT 请求
- **参数**：
  - `url`: 请求地址
  - `data`: 请求数据
  - `options`: 请求配置
- **返回**：Promise<any>

### delete(url: string, data?: any, options?: RequestOptions): Promise<any>
发送 DELETE 请求
- **参数**：
  - `url`: 请求地址
  - `data`: 请求数据
  - `options`: 请求配置
- **返回**：Promise<any>

### setHeader(key: string, value: string): void
设置请求头
- **参数**：
  - `key`: 请求头键名
  - `value`: 请求头值

### setHeaders(headers: Record<string, string>): void
批量设置请求头
- **参数**：
  - `headers`: 请求头对象

### getHeader(key: string): string | undefined
获取请求头
- **参数**：
  - `key`: 请求头键名
- **返回**：string | undefined

### getHeaders(): Record<string, string>
获取所有请求头
- **返回**：Record<string, string>

### removeHeader(key: string): void
移除请求头
- **参数**：
  - `key`: 请求头键名

### clearHeaders(): void
清除所有请求头

## 使用示例

### 1. 基础 GET 请求
```typescript
const request = new Request({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// 发送 GET 请求
const response = await request.get('/users', {
  page: 1,
  limit: 10
});

console.log(response);
```

### 2. POST 请求带数据
```typescript
const request = new Request({
  baseURL: 'https://api.example.com'
});

// 发送 POST 请求
const response = await request.post('/users', {
  name: 'John',
  email: 'john@example.com'
});

console.log(response);
```

### 3. 带请求头的请求
```typescript
const request = new Request({
  baseURL: 'https://api.example.com'
});

// 设置单个请求头
request.setHeader('Authorization', 'Bearer token123');

// 批量设置请求头
request.setHeaders({
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
});

// 发送请求
const response = await request.get('/protected-resource');
console.log(response);
```

### 4. 带错误处理的请求
```typescript
const request = new Request({
  baseURL: 'https://api.example.com'
});

try {
  const response = await request.post('/login', {
    username: 'user',
    password: 'pass'
  });
  console.log('Login successful:', response);
} catch (error) {
  console.error('Login failed:', error);
}
```

### 5. 文件上传
```typescript
const request = new Request({
  baseURL: 'https://api.example.com'
});

// 创建 FormData 对象
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'My file');

// 发送文件上传请求
const response = await request.post('/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

console.log('Upload successful:', response);
```

### 6. 请求拦截和响应拦截
```typescript
const request = new Request({
  baseURL: 'https://api.example.com',
  interceptors: {
    request: (config) => {
      // 在发送请求之前做些什么
      console.log('Request interceptor:', config);
      return config;
    },
    response: (response) => {
      // 对响应数据做点什么
      console.log('Response interceptor:', response);
      return response;
    }
  }
});

// 发送请求
const response = await request.get('/data');
console.log(response);
```

### 7. 取消请求
```typescript
const request = new Request({
  baseURL: 'https://api.example.com'
});

// 创建取消令牌
const controller = new AbortController();

// 发送可取消的请求
const response = await request.get('/long-running-operation', null, {
  signal: controller.signal
});

// 取消请求
controller.abort();
```

### 8. 并发请求
```typescript
const request = new Request({
  baseURL: 'https://api.example.com'
});

// 发送多个并发请求
const [users, posts] = await Promise.all([
  request.get('/users'),
  request.get('/posts')
]);

console.log('Users:', users);
console.log('Posts:', posts);
``` 