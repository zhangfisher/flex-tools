// 改变成员类型
export type ChangeFieldType<Record,Name extends string,Type=any> = Omit<Record,Name> & {
    [K in Name]:Type
}