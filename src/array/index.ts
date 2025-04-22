
import { getItem } from "./getItem";
import { remove } from "./remove"

declare global {
    interface Array<T> {
        remove<T>(...values: (T | ({ returnRemoved?: boolean }))[]): T | number;         
        get<T=any>(index:number,defaultValue?:T | undefined):T | undefined; 
    }
}


Array.prototype.remove=function<T>(this:Array<any>,...values: (T | ({ returnRemoved?: boolean }))[]){   
    return remove<T>(this,...values) as T | number
}
Array.prototype.get=function<T=any>(this:Array<T>,index:number,defaultValue?:T | undefined):T | undefined{   
    return getItem<T>(this,index,defaultValue)
}

export * from "./remove"
export * from "./getItem"