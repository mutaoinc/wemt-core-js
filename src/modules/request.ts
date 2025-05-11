import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface Config<T = any> {
  request: {
    baseURL: string;
    header: Record<string, any>;
    params: Record<string, any>;
    data: Record<string, any>;
    timeout?: number;
  };
  response: {
    code: string;
    data: string;
    message: string;
    timestamp?: string;
  };
}

// 添加 Hook 接口定义
interface Hook {
  exec: (name: string, data: any) => Promise<any>;
}

class Request {
  private instance: AxiosInstance;

  constructor(private config: Config, private language: Record<string, any>, private hook: Hook) {
    this.instance = axios.create(config.request);
    this.setupInterceptors();
  }

  // 初始化拦截器
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      async (config) => {
        try {
          config = await this.hook.exec("request.before", config);
          return config;
        } catch (error) {
          console.error("Request interceptor error:", error);
          return config;
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      async (response) => {
        try {
          response = await this.hook.exec("request.response", response);
        } catch (error) {
          console.error("Response hook error:", error);
        }

        const { code, data, message } = response.data;

        // 这里可以根据后端约定的状态码进行统一处理
        if (code === "0" || code === 0) {
          response.data = data;
          return response;
        } else {
          return Promise.reject(new Error(message || "request.error"));
        }
      },
      (error) => {
        // 处理网络错误
        const message = error.response?.data?.message || error.message;
        return Promise.reject(new Error(message));
      }
    );
  }

  private loading(show: boolean): void {}

  // 发送请求
  public async send(args: AxiosRequestConfig) {
    try {
      return await this.instance.request(args);
    } catch (error) {
      throw error;
    }
  }

  // GET 请求
  public async get(url: string, params?: any, config: AxiosRequestConfig = {}) {
    return this.send({
      method: "get",
      url,
      params,
      ...config,
    });
  }

  // POST 请求
  public async post(url: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.send({
      method: "post",
      url,
      data,
      ...config,
    });
  }
}

export default Request;