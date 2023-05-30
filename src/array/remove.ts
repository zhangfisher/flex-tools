/**
 * 
 * 移除数组中的值
 * 
 * let arr=[1,2,3,4,5,6,7,8,9,10]
 * 
 * arr.remove(5)        // 移除第5个元素，返回移除的元素
 * arr.remove(1,3,5)    // 移除第1,3,5个元素，返回移除的元素个数
 * 
 */


export function remove(arr:Array<any>,...values:any[]){
    let count= 0 
    for(let i=arr.length-1;i>=0;i--){
        values.some(value=>{
            if(arr[i]===value){
                arr.splice(i,1)
                count++
            }
        })
    }
    return count
}
 
