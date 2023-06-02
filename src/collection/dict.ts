import { get as getByPath } from '../object/get';
import { set as setByPath, setByPathOptions } from '../object/set';
import { hasKey } from '../object/hasKey';

/**
 * 
 * 一个字典对象，用于存储键值对并提供便捷的访问方法
 * 
 *  let dict = new Dict({a:1,b:2})
 *  dict.get('a') // 1 
 *  dict.set("a",2)
 *  dict.set('a.b',3) 
 * 
 * 
 */

export interface DictOptions{

}


export class Dict<T extends Record<string,any>=Record<string,any>>{
    private _values:T
    constructor(obj?:T){
        this._values = obj || {} as T
    }
    get(keyOrPath:string,defaultValue?:any):any{
        return getByPath(this._values,keyOrPath,{defaultValue})
    }
    set(keyOrPath:string,value:any,options?:setByPathOptions){
        setByPath(this._values,keyOrPath,value,options)
    }
    has(keyOrPath:string):boolean{
        return hasKey(this._values,keyOrPath)
    }
}

