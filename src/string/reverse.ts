declare global {
    interface String { 
        reverse():string
    }
}

// 反转字符串
export function reverse(str:string) {
    let result =[]
    for(let i=str.length-1;i>=0;i--) {
        result.push(str.charAt(i))
    }
    return result.join("")
}

String.prototype.reverse = function (this:string) {
    return reverse(this)
}