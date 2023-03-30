import { test,expect} from "vitest"

import {  parseFileSize, parseTimeDuration } from "../src/misc"
import { formatDateTime } from '../src/misc/formatDateTime';



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