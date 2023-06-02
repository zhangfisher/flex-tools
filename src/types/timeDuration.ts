/** 
 * 时间间隔
 * 
 * let t:TimeDuration = '1h'
 * let t:TimeDuration = '2d'
 * 
 * */ 
export type TimeDuration = number | `${number}` | `${number}${
    'ms' | 's' | 'm' | 'h'              // 毫秒/秒/分钟/小时/
    | 'Milliseconds' | 'Seconds' | 'Minutes' |'Hours' 
    | 'd' | 'D' | 'W' | 'w' | 'M' | 'Y' | 'y'                // 天/周/月/年
    | 'Days' | 'Weeks' |'Months' | 'Years'
}`
