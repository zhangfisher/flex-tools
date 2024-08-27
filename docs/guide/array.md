# 数组

所有数组函数支持`函数调用`和`原型注入`两种使用方式：

- **函数方式**

```typescript
import { remove } from "flex-tools/array/remove"
let arr = [1,2,3,4,5,6,7,8,9,10]
remove(arr,1,2,3)
```

- **原型注入**

被注入到`Array`原型中，可以直接使用。

```typescript
import "flex-tools/array"  
let arr = [1,2,3,4,5,6,7,8,9,10]
arr.remove(1,2,3)               
```


## remove

移除数组中的元素。

**注意**：是移除相同值的元素，而不是移除相同索引的元素。

```typescript
import "flex-tools/array"  
let arr = [1,2,3,4,5,6,7,8,9,10]
arr.remove(1,2,3)  // 移除值为1,2,3的元素

```

## get
获取数组中的元素，支持负数索引。

```typescript
import "flex-tools/array"
let arr = [1,2,3,4,5,6,7,8,9,10]
arr.get(1)  // 2
arr.get(-1) // 10
```


