import { describe, expect, test } from 'vitest';
import { getByPath } from '../src/object/getByPath';

describe('getByPath', async () => {
    const obj = {
        a: {
            b: [
                { c: 42 }
            ]
        },
        map: new Map([['key', 'value']]),
        set: new Set([1, 2, 3]),
        nested: {
            array: [10, 20, { deep: 'value' }]
        }
    };

    test('should get a value from a nested object', () => {
        expect(getByPath(obj, 'a.b.0.c')).toBe(42);
    });

    test('should return default value if path is invalid', () => {
        expect(getByPath(obj, 'a.b.1.c', { defaultValue: 'default value' })).toBe('default value');
    });

    test('should support custom delimiter', () => {
        expect(getByPath(obj, 'a|b|0|c', { delimiter: '|' })).toBe(42);
    });

    test('should get a value from a Map', () => {
        expect(getByPath(obj, 'map.key')).toBe('value');
    });

    test('should return default value for missing Map key', () => {
        expect(getByPath(obj, 'map.nonexistent', { defaultValue: 'not found' })).toBe('not found');
    });

    test('should get a value from a Set by index', () => {
        expect(getByPath(obj, 'set.1')).toBe(2);
    });

    test('should return default value for invalid Set index', () => {
        expect(getByPath(obj, 'set.10', { defaultValue: 'not found' })).toBe('not found');
    });

    test('should handle deeply nested arrays', () => {
        expect(getByPath(obj, 'nested.array.2.deep')).toBe('value');
    });

    test('should return default value if object is null or undefined', () => {
        expect(getByPath(null, 'a.b', { defaultValue: 'default value' })).toBe('default value');
        expect(getByPath(undefined, 'a.b', { defaultValue: 'default value' })).toBe('default value');
    });

    test('should return default value if path is not a string', () => {
        expect(getByPath(obj, null as unknown as string, { defaultValue: 'default value' })).toBe('default value');
    });

    test("getByPath的匹配回调", () => {
        const obj = {
            a: {
                b1: { b11: 1, b12: 2 },
                b2: { b21: 1, b22: 2 },
                b3: [
                    { b31: 13, b32: 23 },
                    { b31: 14, b32: 24 }
                ]
            },
            x: 1,
            y: [1, 2, 3, 4, 5, { m: 1, n: 2 }],
            z: [1, 2, 3, new Set([1, 2, 3, 4, 5])],
            services: null
        }

        getByPath(obj, "a.b1.b11", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(1)
                expect(parent).toEqual({ b11: 1, b12: 2 })
                expect(indexOrKey).toEqual("b11")
            }
        })

        getByPath(obj, "a.b3.0.b31", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(13)
                expect(parent).toEqual({ b31: 13, b32: 23 })
                expect(indexOrKey).toEqual("b31")
            }
        })
        getByPath(obj, "a.b3.1.b31", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(14)
                expect(parent).toEqual({ b31: 14, b32: 24 })
                expect(indexOrKey).toEqual("b31")
            }
        })
        getByPath(obj, "a.b3.1.b32", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(24)
                expect(parent).toEqual({ b31: 14, b32: 24 })
                expect(indexOrKey).toEqual("b32")
            }
        })
        getByPath(obj, "a.b3.1.b31", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(14)
                expect(parent).toEqual({ b31: 14, b32: 24 })
                expect(indexOrKey).toEqual("b31")
            }
        })
        getByPath(obj, "a.b3.1.b32", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(24)
                expect(parent).toEqual({ b31: 14, b32: 24 })
                expect(indexOrKey).toEqual("b32")
            }
        })
        getByPath(obj, "x", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(1)
                expect(parent).toEqual(obj)
                expect(indexOrKey).toEqual("x")
            }
        })
        getByPath(obj, "y.0", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(1)
                expect(parent).toEqual([1, 2, 3, 4, 5, { m: 1, n: 2 }])
                expect(indexOrKey).toEqual(0)
            }
        })
        getByPath(obj, "y.1", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(2)
                expect(parent).toEqual([1, 2, 3, 4, 5, { m: 1, n: 2 }])
                expect(indexOrKey).toEqual(1)
            }
        })
        getByPath(obj, "y.5.m", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(1)
                expect(parent).toEqual({ m: 1, n: 2 })
                expect(indexOrKey).toEqual("m")
            }
        })
        getByPath(obj, "y.5.n", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(2)
            }
        })
        getByPath(obj, "z.3.0", {
            matched: ({ value, parent, indexOrKey }) => {
                expect(value).toEqual(1)
                expect(parent).toEqual(new Set([1, 2, 3, 4, 5]))
                expect(indexOrKey).toEqual(0)
            }
        })

        expect(getByPath(obj, "services.count", { defaultValue: 1 })).toBe(1)


    })
});