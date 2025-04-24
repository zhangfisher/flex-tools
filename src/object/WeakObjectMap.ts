/**
 * 一个基于弱引用（WeakRef）的键值映射集合
 * 
 * @template T - 值的类型，必须是对象类型（继承自 `object`）
 * 
 * @example
 * const map = new WeakObjectMap<MyObject>();
 * map.set('key1', obj1);
 * const retrieved = map.get('key1'); // 返回 obj1 或 undefined（如果已被垃圾回收）
 */
export class WeakObjectMap<T extends object> {
    private map: Map<string, WeakRef<T>>;
    private finalizationRegistry: FinalizationRegistry<string>;
  
    /**
     * 构造一个新的 WeakObjectMap 实例
     */
    constructor() {
      this.map = new Map();
      this.finalizationRegistry = new FinalizationRegistry((key) => {
        this.map.delete(key);
      });
    }
  
    /**
     * 设置键值对
     * @param key - 字符串键名
     * @param value - 要存储的对象值（会被自动包装为弱引用）
     */
    set(key: string, value: T): void {
      const weakRef = new WeakRef(value);
      this.map.set(key, weakRef);
      this.finalizationRegistry.register(value, key);
    }
  
    /**
     * 获取指定键对应的值
     * @param key - 要查找的键名
     * @returns 如果值存在且未被垃圾回收则返回值，否则返回 undefined
     */
    get(key: string): T | undefined {
      const weakRef = this.map.get(key);
      return weakRef ? weakRef.deref() : undefined;
    }
  
    /**
     * 删除指定键的映射
     * @param key - 要删除的键名
     * @returns 如果键存在并已删除则返回 true，否则返回 false
     */
    delete(key: string): boolean {
      return this.map.delete(key);
    }
  
    /**
     * 检查是否存在指定键的映射（且值未被垃圾回收）
     * @param key - 要检查的键名
     * @returns 如果键存在且值未被回收则返回 true，否则返回 false
     */
    has(key: string): boolean {
      const weakRef = this.map.get(key);
      return weakRef ? weakRef.deref() !== undefined : false;
    }
}
