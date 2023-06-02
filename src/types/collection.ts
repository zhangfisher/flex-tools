/**
 
数据容器类型
 
 * 
 */
export type Collection<V=any,K extends string | symbol|number=string | symbol|number> = Record<K,V> | V[] | Set<V> | Map<K,V> 