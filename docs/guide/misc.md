# 杂项
## timer

计时器，用来返回两次调用之间的耗时

```typescript
import { timer } from "flex-tools"


timer.begin()
await doing()
timer.end()  // time consuming: 12ms

timer.end("耗时：")  // 耗时：12ms
timer.end("耗时：",{unit:'s'})  // 耗时：1200s
```

**说明** 

- `timer.begin`和`timer.end`必须成对出现
- 允许嵌套使用`timer.begin`和`timer.end`
    ```typescript
        timer.begin() -------------| 
        await doing()              |
            timer.begin() ---      |
            await doing()    |     |
            timer.end()   ---      |
        timer.end()  --------------|
    ```


## parseTimeDuration

解析如`1ms`, `12s` , `98m`, `100h`,`12Hours`,`8Days`, `6Weeks`, `8Years`, `1Minute`的字符串为毫秒数。

```typescript
    // ms
    parseTimeDuration("1")              // =1
    parseTimeDuration("1ms")            // =1
    parseTimeDuration("1Milliseconds")  // =1
    //s
    parseTimeDuration("1s")             // =1000
    parseTimeDuration("1Seconds")       // =1000
    parseTimeDuration("1.5s")           // =1500
    parseTimeDuration("1.5Seconds")     // =1500
    
    // m
    parseTimeDuration("1m")             // =60000
    parseTimeDuration("1Minutes")       // =60000
    parseTimeDuration("1.5m")           // =60000+60000*0.5
    parseTimeDuration("1.5Minutes")     // =60000+60000*0.5
    // h
    parseTimeDuration("1h")             // =3600000
    parseTimeDuration("1Hours")         // =3600000
    parseTimeDuration("1.5h")           // =3600000+3600000*0.5
    parseTimeDuration("1.5Hours")       // =3600000+3600000*0.5

    // D
    parseTimeDuration("1D")             // =86400000
    parseTimeDuration("1d")             // =86400000
    parseTimeDuration("1Days")          // =86400000
    parseTimeDuration("1.5d")           // =86400000+86400000*0.5
    parseTimeDuration("1.5Days")        // =86400000+86400000*0.5

    // W 
    parseTimeDuration("1w")             // =604800000
    parseTimeDuration("1W")             // =604800000
    parseTimeDuration("1Weeks")         // =604800000
    parseTimeDuration("1.5w")           // =604800000+604800000*0.5
    parseTimeDuration("1.5Weeks")       // =604800000+604800000*0.5

    // M
    parseTimeDuration("1M")             // =2592000000
    parseTimeDuration("1Months")        // =2592000000
    parseTimeDuration("1.5M")           // =2592000000+2592000000*0.5
    parseTimeDuration("1.5Months")      // =2592000000+2592000000*0.5

    // Y
    parseTimeDuration("1Y")             // =31104000000
    parseTimeDuration("1y")             // =31104000000
    parseTimeDuration("1Years")         // =31104000000
    parseTimeDuration("1.5Y")           // =31104000000+31104000000*0.5
    parseTimeDuration("1.5Years")       // =31104000000+31104000000*0.5
```

## parseFileSize

解析如`1ms`, `12s` , `98m`, `100h`,`12Hours`,`8Days`, `6Weeks`, `8Years`, `1Minute`的字符串为字节数。


```typescript
    parseFileSize(1)                //1,无单位代表是字节
    parseFileSize("33b")            //33
    parseFileSize("33B")            //33
    parseFileSize("33Byte")         //33
    //kb
    parseFileSize("1k")             //1024
    parseFileSize("1K")             //1024
    parseFileSize("1kb")            //1024
    parseFileSize("1KB")            //1024

    parseFileSize(".5k")            //512
    parseFileSize("0.5k")           //512)   
    parseFileSize("1.5k")           //1536
    parseFileSize("1.5K")           //1536
    parseFileSize("1.5kb")          //1536
    parseFileSize("1.5KB")          //1536

    //mb
    parseFileSize("1m")             //1048576
    parseFileSize("1M")             //1048576
    parseFileSize("1mb")            //1048576
    parseFileSize("1MB")            //1048576
    
    parseFileSize("1.5m")           //1572864
    parseFileSize("1.5M")           //1572864
    parseFileSize("1.5mb")          //1572864
    parseFileSize("1.5MB")          //1572864

    //gb
    parseFileSize("1g")             //1073741824
    parseFileSize("1g")             //1073741824
    parseFileSize("1gb")            //1073741824
    parseFileSize("1GB")            //1073741824

    parseFileSize("1.5g")           //1610612736
    parseFileSize("1.5G")           //1610612736
    parseFileSize("1.5gb")          //1610612736
    parseFileSize("1.5GB")          //1610612736
```

## formatDateTime

简单的日期时间格式化函数，格式化模板字符兼容`dayjs`。在某些场合如果要对时间日期进行格式化，就可以不再需要引入完整的`dayjs`了。

```typescript

function formatDateTime(value?: Date | number, format?: string,options?:FormatDateTimeOptions);

expect(formatDateTime(new Date(2021, 3, 8, 6, 8, 12, 24), "yyyy-MM-DD HH:mm:ss.SSS")).toBe("2021-04-08 06:08:12.024")

```

## relativeTime

返回相对时间友好描述。


```typescript
function relativeTime(value:Date | number,baseTime?:Date | number,options?:RelativeTimeOptions)

    let now = Date.now()
    relativeTime(now,now)                                   // 刚刚
    relativeTime(now-500,now)                               // 刚刚
    relativeTime(now-1000,now)                              // 1秒前
    relativeTime(now-1000*60,now)                           // 1分钟前
    relativeTime(now-1000*60*60,now)                        // 1小时前
    relativeTime(now-1000*60*60*24,now)                     // 1天前
    relativeTime(now-1000*60*60*24*13,now)                  // 1周前
    relativeTime(now-1000*60*60*24*30,now)                  // 1个月前
    relativeTime(now-1000*60*60*24*30*3,now)                // 3个月前
    relativeTime(now-1000*60*60*24*365 ,now)                // 1年前  
    relativeTime(now+1000,now)                              // 1秒后
    relativeTime(now+1000*60,now)                           // 1分钟后
    relativeTime(now+1000*60*60,now)                        // 1小时后
    relativeTime(now+1000*60*60*24,now)                     // 1天后
    relativeTime(now+1000*60*60*24*30,now)                  // 1个月后
    relativeTime(now+1000*60*60*24*30*12,now)               // 12个月后
    relativeTime(now+1000*60*60*24*365,now)                 // 1年后
```

- `baseTime` 用于计算相对时间的基准时间，默认为当前时间。
- `value`参数可以是`Date`对象或者时间戳。
- `options`参数可以指定`units`,`now`,`before`,`after`的参数。
    - `units`默认等于`["秒","分钟","小时","天","周","个月","年"]`，如果是英文环境则可以更改为`["second","minute","hour","day","week","month","year"]`。
    - `now`默认等于`刚刚`，如果是英文环境则可以更改为`Just now`。
    - `before`默认等于`{value}{unit}前`，可以自定义显示方式。
    - `after`默认等于`{value}{unit}后`，可以自定义显示方式。

