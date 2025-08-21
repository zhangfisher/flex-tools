import path from 'node:path'
import { getPackageRootPath } from './getPackageRootPath'
import fs from 'node:fs'

/**
 * 返回当前项目所使用的包管理工具
 * @returns
 */
// 缓存项目的包管理工具，避免重复检查
const packageToolCache = new Map<string, ('pnpm' | 'npm' | 'yarn')[]>();

export function getPackageTool(): ('pnpm' | 'npm' | 'yarn')[] {
    const cwd = process.cwd();
    
    // 优化1: 使用缓存避免重复计算
    if (packageToolCache.has(cwd)) {
        return packageToolCache.get(cwd)!;
    }
    
    const projectFolder = getPackageRootPath(cwd);
    if (projectFolder == null) {
        throw new Error('未发现package.json,当前工程不是NPM项目');
    }
    
    const tools: ('pnpm' | 'npm' | 'yarn')[] = [];
    
    // 优化2: 一次性检查所有锁文件，避免多次文件系统操作
    const pnpmLockExists = fs.existsSync(path.join(projectFolder, 'pnpm-lock.yaml'));
    const yarnLockExists = !pnpmLockExists && fs.existsSync(path.join(projectFolder, 'yarn.lock'));
    
    if (pnpmLockExists) {
        tools.push('pnpm');
    } else if (yarnLockExists) {
        tools.push('yarn');
    } else {
        tools.push('npm');
    }
    
    // 保存到缓存
    packageToolCache.set(cwd, tools);
    
    return tools;
}
