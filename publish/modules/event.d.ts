type EventCallback = (...args: any[]) => void | Promise<void>;
declare class Event {
    private config;
    private events;
    constructor(config: any);
    /**
     * 订阅事件
     * @param event 事件名称
     * @param callback 回调函数
     */
    on(event: string, callback: EventCallback): void;
    /**
     * 取消订阅
     * @param event 事件名称
     * @param callback 可选,特定的回调函数。如果不传则取消该事件的所有订阅
     */
    off(event: string, callback?: EventCallback): void;
    /**
     * 触发事件
     * @param event 事件名称
     * @param args 传递给回调函数的参数
     */
    emit(event: string, ...args: any[]): Promise<void>;
    /**
     * 只订阅一次
     * @param event 事件名称
     * @param callback 回调函数
     */
    once(event: string, callback: EventCallback): void;
    /**
     * 获取事件的所有订阅者数量
     * @param event 事件名称
     */
    listenerCount(event: string): number;
    /**
     * 清除所有事件订阅
     */
    clear(): void;
}
export default Event;
