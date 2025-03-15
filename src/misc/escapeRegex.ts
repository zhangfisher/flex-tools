
/**
 * 转义正则表达式中的特殊字符。
 * 
 * 此函数接收一个字符串，并将其中所有正则表达式的特殊字符
 * （如 `-`、`[`、`]`、`/`、`{`、`}`、`(`、`)`、`*`、`+`、`?`、`.`、`\`、`^`、`$`、`|` 等）
 * 转义为其字面量形式，以便该字符串可以安全地用作正则表达式模式的一部分。
 * 
 * 示例：
 * 1. 输入：`hello.world`，输出：`hello\.world`
 * 2. 输入：`[abc]+`，输出：`\[abc\]\+`
 * 3. 输入：`$5.00`，输出：`\$5\.00`
 * 
 * @param input - 要转义的输入字符串。
 * @returns 转义后的字符串，其中所有正则表达式特殊字符都已被转义。
 */
export function escapeRegex(input:string) {
    return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}