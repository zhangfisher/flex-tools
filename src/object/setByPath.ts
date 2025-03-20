 

export interface SetByPathOptions { 
    delimiter?: string; // 路径分隔符，默认为 '.'
    // 如果指定的路径不存在，则回调返回一个值目标路径的值
    infer?: (path:string[]) => any; // 自定义路径解析器
}
 
/**
 * 
 * 更新对象指定路径的值
 * 
 * 1. 如果路径不存在，自动创建，创建的类型是根据infer函数来推断
 *  const obj = {}
 *  默认infer=()=>({}),自动推断为一个对象
 *  setByPath(obj,"a.b"，1)  // { a: { b: 1 }}
 * 
 *  setByPath(obj,"a.0",1,{
 *      infer: (path) => path.startsWith('a') ? [] : {}
 *  })  // { a: [1]}}
 * 
 * 
 * 2. 路径分隔符默认为 '.'，允许通过delimiter自定义
 * 3. 支持Map、Set、Array
 * 4. 更新数组时
 *  
 *  数组索引只以>=0与<=数组长度。
 * 
 *  const obj = { 
 *      a: 
 *      { b: 
 *          { c:  * 1 } 
 *      },
 *      x:[1,2,3]
 *  }
 * 
 *  setByPath(obj,"x.1",0)  // { a: { b: { c: 1 } }, x: [1, 0, 3] }
 *  setByPath(obj,"x.2",0)  // { a: { b: { c: 1 } }, x: [1, 0, 0] }
 *  setByPath(obj,"x.3",0)  // { a: { b: { c: 1 } }, x: [1, 0, 0，0] }
 *  setByPath(obj,"x.13",0)  // 无效，因为无法扩展数组
 * 
 *  4. 其他的视为普通对象，自动创建
 * 
 *  setByPath(obj,"m.n.o",100) // { a: { b: { c: 1 } }, x: [1, 0, 0，0]，m: { n: { o: 100 } } }
 
 * 

 * 
 * 
 * @param obj 
 * @param path 
 * @param value 
 * @param options 
 */

/**

 * 更新对象指定路径的值
 * 
 * 1. 如果路径不存在，自动创建，创建的类型是根据infer函数来推断
 * 
 * setByPath(obj,"m.n.o",100) // { a: { b: { c: 1 } }, x: [1, 0, 0, 0], m: { n: { o: 100 } } }
 * 
 * 2. 路径分隔符默认为 '.'，允许通过delimiter自定义
 * 3. 支持Map、Set、Array
 * 4. 更新数组时
 *  
 *  数组索引只以>=0与<=数组长度。
 * 
 *  const obj = { 
 *      a: 
 *      { b: 
 *          { c: 1 } 
 *      },
 *      x:[1,2,3]
 *  }
 * 
 *  setByPath(obj,"x.1",0)  // { a: { b: { c: 1 } }, x: [1, 0, 3] }
 *  setByPath(obj,"x.2",0)  // { a: { b: { c: 1 } }, x: [1, 0, 0] }
 *  setByPath(obj,"x.3",0)  // { a: { b: { c: 1 } }, x: [1, 0, 0, 0] }
 *  setByPath(obj,"x.13",0)  // 无效，因为无法扩展数组
 
 *  
 * 
 * @param obj 
 * @param path 
 * @param value 
 * @param options 
 */

export function setByPath<T = object>(obj: T, path: string, value:any,options?: SetByPathOptions): T {

    const {  delimiter ,infer   } = Object.assign({
        delimiter:".",
        infer: ()=>({})
    }, options )

    if (!obj || typeof path !== 'string') {
        return obj as T;
    }
    if (!path) return obj as T;

    const keys = path.split(delimiter);
    let current: any = obj;
    const curPath:string[] = []
    
    for (let i=0;i<keys.length;i++){
        const key = keys[i];
        curPath.push(key);
        if(current){
            if(Array.isArray(current)){          
                const index = parseInt(key, 10)
                if( Number.isNaN(index) || index<0 || index>=current.length){
                    throw new Error(`setByPath: invalid array index ${curPath.join('.')}`);
                }else{
                    current = current[index]
                }
            }else if(current instanceof Map || current instanceof WeakMap) {
                if (current.has(key as any)) {
                    current = current.get(key as any);
                }else{
                    current.set(key as any, infer(curPath))
                }                    
            } else if (typeof current === 'object' && key in current) {
                if(i===keys.length - 1){
                    current[key] = value
                }else{
                    current = current[key]
                }                    
            } else {
                current[key] = i===keys.length -1 ? value : infer(curPath)
                current = current[key];
            }
        }else{ // 如果当前对象不存在，则创建 
            current[key] = i===keys.length -1 ? value : infer(curPath)
            current = current[key];
        }  
    }
    return obj as T;

}