
export interface JsonObject {
    [key: string]: string | number | boolean | null | any[] | Set<any> | Map<any,any> | symbol | WeakMap<any,any> | WeakSet<any> | Function | JsonObject 
}