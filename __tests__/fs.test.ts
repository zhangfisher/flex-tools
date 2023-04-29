import { test, expect, describe } from 'vitest';
import {forEachUp} from "../src/fs/forEachUp"
import path from 'path';
import { findUp } from '../src/fs/findUp';
import { fileMatcher } from "../src/fs/fileMatcher"


describe("文件操作测试",()=>{

    test("向上遍历祖先文件夹",()=>{
        let results:string[] = []
        forEachUp((f:string)=>{
            results.push(f)
        },{base:path.join(__dirname,"../src/fs")})
     })

     test("向上查找文件",()=>{
        let results = findUp(["package.json"] ,{entry:path.join(__dirname,"../src/fs")})
        expect(results.length).toBe(1)
     })

     test("fileMatcher",()=>{
        const base = path.join(__dirname,"../src")
        let matcher = fileMatcher([
            "*.ts", 
            "!*.test.ts",           
            "!events/"
        ],{
            base
        })

        expect(matcher.test("index.ts")).toBe(true)
        expect(matcher.test("fs/forEachUp.ts")).toBe(true)
        expect(matcher.test("events/index.ts")).toBe(false)


     })
})
 