# Hook 钩子模块

Hook 模块提供了一个灵活的钩子系统，用于在特定事件发生时执行自定义逻辑。

## 配置项

```typescript
interface Config {
  hook: Record<string, any>;
}
```

## 方法说明

### constructor(config: Config)
- **参数**：
  - `config`: 配置对象

### register<T>(name: T, callback: HookTypes[T], prepend?: boolean): void
注册钩子函数
- **参数**：
  - `name`: 钩子名称
  - `callback`: 回调函数
  - `prepend`: 是否添加到回调队列开头，默认：false

### exec<T>(name: T, ...args: Parameters<HookTypes[T]>): Promise<ReturnType<HookTypes[T]>>
执行钩子函数
- **参数**：
  - `name`: 钩子名称
  - `args`: 传递给钩子函数的参数
- **返回**：Promise<ReturnType<HookTypes[T]>>

### remove(name: keyof HookTypes, callback?: HookCallback): boolean
移除钩子函数
- **参数**：
  - `name`: 钩子名称
  - `callback`: 要移除的回调函数（可选）
- **返回**：boolean 是否成功移除

### has(name: keyof HookTypes): boolean
判断是否存在某个钩子
- **参数**：
  - `name`: 钩子名称
- **返回**：boolean

### get(name: keyof HookTypes): HookCallback[]
获取某个钩子的所有回调函数
- **参数**：
  - `name`: 钩子名称
- **返回**：HookCallback[]

### clear(): void
清空所有钩子

### getHookNames(): string[]
获取所有已注册的钩子名称
- **返回**：string[]

## 使用示例

### 1. 基础使用
```typescript
const hook = new Hook({});

// 注册钩子
hook.register('transform', (value: string) => value.toUpperCase());

// 执行钩子
const result = await hook.exec('transform', 'hello'); // 返回 'HELLO'
```

### 2. 多个钩子链式处理
```typescript
const hook = new Hook({});

// 注册多个处理函数
hook.register('process', (value: number) => value + 1);
hook.register('process', (value: number) => value * 2);
hook.register('process', (value: number) => value - 3);

// 执行将依次调用所有处理函数
const result = await hook.exec('process', 5); // ((5 + 1) * 2) - 3 = 9
```

### 3. 异步钩子处理
```typescript
const hook = new Hook({});

// 注册异步处理函数
hook.register('fetch', async (url: string) => {
  const response = await fetch(url);
  return response.json();
});

// 注册数据转换钩子
hook.register('fetch', async (data: any) => {
  return {
    ...data,
    timestamp: Date.now()
  };
});

// 执行异步钩子链
const data = await hook.exec('fetch', 'https://api.example.com/data');
```

### 4. 使用 prepend 选项
```typescript
const hook = new Hook({});

hook.register('format', (value: string) => value.toUpperCase());

// 在现有钩子之前添加新的处理函数
hook.register('format', (value: string) => `[${value}]`, true);

const result = await hook.exec('format', 'hello'); // 返回 '[HELLO]'
```

### 5. 错误处理
```typescript
const hook = new Hook({});

hook.register('validate', (value: number) => {
  if (value < 0) {
    throw new Error('Value must be positive');
  }
  return value;
});

try {
  await hook.exec('validate', -1);
} catch (error) {
  console.error(error); // Error: Hook 'validate' execution failed: Value must be positive
}
``` 