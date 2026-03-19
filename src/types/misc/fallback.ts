
export type Fallback<T, F> =
    [T] extends [never] ? F :  // 处理never情况
    T extends undefined ? F :  // 处理undefined情况
    T;                                // 否则返回原类型
