export interface GetByPathOptions {
    default?: any; // 默认值
    delimiter?: string; // 路径分隔符，默认为 '.'
}

export function getByPath<V = any, T = object>(obj: T, path: string, options?: GetByPathOptions): V {
    const { default: defaultValue, delimiter = '.' } = options || {};

    if (!obj || typeof path !== 'string') {
        return defaultValue as V;
    }
    if(!path) return obj as V

    const keys = path.split(delimiter);
    let current: any = obj;
    try{
        for (const key of keys) {
            if (current instanceof Map || current instanceof WeakMap) {
                if(!current.has(key as any)) return defaultValue as V
                current = current.get(key as any);
            } else if (current instanceof Set)  {
                const index = parseInt(key, 10)
                if(index>=current.size) return defaultValue as V
                current = [...current][index];
            } else if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue as V;
            }
        }
    }catch{
        return defaultValue as V;
    }
    

    return current as V;
}