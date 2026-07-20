import { describe, it, expect } from 'vitest';
import { LWWRegister, LWWMap, mergeLWWRegisters, mergeLWWMaps } from './crdt';

describe('LWWRegister', () => {
  it('should create a register with default values', () => {
    const reg = new LWWRegister('test');
    expect(reg.value).toBe('test');
    expect(reg.timestamp).toBeGreaterThan(0);
    expect(reg.userId).toBe('');
  });

  it('should create a register with custom values', () => {
    const reg = new LWWRegister('test', 1000, 'user1');
    expect(reg.value).toBe('test');
    expect(reg.timestamp).toBe(1000);
    expect(reg.userId).toBe('user1');
  });

  it('should clone a register', () => {
    const reg = new LWWRegister('test', 1000, 'user1');
    const cloned = reg.clone();
    expect(cloned.value).toBe('test');
    expect(cloned.timestamp).toBe(1000);
    expect(cloned.userId).toBe('user1');
    expect(cloned).not.toBe(reg);
  });

  it('should merge registers and pick the one with higher timestamp', () => {
    const reg1 = new LWWRegister('first', 1000, 'user1');
    const reg2 = new LWWRegister('second', 2000, 'user2');
    const merged = LWWRegister.merge(reg1, reg2);
    expect(merged.value).toBe('second');
    expect(merged.timestamp).toBe(2000);
    expect(merged.userId).toBe('user2');
  });

  it('should merge registers and pick the first when timestamps are equal and userId is greater', () => {
    const reg1 = new LWWRegister('first', 1000, 'user2');
    const reg2 = new LWWRegister('second', 1000, 'user1');
    const merged = LWWRegister.merge(reg1, reg2);
    expect(merged.value).toBe('first');
    expect(merged.userId).toBe('user2');
  });

  it('should merge registers and pick the second when timestamps are equal and userId is smaller', () => {
    const reg1 = new LWWRegister('first', 1000, 'user1');
    const reg2 = new LWWRegister('second', 1000, 'user2');
    const merged = LWWRegister.merge(reg1, reg2);
    expect(merged.value).toBe('second');
    expect(merged.userId).toBe('user2');
  });

  it('mergeLWWRegisters should be a pure function', () => {
    const reg1 = new LWWRegister('first', 1000, 'user1');
    const reg2 = new LWWRegister('second', 2000, 'user2');
    const merged1 = mergeLWWRegisters(reg1, reg2);
    const merged2 = mergeLWWRegisters(reg1, reg2);
    expect(merged1).toEqual(merged2);
    expect(merged1).not.toBe(merged2);
  });
});

describe('LWWMap', () => {
  it('should create an empty map', () => {
    const map = new LWWMap();
    expect(map.getText()).toBe('');
  });

  it('should create a map with initial text', () => {
    const map = new LWWMap('hello', 'user1');
    expect(map.getText()).toBe('hello');
  });

  it('should insert a character at the beginning', () => {
    const map = new LWWMap('bc', 'user1');
    map.insertChar(0, 'a', 'user1');
    expect(map.getText()).toBe('abc');
  });

  it('should insert a character in the middle', () => {
    const map = new LWWMap('ac', 'user1');
    map.insertChar(1, 'b', 'user1');
    expect(map.getText()).toBe('abc');
  });

  it('should insert a character at the end', () => {
    const map = new LWWMap('ab', 'user1');
    map.insertChar(2, 'c', 'user1');
    expect(map.getText()).toBe('abc');
  });

  it('should delete a character', () => {
    const map = new LWWMap('abc', 'user1');
    map.deleteChar(1, 'user1');
    expect(map.getText()).toBe('ac');
  });

  it('should set text', () => {
    const map = new LWWMap('abc', 'user1');
    map.setText('xyz', 'user2');
    expect(map.getText()).toBe('xyz');
  });

  it('should merge two maps', () => {
    const map1 = new LWWMap('abc', 'user1');
    const map2 = new LWWMap('abd', 'user2');
    const merged = map1.merge(map2);
    // The merge should pick the character with the higher timestamp at each position
    expect(merged.getText()).toBe('abd');
  });

  it('should serialize and deserialize', () => {
    const map = new LWWMap('hello', 'user1');
    map.insertChar(5, '!', 'user1');
    const json = map.toJSON();
    const restored = LWWMap.fromJSON(json);
    expect(restored.getText()).toBe('hello!');
  });

  it('should clone a map', () => {
    const map = new LWWMap('abc', 'user1');
    const cloned = map.clone();
    expect(cloned.getText()).toBe('abc');
    expect(cloned).not.toBe(map);
  });

  it('mergeLWWMaps should be a pure function', () => {
    const map1 = new LWWMap('abc', 'user1');
    const map2 = new LWWMap('abd', 'user2');
    const merged1 = mergeLWWMaps(map1, map2);
    const merged2 = mergeLWWMaps(map1, map2);
    expect(merged1.getText()).toBe(merged2.getText());
    expect(merged1).not.toBe(merged2);
  });

  it('should handle concurrent inserts from different users', () => {
    const map1 = new LWWMap('ac', 'user1');
    const map2 = new LWWMap('bc', 'user2');
    
    // Both users insert at position 1 at roughly the same time
    map1.insertChar(1, 'b', 'user1');
    map2.insertChar(1, 'a', 'user2');
    
    const merged = map1.merge(map2);
    // The result should be deterministic based on timestamps
    expect(merged.getText().length).toBe(3);
    expect(merged.getText().charAt(0)).toBe('a');
  });

  it('should handle delete and insert operations', () => {
    const map1 = new LWWMap('abc', 'user1');
    const map2 = new LWWMap('abc', 'user2');
    
    map1.deleteChar(1, 'user1'); // deletes 'b'
    map2.insertChar(1, 'x', 'user2'); // inserts 'x' at position 1
    
    const merged = map1.merge(map2);
    // Result depends on timestamps, but should be consistent
    expect(merged.getText().length).toBe(3);
  });
});