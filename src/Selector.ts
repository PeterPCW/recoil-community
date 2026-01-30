/**
 * Selector - A derived, read-only piece of state
 */
import type { RecoilState, RecoilValue, Loadable } from './RecoilState';
export type { RecoilState, RecoilValue, Loadable } from './RecoilState';

export interface Selector<T> {
  readonly _isSelector: true;
  readonly _isRecoilValue: true;
  readonly key: string;
  readonly _value: T;
  get: (getter: (atom: RecoilState<unknown>) => unknown) => T;
  set?: (newValue: T) => void;
}

export interface SelectorOptions<T> {
  key: string;
  get: (opts: { get: <T>(atom: RecoilState<T>) => T }) => T | Promise<T>;
  set?: (opts: { set: <T>(atom: RecoilState<T>, newValue: T) => void }, newValue: T) => void;
}

export type SelectorGet<T> = <U>(atom: RecoilState<U>) => U;
export type SelectorSet<T> = <U>(atom: RecoilState<U>, newValue: U) => void;

// Type guard
export function isSelector<T>(value: unknown): value is Selector<T> {
  return value !== null && typeof value === 'object' && '_isSelector' in (value as Selector<T>);
}

/**
 * Create a selector - a derived, read-only piece of state
 * 
 * @param options - Selector configuration options
 * @returns A Selector that computes its value from dependencies
 */
export function selector<T>(options: SelectorOptions<T>): Selector<T> {
  const { key, get, set } = options;
  
  return {
    _isSelector: true,
    _isRecoilValue: true,
    key,
    _value: undefined as unknown as T,
    get: (getter) => {
      return get({ get: getter } as { get: <U>(atom: RecoilState<U>) => U });
    },
    set: set as SelectorSet<T>,
  } as unknown as Selector<T>;
}
