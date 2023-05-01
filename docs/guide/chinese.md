# 中文相关

## toChineseNumber

转换数字为中文数字,如`123456.78`转换为`壹拾贰万叁仟肆佰伍拾陆点柒捌`

```typescript
function toChineseNumber(value: number | string, isBig?: boolean)
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