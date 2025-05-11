import type { AxiosRequestConfig, AxiosResponse } from "axios";
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
interface Hook {
    exec: (name: string, data: any) => Promise<any>;
}
declare class Request {
    private config;
    private language;
    private hook;
    private instance;
    constructor(config: Config, language: Record<string, any>, hook: Hook);
    private setupInterceptors;
    private loading;
    send(args: AxiosRequestConfig): Promise<AxiosResponse<any, any>>;
    get(url: string, params?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any, any>>;
    post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<any, any>>;
}
export default Request;
