import { describe, it, expect } from 'vitest';
import { getByPath } from '../object/getByPath';

describe('getByPath',async  () => {
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

    it('should get a value from a nested object', () => {
        expect(getByPath(obj, 'a.b.0.c')).toBe(42);
    });

    it('should return default value if path is invalid', () => {
        expect(getByPath(obj, 'a.b.1.c', { default: 'default value' })).toBe('default value');
    });

    it('should support custom delimiter', () => {
        expect(getByPath(obj, 'a|b|0|c', { delimiter: '|' })).toBe(42);
    });

    it('should get a value from a Map', () => {
        expect(getByPath(obj, 'map.key')).toBe('value');
    });

    it('should return default value for missing Map key', () => {
        expect(getByPath(obj, 'map.nonexistent', { default: 'not found' })).toBe('not found');
    });

    it('should get a value from a Set by index', () => {
        expect(getByPath(obj, 'set.1')).toBe(2);
    });

    it('should return default value for invalid Set index', () => {
        expect(getByPath(obj, 'set.10', { default: 'not found' })).toBe('not found');
    });

    it('should handle deeply nested arrays', () => {
        expect(getByPath(obj, 'nested.array.2.deep')).toBe('value');
    });

    it('should return default value if object is null or undefined', () => {
        expect(getByPath(null, 'a.b', { default: 'default value' })).toBe('default value');
        expect(getByPath(undefined, 'a.b', { default: 'default value' })).toBe('default value');
    });

    it('should return default value if path is not a string', () => {
        expect(getByPath(obj, null as unknown as string, { default: 'default value' })).toBe('default value');
    });
});