import { isAsyncFunction } from "../typecheck/isAsyncFunction"
/**
 * 不可重入
 * @param fn 
 * @param options 
 * @returns 
 */
 export function memorize(fn:Function,options:{hash?:((args: any[]) => string) | 'length' | boolean,expires?:number}={hash:false,expires:0}) {
    let result:any
    let preHash:string | undefined
    let timestamp :number = 0
    if(options.hash == false ) return fn

    const getHash=function(this:any,args: any[]){
        return options.hash == 'length' ? String(args.length) : (typeof options.hash == 'function' ? options.hash.call(this,args) : undefined )
    }

    const isInvalid = (hash: string | undefined):boolean => result===undefined || (hash!=undefined && hash!=preHash) || (options.expires && options.expires>0 && timestamp>0 && (Date.now() - timestamp)> options.expires) as boolean

    if(isAsyncFunction(fn)){
        return async function(this:any,...args:any[]){
            let hash = getHash.call(this,args)
            if(isInvalid(hash)){
                result =await fn.apply(this,args)
                timestamp = Date.now()
                preHash = hash
            }
            return result
        }
    }else{
        return function(this:any,...args:any[]){
            let hash = getHash.call(this,args)
            if(isInvalid(hash)){
                result = fn.apply(this,args)
                timestamp = Date.now()
                preHash = hash
            }
            return result
        }
    }
}
