declare const _default: {
    request: {
        baseURL: string;
        header: {
            "Content-Type": string;
            "X-Token": string;
            "X-Sign": string;
            "X-Time": number;
        };
        params: {};
        data: {};
        timeout: number;
    };
    response: {
        code: string;
        data: string;
        message: string;
        timestamp: string;
    };
};
export default _default;
