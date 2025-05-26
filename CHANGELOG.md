## <small>1.0.58 (2023-02-27)</small>

## 1.5.1

### Patch Changes

- 881b48f: fix WeakObjectMap exports
- 43ffdd6: fix DeepOptional type
- 4e66624: fix DeepRequired type

## 1.5.0

### Minor Changes

- ac246ac: - 🛠 重构`Typescript`文档
  - 🔥 新增加`Expand<T>`用来合并组合类型
  - 🔥 `ObjectKeyPaths`和`GetTypeByPath`现在支持自定义路径分隔符
  - 🔥 新增加`syncFunction`类型
  - 🔥 新增加`Unique<T>`类型用于类型数组的去重
  - 🔥 新增加`Fallback<T,F>`类型用于当`T=never`时返回`F`类型

## 1.4.45

### Patch Changes

- a5f8194: add object/WeakObjectMap and upgeade target to es2021

## 1.4.44

### Patch Changes

- 9ff5bf2: 修复 remove 函数的返回值类型
- 7181502: 优化 array/remove 函数

## 1.4.43

### Patch Changes

- 680aab5: fix trimChars types error

## 1.4.42

### Patch Changes

- 7e5bfd9: fix trimChars export error

## 1.4.41

### Patch Changes

- cf19fb6: fix export error

## 1.4.40

### Patch Changes

- faf90d5: fix index export error
- 4e9bdf9: update setbypath

## 1.4.39

### Patch Changes

- f6503b3: fix: remove get/set and add getByPath/setByPath

## 1.4.39

### Patch Changes

- d16b138: add setByPath
- eb8f6cc: fix setByPath

## 1.4.38

### Patch Changes

- 21b0ada: fix getClassStaticValue defaultValue

## 1.4.37

### Patch Changes

- 1e4167e: upgrage getClassStaticValue

## 1.4.36

### Patch Changes

- 478b9cc: 新增加 encodeRegExp 和 escapeRegex

## 1.4.35

### Patch Changes

- 09b565d: lock art-template version to 4.13.2

## 1.4.34

### Patch Changes

- 102ebc1: 修复在某此环境 fs/copyFiles 出现 lib/index 导入错误的问题

## 1.4.33

### Patch Changes

- d7d096f: getPackageJson 的 findUp 默认设为 true

## 1.4.31

### Patch Changes

- 48751bf: feat: add readJsonFile/writeJsonFile/trimChars func

## 1.4.30

### Patch Changes

- 4bd6622: getPackageJson 增加了一个 findUp 参数用来确认是否从当前路径向上

## 1.4.29

### Patch Changes

- 2863e25: fix: liteEvent & flexEvent set option<objectify> default value to true

## 1.4.28

### Patch Changes

- 736dd3f: fix: copyFiles support dot file

## 1.4.27

### Patch Changes

- 6a64b4b: fix copyFiles

## 1.4.26

### Patch Changes

- df29143: add copyDirs/copyFiles option<templateOptions>

## 1.4.25

### Patch Changes

- 91f2eaf: add getDynamicValue

## 1.4.24

### Patch Changes

- 27afd49: copyDirs 和 copyFiles 增加 overwrite 和 vars 参数
- 97a6778: fix copyDirs/copyFiles vars types

## 1.4.23

### Patch Changes

- 0cd657c: fix fs exports error
- ecd152d: fix includePath ref error

## 1.4.22

### Patch Changes

- 4c0cd1b: add getPackageReleaseInfo/getPackageModuleType
- 1ae35ed: fix type error

## 1.4.21

### Patch Changes

- efef64b: add getExistedDir

## 1.4.20

### Patch Changes

- 1853392: fix package error

## 1.4.19

### Patch Changes

- 358d878: 修复 typecheck 类型导出错误

## 1.4.18

### Patch Changes

- b2187b2: fix

## 1.4.17

### Patch Changes

- a782b59: add GetTypeByPath and ObjectKeyPaths
- b4bb2e4: add isNumberLike and Primitive
- e4ffa45: feat: add FixedRecord type

## 1.4.16

### Patch Changes

- d1a8e12: feat: add emitAsync on liteEvent

## 1.4.15

### Patch Changes

- 44c4f82: 修复 liteEvent 的类型错误

## 1.4.14

### Patch Changes

- 716baaa: fix string exports error

## 1.4.13

### Patch Changes

- 8abddea: feat: add fs/copyFiles

## 1.4.12

### Patch Changes

- 8a3d3ac: 修复 isAsyncFunction 类型断言错误
- 39664f7: fix script
- c58e58f: add event type support to FlexEvent

* -feat(misc) : 新增`parseTimeDuration`和`parseFileSize` ([33dba6e](https://github.com/zhangfisher/flex-tools/commit/33dba6e))
* 1.0.55 ([d09c1b6](https://github.com/zhangfisher/flex-tools/commit/d09c1b6))
* 1.0.56 ([080c287](https://github.com/zhangfisher/flex-tools/commit/080c287))
* 1.0.57 ([9418ef7](https://github.com/zhangfisher/flex-tools/commit/9418ef7))
* 1.0.58 ([1552e22](https://github.com/zhangfisher/flex-tools/commit/1552e22))
* update ([f6c2b2d](https://github.com/zhangfisher/flex-tools/commit/f6c2b2d))
* update ([24227ad](https://github.com/zhangfisher/flex-tools/commit/24227ad))
* update docs ([c71bb19](https://github.com/zhangfisher/flex-tools/commit/c71bb19))
* ffd(dfdf): fdf ([00de9f8](https://github.com/zhangfisher/flex-tools/commit/00de9f8))

## <small>1.0.58 (2023-02-27)</small>

- -feat(misc) : 新增`parseTimeDuration`和`parseFileSize` ([33dba6e](https://github.com/zhangfisher/flex-tools/commit/33dba6e))
- 1.0.55 ([d09c1b6](https://github.com/zhangfisher/flex-tools/commit/d09c1b6))
- 1.0.56 ([080c287](https://github.com/zhangfisher/flex-tools/commit/080c287))
- 1.0.57 ([9418ef7](https://github.com/zhangfisher/flex-tools/commit/9418ef7))
- 1.0.58 ([1552e22](https://github.com/zhangfisher/flex-tools/commit/1552e22))
- update ([f6c2b2d](https://github.com/zhangfisher/flex-tools/commit/f6c2b2d))
- update ([24227ad](https://github.com/zhangfisher/flex-tools/commit/24227ad))
- update docs ([c71bb19](https://github.com/zhangfisher/flex-tools/commit/c71bb19))
- ffd(dfdf): fdf ([00de9f8](https://github.com/zhangfisher/flex-tools/commit/00de9f8))
