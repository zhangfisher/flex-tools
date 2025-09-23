// 将联合类型转换为元组类型
type UnionToTuple<T> = UnionToTupleRec<T, []>;

type UnionToTupleRec<T, R extends any[]> = [T] extends [never]
  ? R
  : UnionToTupleRec<Exclude<T, LastOfUnion<T>>, [LastOfUnion<T>, ...R]>;

// 获取联合类型的最后一个成员
type LastOfUnion<T> = UnionToIntersection<
  T extends any ? (x: T) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never;

// 将联合类型转换为交叉类型
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

export type Keys<T extends Record<string, any>> = UnionToTuple<keyof T>;
