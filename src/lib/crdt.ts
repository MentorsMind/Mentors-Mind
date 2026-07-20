/**
 * Conflict-free Replicated Data Types (CRDT) for collaborative text editing
 * Uses Last-Write-Wins (LWW) strategy for conflict resolution
 */

export interface LWWRegisterValue<T> {
  value: T;
  timestamp: number;
  userId: string;
}

export class LWWRegister<T> {
  value: T;
  timestamp: number;
  userId: string;

  constructor(value: T, timestamp: number = Date.now(), userId: string = '') {
    this.value = value;
    this.timestamp = timestamp;
    this.userId = userId;
  }

  static merge<T>(a: LWWRegister<T>, b: LWWRegister<T>): LWWRegister<T> {
    if (a.timestamp > b.timestamp) {
      return new LWWRegister(a.value, a.timestamp, a.userId);
    } else if (b.timestamp > a.timestamp) {
      return new LWWRegister(b.value, b.timestamp, b.userId);
    } else {
      // Tie-breaker: use userId lexicographic order for deterministic merge
      if (a.userId > b.userId) {
        return new LWWRegister(a.value, a.timestamp, a.userId);
      } else {
        return new LWWRegister(b.value, b.timestamp, b.userId);
      }
    }
  }

  clone(): LWWRegister<T> {
    return new LWWRegister(this.value, this.timestamp, this.userId);
  }
}

export interface CharPosition {
  char: string;
  timestamp: number;
  userId: string;
}

export class LWWMap {
  private positions: Map<number, LWWRegister<CharPosition>>;

  constructor(initialText: string = '', userId: string = '') {
    this.positions = new Map();
    const now = Date.now();
    for (let i = 0; i < initialText.length; i++) {
      this.positions.set(i, new LWWRegister(
        { char: initialText[i], timestamp: now, userId },
        now,
        userId
      ));
    }
  }

  getText(): string {
    const chars: string[] = [];
    const sortedIndices = Array.from(this.positions.keys()).sort((a, b) => a - b);
    for (const idx of sortedIndices) {
      chars.push(this.positions.get(idx)!.value.char);
    }
    return chars.join('');
  }

  setText(text: string, userId: string): void {
    const now = Date.now();
    this.positions.clear();
    for (let i = 0; i < text.length; i++) {
      this.positions.set(i, new LWWRegister(
        { char: text[i], timestamp: now, userId },
        now,
        userId
      ));
    }
  }

  insertChar(index: number, char: string, userId: string): void {
    const now = Date.now();
    const newPositions = new Map<number, LWWRegister<CharPosition>>();
    
    // Shift all positions >= index by 1
    for (const [idx, reg] of this.positions) {
      if (idx < index) {
        newPositions.set(idx, reg);
      } else {
        newPositions.set(idx + 1, reg);
      }
    }
    
    // Insert new character
    newPositions.set(index, new LWWRegister(
      { char, timestamp: now, userId },
      now,
      userId
    ));
    
    this.positions = newPositions;
  }

  deleteChar(index: number, userId: string): void {
    if (!this.positions.has(index)) return;
    
    const now = Date.now();
    const newPositions = new Map<number, LWWRegister<CharPosition>>();
    
    // Mark character as deleted (empty string) with current timestamp
    const deletedReg = this.positions.get(index)!;
    newPositions.set(index, new LWWRegister(
      { char: '', timestamp: now, userId },
      now,
      userId
    ));
    
    // Shift all positions > index by -1
    for (const [idx, reg] of this.positions) {
      if (idx > index) {
        newPositions.set(idx - 1, reg);
      } else if (idx < index) {
        newPositions.set(idx, reg);
      }
    }
    
    this.positions = newPositions;
  }

  merge(other: LWWMap): LWWMap {
    const result = new LWWMap();
    result.positions.clear();
    
    const allIndices = new Set([
      ...Array.from(this.positions.keys()),
      ...Array.from(other.positions.keys())
    ]);
    
    for (const idx of allIndices) {
      const a = this.positions.get(idx);
      const b = other.positions.get(idx);
      
      if (a && b) {
        result.positions.set(idx, LWWRegister.merge(a, b));
      } else if (a) {
        result.positions.set(idx, a.clone());
      } else if (b) {
        result.positions.set(idx, b.clone());
      }
    }
    
    return result;
  }

  toJSON(): Record<number, LWWRegisterValue<CharPosition>> {
    const obj: Record<number, LWWRegisterValue<CharPosition>> = {};
    for (const [idx, reg] of this.positions) {
      obj[idx] = {
        value: reg.value,
        timestamp: reg.timestamp,
        userId: reg.userId
      };
    }
    return obj;
  }

  static fromJSON(data: Record<number, LWWRegisterValue<CharPosition>>): LWWMap {
    const map = new LWWMap();
    map.positions.clear();
    for (const [idx, regData] of Object.entries(data)) {
      const index = parseInt(idx, 10);
      map.positions.set(index, new LWWRegister(
        regData.value,
        regData.timestamp,
        regData.userId
      ));
    }
    return map;
  }

  clone(): LWWMap {
    const cloned = new LWWMap();
    cloned.positions = new Map(
      Array.from(this.positions.entries()).map(([k, v]) => [k, v.clone()])
    );
    return cloned;
  }
}

/**
 * Pure function to merge two LWWRegister values
 */
export function mergeLWWRegisters<T>(a: LWWRegister<T>, b: LWWRegister<T>): LWWRegister<T> {
  return LWWRegister.merge(a, b);
}

/**
 * Merge two LWWMap instances and return a new merged map
 */
export function mergeLWWMaps(a: LWWMap, b: LWWMap): LWWMap {
  return a.merge(b);
}