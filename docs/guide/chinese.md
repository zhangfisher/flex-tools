# 中文相关

## toChineseNumber

转换数字为中文数字,如`123456.78`转换为`壹拾贰万叁仟肆佰伍拾陆点柒捌`

```typescript
function toChineseNumber(value: number | string, isBig?: boolean)

    toChineseNumber("1")                    // 一
    toChineseNumber("12")                   // 十二
    toChineseNumber("123")                  // 一百二十三
    toChineseNumber("1234")                 // 一千二百三十四
    toChineseNumber("12345")                // 一万二千三百四十五
    toChineseNumber("123456")               // 十二万三千四百五十六
    toChineseNumber("1234567")              // 一百二十三万四千五百六十七
    toChineseNumber("12345678")             // 一千二百三十四万五千六百七十八
    toChineseNumber("123456789")            // 一亿二千三百四十五万六千七百八十九
    toChineseNumber("1234567890")           // 十二亿三千四百五十六万七千八百九十
    toChineseNumber("12345678901")          // 一百二十三亿四千五百六十七万八千九百零一
    toChineseNumber("123456789012")         // 一千二百三十四亿五千六百七十八万九千零一十二
    toChineseNumber("1234567890123")        // 一兆二千三百四十五亿六千七百八十九万零一百二十三
    toChineseNumber("12345678901234")       // 十二兆三千四百五十六亿七千八百九十万一千二百三十四
    toChineseNumber("123456789012345")      // 一百二十三兆四千五百六十七亿八千九百零一万二千三百四十五
    toChineseNumber("1234567890123456")     // 一千二百三十四兆五千六百七十八亿九千零一十二万三千四百五十六
    toChineseNumber("12345678901234567")    // 一京二千三百四十五兆六千七百八十九亿零一百二十三万四千五百六十七
    toChineseNumber("123456789012345678")   // 十二京三千四百五十六兆七千八百九十亿一千二百三十四万五千六百七十八
    // 大写
    toChineseNumber("1",true)               // 壹
    toChineseNumber("12",true)              // 拾贰
    toChineseNumber("123",true)             // 壹佰贰拾叁
    toChineseNumber("1234",true)            // 壹仟贰佰叁拾肆
    toChineseNumber("12345",true)           // 壹万贰仟叁佰肆拾伍
    toChineseNumber("123456",true)          // 拾贰万叁仟肆佰伍拾陆
    toChineseNumber("1234567",true)         // 壹佰贰拾叁万肆仟伍佰陆拾柒
    toChineseNumber("12345678",true)        // 壹仟贰佰叁拾肆万伍仟陆佰柒拾捌
    toChineseNumber("123456789",true)       // 壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖
    toChineseNumber("1234567890",true)      // 拾贰亿叁仟肆佰伍拾陆万柒仟捌佰玖拾
    toChineseNumber("12345678901",true)     // 壹佰贰拾叁亿肆仟伍佰陆拾柒万捌仟玖佰零壹
    toChineseNumber("123456789012",true)    // 壹仟贰佰叁拾肆亿伍仟陆佰柒拾捌万玖仟零壹拾贰

```

- `value` 要转换的数字
- `isBig` 是否使用大写，默认为`false`


## toChineseCurrency

转换数字为中文货币，如`123456.78`转换为`壹拾贰万叁仟肆佰伍拾陆元柒角捌分`

```typescript
 function toChineseCurrency(value: number | string, options : { big?: boolean, prefix?: string, unit?: string, suffix?: string } = {}, $config: any): string  

 ```

- `value` 要转换的数字
- `options` 选项
    - `big` 是否使用大写，默认为`false`
    - `prefix` 货币前缀，默认为`空`
    - `unit` 货币单位，默认为`元`
    - `suffix` 货币后缀