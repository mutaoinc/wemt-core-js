type EventCallback = (...args: any[]) => void | Promise<void>;

class Event {
  private events: Map<string, Set<EventCallback>> = new Map();

  constructor(private config: any) {}

  /**
   * 订阅事件
   * @param event 事件名称
   * @param callback 回调函数
   */
  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  /**
   * 取消订阅
   * @param event 事件名称
   * @param callback 可选,特定的回调函数。如果不传则取消该事件的所有订阅
   */
  off(event: string, callback?: EventCallback): void {
    if (!callback) {
      this.events.delete(event);
      return;
    }
    this.events.get(event)?.delete(callback);
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 传递给回调函数的参数
   */
  async emit(event: string, ...args: any[]): Promise<void> {
    const callbacks = this.events.get(event);
    if (!callbacks) return;

    const promises = Array.from(callbacks).map(callback => callback(...args));
    await Promise.all(promises);
  }

  /**
   * 只订阅一次
   * @param event 事件名称
   * @param callback 回调函数
   */
  once(event: string, callback: EventCallback): void {
    const wrapper = async (...args: any[]) => {
      await callback(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  /**
   * 获取事件的所有订阅者数量
   * @param event 事件名称
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * 清除所有事件订阅
   */
  clear(): void {
    this.events.clear();
  }
}

export default Event; 