# Language 语言模块

Language 模块用于处理多语言支持。

## 方法说明

### constructor(config: any)
- **参数**：
  - `config`: 配置对象

### setLanguage(lang: string): void
设置当前语言
- **参数**：
  - `lang`: 语言代码

### getLanguage(): string
获取当前语言
- **返回**：string

### getLanguages(): string[]
获取所有支持的语言
- **返回**：string[]

### getMessage(key: string, params?: Record<string, any>): string
获取翻译消息
- **参数**：
  - `key`: 消息键名
  - `params`: 可选，替换参数
- **返回**：string

### addLanguage(lang: string, messages: Record<string, any>): void
添加语言包
- **参数**：
  - `lang`: 语言代码
  - `messages`: 语言包内容

### removeLanguage(lang: string): void
移除语言包
- **参数**：
  - `lang`: 语言代码

## 使用示例

### 1. 基础使用
```typescript
const language = new Language({
  defaultLanguage: 'zh-CN',
  messages: {
    'zh-CN': {
      welcome: '欢迎',
      hello: '你好，{name}'
    },
    'en-US': {
      welcome: 'Welcome',
      hello: 'Hello, {name}'
    }
  }
});

// 获取消息
console.log(language.getMessage('welcome')); // 输出: 欢迎
console.log(language.getMessage('hello', { name: 'John' })); // 输出: 你好，John
```

### 2. 切换语言
```typescript
const language = new Language({
  defaultLanguage: 'zh-CN',
  messages: {
    'zh-CN': {
      welcome: '欢迎',
      hello: '你好，{name}'
    },
    'en-US': {
      welcome: 'Welcome',
      hello: 'Hello, {name}'
    }
  }
});

// 切换到英文
language.setLanguage('en-US');

console.log(language.getMessage('welcome')); // 输出: Welcome
console.log(language.getMessage('hello', { name: 'John' })); // 输出: Hello, John
```

### 3. 添加新语言
```typescript
const language = new Language({
  defaultLanguage: 'zh-CN',
  messages: {
    'zh-CN': {
      welcome: '欢迎'
    }
  }
});

// 添加日语支持
language.addLanguage('ja-JP', {
  welcome: 'ようこそ'
});

// 切换到日语
language.setLanguage('ja-JP');
console.log(language.getMessage('welcome')); // 输出: ようこそ
```

### 4. 获取支持的语言列表
```typescript
const language = new Language({
  defaultLanguage: 'zh-CN',
  messages: {
    'zh-CN': { welcome: '欢迎' },
    'en-US': { welcome: 'Welcome' },
    'ja-JP': { welcome: 'ようこそ' }
  }
});

console.log(language.getLanguages()); // 输出: ['zh-CN', 'en-US', 'ja-JP']
```

### 5. 移除语言
```typescript
const language = new Language({
  defaultLanguage: 'zh-CN',
  messages: {
    'zh-CN': { welcome: '欢迎' },
    'en-US': { welcome: 'Welcome' }
  }
});

// 移除英文支持
language.removeLanguage('en-US');

console.log(language.getLanguages()); // 输出: ['zh-CN']
```

### 6. 复杂参数替换
```typescript
const language = new Language({
  defaultLanguage: 'zh-CN',
  messages: {
    'zh-CN': {
      greeting: '你好，{name}！今天是{date}，星期{day}。',
      notification: '{count} 条新消息来自 {sender}'
    }
  }
});

console.log(language.getMessage('greeting', {
  name: '张三',
  date: '2024-03-20',
  day: '三'
})); // 输出: 你好，张三！今天是2024-03-20，星期三。

console.log(language.getMessage('notification', {
  count: 5,
  sender: '系统'
})); // 输出: 5 条新消息来自 系统
``` 