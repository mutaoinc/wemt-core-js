# Event 事件模块

Event 模块提供了一个简单的事件发布订阅系统。

## 方法说明

### constructor(config: any)
- **参数**：
  - `config`: 配置对象

### on(event: string, callback: EventCallback): void
订阅事件
- **参数**：
  - `event`: 事件名称
  - `callback`: 回调函数

### off(event: string, callback?: EventCallback): void
取消订阅
- **参数**：
  - `event`: 事件名称
  - `callback`: 可选，特定的回调函数

### emit(event: string, ...args: any[]): Promise<void>
触发事件
- **参数**：
  - `event`: 事件名称
  - `args`: 传递给回调函数的参数

### once(event: string, callback: EventCallback): void
只订阅一次
- **参数**：
  - `event`: 事件名称
  - `callback`: 回调函数

### listenerCount(event: string): number
获取事件的所有订阅者数量
- **参数**：
  - `event`: 事件名称
- **返回**：number

### clear(): void
清除所有事件订阅

## 使用示例

### 1. 基础使用
```typescript
const event = new Event({});

// 订阅事件
event.on('userLogin', (user) => {
  console.log('User logged in:', user);
});

// 触发事件
await event.emit('userLogin', { id: 1, name: 'John' });
```

### 2. 多个订阅者
```typescript
const event = new Event({});

// 添加多个订阅者
event.on('message', (msg) => {
  console.log('Subscriber 1:', msg);
});

event.on('message', (msg) => {
  console.log('Subscriber 2:', msg);
});

// 触发事件，所有订阅者都会收到通知
await event.emit('message', 'Hello World');
```

### 3. 一次性订阅
```typescript
const event = new Event({});

// 只订阅一次
event.once('notification', (message) => {
  console.log('Received notification:', message);
});

// 第一次触发会执行
await event.emit('notification', 'First message');

// 第二次触发不会执行
await event.emit('notification', 'Second message');
```

### 4. 取消订阅
```typescript
const event = new Event({});

const handler = (data) => {
  console.log('Received:', data);
};

// 订阅事件
event.on('data', handler);

// 触发事件
await event.emit('data', 'Some data');

// 取消特定订阅
event.off('data', handler);

// 取消所有订阅
event.off('data');
```

### 5. 获取订阅者数量
```typescript
const event = new Event({});

event.on('event1', () => {});
event.on('event1', () => {});
event.on('event2', () => {});

console.log(event.listenerCount('event1')); // 输出: 2
console.log(event.listenerCount('event2')); // 输出: 1
```

### 6. 清除所有事件
```typescript
const event = new Event({});

event.on('event1', () => {});
event.on('event2', () => {});

// 清除所有事件订阅
event.clear();

console.log(event.listenerCount('event1')); // 输出: 0
console.log(event.listenerCount('event2')); // 输出: 0
``` 