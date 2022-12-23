
/**
 * 以baseObj为基准判断两个对象值是否相同，值不同则返回false
 * 
 * 以baseObj为基准的意思是，只对refObj中与baseObj相同键名的进行对比，允许refObj存在不同的键名
 * 
 * @param baseObj 
 * @param refObj 
 * @param isRecursion  当isDiff被递归调用时置为true
 * @returns {Boolean} 
 */

export function isDiff(baseObj:Record<string,any> | [], refObj:Record<string,any> | [],isRecursion:boolean=false):boolean{ 
    if(typeof(baseObj)!= typeof(refObj)) return true    
    if(Array.isArray(baseObj) && Array.isArray(refObj)){
        if(baseObj.length!=refObj.length) return true  // 长度不同
        for(let i:number = 0; i < baseObj.length;i++){
            let v1 = baseObj[i], v2 = refObj[i]                
            if(typeof(v1)!=typeof(v2)) return true   // 类型不同
            if(v1 == null && v2 == null)  continue
            if(Array.isArray(v1) && Array.isArray(v2)){
                if(isDiff(v1,v2,true)) return true    
            }else if(typeof(v1)=="object" && typeof(v2)=="object"){
                if(isDiff(v1,v2,true)) return true 
            }else{
                if(v1!=v1) return true
            }            
        }
    }else if(typeof(baseObj)=="object" && typeof(refObj)=="object"){
        if(isRecursion){
            if(Object.keys(baseObj).length != Object.keys(refObj).length) return true 
        }else{
            if(Object.keys(baseObj).length > Object.keys(refObj).length) return true 
        }
        for(let [key,value] of Object.entries(baseObj)){
            const v1 = value,v2 = (refObj as Record<string,any>) [key]
            if(v1 == null && v2 == null)  continue
            if(!(key in refObj)) return true
            if(typeof(v1) != typeof(v2)) return true        
            if(Array.isArray(v1) && Array.isArray(v2)){
                if(isDiff(v1,v2,true)) return true    
            }else if(typeof(v1)=="object" && typeof(v2)=="object"){
                if(isDiff(v1,v2,true)) return true                            
            }else{
                if(v1 != v2) return true
            }
        }                      
    }     
    return false
}

