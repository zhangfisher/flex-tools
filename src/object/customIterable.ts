
/**
 * 创建一个自定义的迭代器,实现 Iterable 接口，可以进行选择性的过滤迭代
 * 
@example
  const obj = new CustomIterable({ 
    a: 1, 
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
}, (key, value) => value <= 3)
  
const newObj = { ...obj };
console.log(newObj); // 输出：{ a: 1, b: 2 ,c : 3}
 * 
 */
class CustomIterable {
    private _sourceEntries: [string, any][];

    constructor(public source: object, public filter: (key: any, value: any) => boolean) {
        this._sourceEntries = Object.entries(source);
    }

    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                while (index< this._sourceEntries.length) {
                    const [key, value] = this._sourceEntries[index];
                    index++;
                    if (this.filter(key, value)) {
                        return { value: { [key]: value }, done: false };
                    }
                }
                return { done: true };
            }
        };
    }
}

const obj = new CustomIterable({
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    f: 6,
    g: 7,
}, (key, value) => value <= 3);

for(let f of obj){
    console.log("f=",f)
}
const newObj = { ...obj };

console.log(newObj); // 输出：{ a: 1, b: 2, c: 3 }
