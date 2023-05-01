import { test,expect} from "vitest"

import {  parseFileSize, parseTimeDuration, relativeTime } from "../src/misc"
import { formatDateTime } from '../src/misc/formatDateTime';
import { toChineseNumber,toChineseCurrency} from '../src/chinese';

// import { parseTags } from '../src/misc/parseTags';



test("getFileSize", () => {
    expect(parseFileSize(1)).toBe(1)
    expect(parseFileSize("33b")).toBe(33)
    expect(parseFileSize("33B")).toBe(33)
    expect(parseFileSize("33Byte")).toBe(33)
    //kb
    expect(parseFileSize("1k")).toBe(1024)
    expect(parseFileSize("1K")).toBe(1024)
    expect(parseFileSize("1kb")).toBe(1024)
    expect(parseFileSize("1KB")).toBe(1024)

    expect(parseFileSize(".5k")).toBe(512)
    expect(parseFileSize("0.5k")).toBe(512)    
    expect(parseFileSize("1.5k")).toBe(1536)
    expect(parseFileSize("1.5K")).toBe(1536)
    expect(parseFileSize("1.5kb")).toBe(1536)
    expect(parseFileSize("1.5KB")).toBe(1536)

    //mb
    expect(parseFileSize("1m")).toBe(1048576)
    expect(parseFileSize("1M")).toBe(1048576)
    expect(parseFileSize("1mb")).toBe(1048576)
    expect(parseFileSize("1MB")).toBe(1048576)
    
    expect(parseFileSize("1.5m")).toBe(1572864)
    expect(parseFileSize("1.5M")).toBe(1572864)
    expect(parseFileSize("1.5mb")).toBe(1572864)
    expect(parseFileSize("1.5MB")).toBe(1572864)

    //gb
    expect(parseFileSize("1g")).toBe(1073741824)
    expect(parseFileSize("1g")).toBe(1073741824)
    expect(parseFileSize("1gb")).toBe(1073741824)
    expect(parseFileSize("1gb")).toBe(1073741824)

    expect(parseFileSize("1.5g")).toBe(1610612736)
    expect(parseFileSize("1.5G")).toBe(1610612736)
    expect(parseFileSize("1.5gb")).toBe(1610612736)
    expect(parseFileSize("1.5GB")).toBe(1610612736)


})

test("getTimeInterval", () => {
    // ms
    expect(parseTimeDuration("1")).toBe(1)
    expect(parseTimeDuration("1ms")).toBe(1)
    expect(parseTimeDuration("1Milliseconds")).toBe(1)
    //s
    expect(parseTimeDuration("1s")).toBe(1000)
    expect(parseTimeDuration("1Seconds")).toBe(1000)
    expect(parseTimeDuration("1.5s")).toBe(1500)
    expect(parseTimeDuration("1.5Seconds")).toBe(1500)
    
    // m
    expect(parseTimeDuration("1m")).toBe(60000)
    expect(parseTimeDuration("1Minutes")).toBe(60000)
    expect(parseTimeDuration("1.5m")).toBe(60000+60000*0.5)
    expect(parseTimeDuration("1.5Minutes")).toBe(60000+60000*0.5)
    // h
    expect(parseTimeDuration("1h")).toBe(3600000)
    expect(parseTimeDuration("1Hours")).toBe(3600000)
    expect(parseTimeDuration("1.5h")).toBe(3600000+3600000*0.5)
    expect(parseTimeDuration("1.5Hours")).toBe(3600000+3600000*0.5)

    // D
    expect(parseTimeDuration("1D")).toBe(86400000)
    expect(parseTimeDuration("1d")).toBe(86400000)
    expect(parseTimeDuration("1Days")).toBe(86400000)
    expect(parseTimeDuration("1.5d")).toBe(86400000+86400000*0.5)
    expect(parseTimeDuration("1.5Days")).toBe(86400000+86400000*0.5)

    // W 
    expect(parseTimeDuration("1w")).toBe(604800000)
    expect(parseTimeDuration("1W")).toBe(604800000)
    expect(parseTimeDuration("1Weeks")).toBe(604800000)
    expect(parseTimeDuration("1.5w")).toBe(604800000+604800000*0.5)
    expect(parseTimeDuration("1.5Weeks")).toBe(604800000+604800000*0.5)

    // M
    expect(parseTimeDuration("1M")).toBe(2592000000)
    expect(parseTimeDuration("1Months")).toBe(2592000000)
    expect(parseTimeDuration("1.5M")).toBe(2592000000+2592000000*0.5)
    expect(parseTimeDuration("1.5Months")).toBe(2592000000+2592000000*0.5)

    // Y
    expect(parseTimeDuration("1Y")).toBe(31104000000)
    expect(parseTimeDuration("1y")).toBe(31104000000)
    expect(parseTimeDuration("1Years")).toBe(31104000000)
    expect(parseTimeDuration("1.5Y")).toBe(31104000000+31104000000*0.5)
    expect(parseTimeDuration("1.5Years")).toBe(31104000000+31104000000*0.5)



})


test("formatDateTime", () => {
    expect(formatDateTime(new Date(2021, 3, 8, 6, 8, 12, 24), "yyyy-MM-DD HH:mm:ss.SSS")).toBe("2021-04-08 06:08:12.024")
        
})

test("relativeTime", () => {
    let now = Date.now()
    expect(relativeTime(now,now)).toBe("刚刚")
    expect(relativeTime(now-500,now)).toBe("刚刚")
    expect(relativeTime(now-1000,now)).toBe("1秒前")
    expect(relativeTime(now-1000*60,now)).toBe("1分钟前")
    expect(relativeTime(now-1000*60*60,now)).toBe("1小时前")
    expect(relativeTime(now-1000*60*60*24,now)).toBe("1天前")
    expect(relativeTime(now-1000*60*60*24*13,now)).toBe("1周前")
    expect(relativeTime(now-1000*60*60*24*30,now)).toBe("1个月前")
    expect(relativeTime(now-1000*60*60*24*30*3,now)).toBe("3个月前")
    expect(relativeTime(now-1000*60*60*24*365 ,now)).toBe("1年前")    
    expect(relativeTime(now+1000,now)).toBe("1秒后")
    expect(relativeTime(now+1000*60,now)).toBe("1分钟后")
    expect(relativeTime(now+1000*60*60,now)).toBe("1小时后")
    expect(relativeTime(now+1000*60*60*24,now)).toBe("1天后")
    expect(relativeTime(now+1000*60*60*24*30,now)).toBe("1个月后")
    expect(relativeTime(now+1000*60*60*24*30*12,now)).toBe("12个月后")
    expect(relativeTime(now+1000*60*60*24*365,now)).toBe("1年后")
})
test("toChineseNumber",()=>{
    expect(toChineseNumber("1")).toBe("一")
    expect(toChineseNumber("12")).toBe("十二")
    expect(toChineseNumber("123")).toBe("一百二十三")
    expect(toChineseNumber("1234")).toBe("一千二百三十四")
    expect(toChineseNumber("12345")).toBe("一万二千三百四十五")
    expect(toChineseNumber("123456")).toBe("十二万三千四百五十六")
    expect(toChineseNumber("1234567")).toBe("一百二十三万四千五百六十七")
    expect(toChineseNumber("12345678")).toBe("一千二百三十四万五千六百七十八")
    expect(toChineseNumber("123456789")).toBe("一亿二千三百四十五万六千七百八十九")
    expect(toChineseNumber("1234567890")).toBe("十二亿三千四百五十六万七千八百九十")
    expect(toChineseNumber("12345678901")).toBe("一百二十三亿四千五百六十七万八千九百零一")
    expect(toChineseNumber("123456789012")).toBe("一千二百三十四亿五千六百七十八万九千零一十二")
    expect(toChineseNumber("1234567890123")).toBe("一兆二千三百四十五亿六千七百八十九万零一百二十三")
    expect(toChineseNumber("12345678901234")).toBe("十二兆三千四百五十六亿七千八百九十万一千二百三十四")
    expect(toChineseNumber("123456789012345")).toBe("一百二十三兆四千五百六十七亿八千九百零一万二千三百四十五")
    expect(toChineseNumber("1234567890123456")).toBe("一千二百三十四兆五千六百七十八亿九千零一十二万三千四百五十六")
    expect(toChineseNumber("12345678901234567")).toBe("一京二千三百四十五兆六千七百八十九亿零一百二十三万四千五百六十七")
    expect(toChineseNumber("123456789012345678")).toBe("十二京三千四百五十六兆七千八百九十亿一千二百三十四万五千六百七十八")
    // 大写
    expect(toChineseNumber("1",true)).toBe("壹") 
    expect(toChineseNumber("12",true)).toBe("拾贰")
    expect(toChineseNumber("123",true)).toBe("壹佰贰拾叁")
    expect(toChineseNumber("1234",true)).toBe("壹仟贰佰叁拾肆")
    expect(toChineseNumber("12345",true)).toBe("壹万贰仟叁佰肆拾伍")
    expect(toChineseNumber("123456",true)).toBe("拾贰万叁仟肆佰伍拾陆")
    expect(toChineseNumber("1234567",true)).toBe("壹佰贰拾叁万肆仟伍佰陆拾柒")
    expect(toChineseNumber("12345678",true)).toBe("壹仟贰佰叁拾肆万伍仟陆佰柒拾捌")
    expect(toChineseNumber("123456789",true)).toBe("壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖")
    expect(toChineseNumber("1234567890",true)).toBe("拾贰亿叁仟肆佰伍拾陆万柒仟捌佰玖拾")
    expect(toChineseNumber("12345678901",true)).toBe("壹佰贰拾叁亿肆仟伍佰陆拾柒万捌仟玖佰零壹")
    expect(toChineseNumber("123456789012",true)).toBe("壹仟贰佰叁拾肆亿伍仟陆佰柒拾捌万玖仟零壹拾贰")

    
})
test("toChineseCurrency",()=>{
    expect(toChineseCurrency("1.2")).toBe("一元二角")
    expect(toChineseCurrency("12.4")).toBe("十二元四角")
    expect(toChineseCurrency("1")).toBe("一元")
    expect(toChineseCurrency("12")).toBe("十二元")
    expect(toChineseCurrency("123")).toBe("一百二十三元")
    expect(toChineseCurrency("1234")).toBe("一千二百三十四元")
    expect(toChineseCurrency("12345")).toBe("一万二千三百四十五元")
    expect(toChineseCurrency("123456")).toBe("十二万三千四百五十六元")
    expect(toChineseCurrency("1234567")).toBe("一百二十三万四千五百六十七元")
    expect(toChineseCurrency("12345678")).toBe("一千二百三十四万五千六百七十八元")
    expect(toChineseCurrency("123456789")).toBe("一亿二千三百四十五万六千七百八十九元")
    expect(toChineseCurrency("1234567890")).toBe("十二亿三千四百五十六万七千八百九十元")
    expect(toChineseCurrency("12345678901")).toBe("一百二十三亿四千五百六十七万八千九百零一元")
    expect(toChineseCurrency("123456789012")).toBe("一千二百三十四亿五千六百七十八万九千零一十二元")
    expect(toChineseCurrency("1234567890123")).toBe("一兆二千三百四十五亿六千七百八十九万零一百二十三元")
    expect(toChineseCurrency("12345678901234")).toBe("十二兆三千四百五十六亿七千八百九十万一千二百三十四元")
    expect(toChineseCurrency("123456789012345")).toBe("一百二十三兆四千五百六十七亿八千九百零一万二千三百四十五元")
    expect(toChineseCurrency("1234567890123456")).toBe("一千二百三十四兆五千六百七十八亿九千零一十二万三千四百五十六元")
    expect(toChineseCurrency("12345678901234567")).toBe("一京二千三百四十五兆六千七百八十九亿零一百二十三万四千五百六十七元")
    expect(toChineseCurrency("123456789012345678")).toBe("十二京三千四百五十六兆七千八百九十亿一千二百三十四万五千六百七十八元")
    // 大写
    expect(toChineseCurrency("1",{big:true})).toBe("壹元") 
    expect(toChineseCurrency("12",{big:true})).toBe("拾贰元")
    expect(toChineseCurrency("123",{big:true})).toBe("壹佰贰拾叁元")
    expect(toChineseCurrency("1234",{big:true})).toBe("壹仟贰佰叁拾肆元")
    expect(toChineseCurrency("12345",{big:true})).toBe("壹万贰仟叁佰肆拾伍元")
    expect(toChineseCurrency("123456",{big:true})).toBe("拾贰万叁仟肆佰伍拾陆元")
    expect(toChineseCurrency("1234567",{big:true})).toBe("壹佰贰拾叁万肆仟伍佰陆拾柒元")
    expect(toChineseCurrency("12345678",{big:true})).toBe("壹仟贰佰叁拾肆万伍仟陆佰柒拾捌元")
    expect(toChineseCurrency("123456789",{big:true})).toBe("壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元")
    expect(toChineseCurrency("1234567890",{big:true})).toBe("拾贰亿叁仟肆佰伍拾陆万柒仟捌佰玖拾元")
    expect(toChineseCurrency("12345678901",{big:true})).toBe("壹佰贰拾叁亿肆仟伍佰陆拾柒万捌仟玖佰零壹元")
    expect(toChineseCurrency("123456789012",{big:true})).toBe("壹仟贰佰叁拾肆亿伍仟陆佰柒拾捌万玖仟零壹拾贰元")
})
// test("parseTags", () => {
//     expect(parseTags("a{1}{2}")).toEqual(["1", "2"])
//     expect(parseTags("a<div>1</div><div>2</div>")).toEqual(["1", "2"])
//     expect(parseTags("a<div><div>1</div><div><div>2</div>")).toEqual(["1", "2"])
// })
