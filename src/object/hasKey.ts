/**
 * 
 * 判断是否有某个属性
 * 
 */



export function hasKey(obj: any, keyOrPath: string){
    const keyList = keyOrPath.split(".");
    let currentObj = obj;
    for (let i = 0; i < keyList.length; i++) {
        if (!currentObj.hasOwnProperty(keyList[i])) {
        return false;
        }
        currentObj = currentObj[keyList[i]];
    }
    return true;
}