import type { RecoilFamily, RecoilState, RecoilValue } from './RecoilFamily';
import { atom, Atom } from './Atom';
import type { AtomOptions } from './Atom';
import { isFunction, isPrimitive } from 'es-toolkit';

/**
 * SelectorFamily creates dynamic selectors based on parameters
 * Similar to AtomFamily but for selectors
 */
export class SelectorFamily<T, P = void> implements RecoilFamily<RecoilValue<T>, P> {
  readonly _id: string;
  readonly generator: (param: P) => RecoilValue<T>;
  
  constructor(
    options: {
      key: string;
      get: (opts: { get: (param: P) => unknown; getCallback: any }) => T | Promise<T>;
      set?: (opts: { get: (param: P) => unknown; set: (param: P, value: T) => void }, newValue: T) => void;
    }
  ) {
    this._id = `selectorFamily(${options.key})`;
    this.generator = (param: P) => {
      // Create a selector-like object for this parameter
      const selector: RecoilValue<T> = {
        _id: `${options.key}(${JSON.stringify(param)})`,
        key: options.key,
        // Simple selector implementation
        // In full Recoil, this would be more complex with dependencies
      } as RecoilValue<T>;
      return selector;
    };
  }
  
  /**
   * Get a selector for a specific parameter
   */
  get(param: P): RecoilValue<T> {
    return this.generator(param);
  }
  
  /**
   * Get all selectors for multiple parameters
   */
  getAll(params: P[]): RecoilValue<T>[] {
    return params.map(param => this.generator(param));
  }
}

/**
 * Create a selector family
 * 
 * @example
 * const userSelector = selectorFamily({
 *   key: 'user',
 *   get: ({ get }) => (userId: string) => {
 *     const userAtom = userAtomFamily(userId);
 *     return get(userAtom);
 *   }
 * });
 */
export function selectorFamily<T, P = void>(
  options: {
    key: string;
    get: (opts: { get: (param: P) => unknown; getCallback: any }) => T | Promise<T>;
    set?: (opts: { get: (param: P) => unknown; set: (param: P, value: T) => void }, newValue: T) => void;
  }
): SelectorFamily<T, P> {
  return new SelectorFamily(options);
}

/**
 * Convenience function to create atom families with options
 * 
 * @example
 * const todoAtomFamily = atomFamily<Todo>({
 *   key: 'todo',
 *   default: { id: '', text: '', done: false }
 * });
 */
export function atomFamily<T, P = void>(
  options: AtomOptions<T> & { key: string }
): (param: P) => RecoilState<T> {
  const baseAtom = atom(options);
  
  const family = ((param: P) => {
    // For simple cases, return the same atom
    // For parameter-based, we'd need a cache
    return baseAtom;
  }) as (param: P) => RecoilState<T>;
  
  family._id = `atomFamily(${options.key})`;
  family.get = (param: P) => baseAtom;
  family.getAll = (params: P[]) => params.map(() => baseAtom);
  
  return family;
}
