export interface GetByPathOptions {
    defaultValue?: any; // 默认值
    delimiter?: string; // 路径分隔符，默认为 '.',
    matched?: ({ value, parent, indexOrKey }: {
        value?     : any;
        parent?    : object | any[];
        indexOrKey?:  string | symbol | number;
    }) => void;
}

export function getByPath<R = any, T = object>(obj: T, path: string, options?: GetByPathOptions): R {
    const { defaultValue, delimiter,matched } = Object.assign({
        delimiter : '.'
    },options)

    if (!obj || typeof path !== 'string') {
        return defaultValue as R;
    }
    if(!path) return obj as R    

    const keys = path.split(delimiter);
    let current: any = obj;
    let parent: any 
    let indexOrKey:any
    try{
        for (const key of keys) {
            if (current instanceof Map || current instanceof WeakMap) {
                if(!current.has(key as any)) {
                    return defaultValue as R
                }
                parent =  current                
                indexOrKey = key
                current = current.get(key as any);
            } else if (current instanceof Set)  {
                const index = parseInt(key, 10)
                if(index>=current.size) return defaultValue as R
                parent =  current
                indexOrKey = index
                current = [...current][index];
            } else if (current && typeof current === 'object' && key in current) {
                parent =  current
                indexOrKey = Array.isArray(current) ? parseInt(key) : key
                current = current[key];
            } else {
                return defaultValue as R;
            }
        }
    }catch{
        return defaultValue as R
    }   
    if(typeof(matched)==="function"){
        matched({ value:current, parent, indexOrKey })
    }
    return current as R
}