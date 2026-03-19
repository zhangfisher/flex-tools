/**
 * 表示时间间隔的类型，支持多种格式
 * 
 * @description
 * 支持以下格式：
 * - 纯数字（毫秒）：`1000` 或 `'1000'`
 * - 带单位简写：
 *   - 毫秒: `'100ms'`
 *   - 秒: `'30s'`
 *   - 分钟: `'5m'`
 *   - 小时: `'2h'`
 *   - 天: `'1d'` 或 `'1D'`
 *   - 周: `'2w'` 或 `'2W'`
 *   - 月: `'3M'`
 *   - 年: `'1y'` 或 `'1Y'`
 * - 带单位全称：
 *   - `'500Milliseconds'`
 *   - `'30Seconds'`
 *   - `'5Minutes'`
 *   - `'2Hours'`
 *   - `'1Days'`
 *   - `'2Weeks'`
 *   - `'3Months'`
 *   - `'1Years'`
 * 
 * @example
 * // 各种使用方式
 * const short: TimeDuration = '30s';    // 30秒
 * const long: TimeDuration = '1h30m';   // 1小时30分钟
 * const days: TimeDuration = '7d';      // 7天
 * const ms: TimeDuration = 5000;       // 5000毫秒
 * const strMs: TimeDuration = '5000';  // 5000毫秒
 * const full: TimeDuration = '2Weeks'; // 2周
 */
export type TimeDuration = number | `${number}` | `${number}${
    'ms' | 's' | 'm' | 'h'              // 毫秒/秒/分钟/小时/
    | 'Milliseconds' | 'Seconds' | 'Minutes' |'Hours' 
    | 'd' | 'D' | 'W' | 'w' | 'M' | 'Y' | 'y'                // 天/周/月/年
    | 'Days' | 'Weeks' |'Months' | 'Years'
}`