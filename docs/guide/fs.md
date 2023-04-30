# 文件系统

## forEachUp

向上遍历祖先文件夹

```typescript
interface findUpOptions{
    includeSelf?:boolean,                   // 结果是否包含当前文件夹
    base?:string,                          // 入口文件夹,默认为当前文件夹
}

function forEachUp(callback:(folder:string)=>Symbol | void,options?:findUpOptions)

forEachUp((folder)=>{
    console.log(folder)
})
```

- 通过返回`ABORT`可以中断遍历
- 默认是从当前文件夹开始向上遍历，可以通过`base`参数指定入口文件夹
- 默认结果不包含当前文件夹，可以通过`includeSelf`参数指定是否包含当前文件夹


## findUp

向上查找指定的文件，并返回找到的文件路径列表

```typescript
export interface FindUpOptions{
    includeSelf?:boolean,                   // 是否包含当前文件夹
    entry?:string                           // 查找起点,默认为当前文件夹
    onlyFirst?:boolean                      // 是否只查找第一个文件
}

export function findUp(files:string | string[], options?:FindUpOptions)

// 示例：

// 当前文件夹为d:/code/web/app/src
//  d:/code
//       |--myapp
//          |--/src
//          |--/dist
//          |--/package.json
//          |--tsconfig.json
//          |--tsconfig.ts
//  d:/code/myapp/src


// CWD=d:/code/myapp/src
// 从当前路径向上查找package.json文件
findUp('package.json')  //= ["d:/code/myapp/package.json"]
findUp('package.json',{entry:"c:/code/myapp/src"}) // 从c:/code/myapp/src向上查找package.json文件
// 从当前路径向上查找'tsconfig.json','tsconfig.ts'
findUp(['tsconfig.json','tsconfig.ts']) // = ["d:/code/myapp/tsconfig.json","d:/code/myapp/tsconfig.ts"]

```

- 默认是从当前文件夹开始向上查找，可以通过`entry`参数指定入口文件夹
- 默认结果不包含当前文件夹，可以通过`includeSelf`参数指定是否包含当前文件夹
- 默认查找所有匹配的文件，可以通过`onlyFirst`参数指定是否只查找第一个文件
- 如果找不到文件，则返回空数组
- 如果找到文件，则返回文件路径列表
 