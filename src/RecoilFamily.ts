import type { Atom, AtomOptions, AtomEffect } from './Atom';
import type { RecoilState, RecoilValue, RecoilValueReadOnly } from './RecoilState';

/**
 * RecoilFamily - Factory for creating dynamic atoms/selectors
 * 
 * AtomFamily and SelectorFamily create atoms/selectors on-demand
 * based on parameters. This is useful for lists/grids where each
 * item needs its own piece of state.
 * 
 * @example
 * const todoListFilterState = atomFamily({
 *   key: 'todoListFilter',
 *   default: 'all',
 * });
 * 
 * function TodoList({ filterId }) {
 *   const filter = useRecoilValue(todoListFilterState(filterId));
 *   // ...
 * }
 */
export type AtomFamily<T, P extends Parameters = never> = 
  P extends never
    ? Atom<T>
    : (param: P[0]) => RecoilState<T>;

export type SelectorFamily<T, P extends Parameters = never> = 
  P extends never
    ? import('./Selector').Selector<T>
    : (param: P[0]) => RecoilValueReadOnly<T>;

/**
 * Parameter types for families
 */
type Parameters = readonly [unknown];

/**
 * Options for creating an AtomFamily
 */
export interface AtomFamilyOptions<T, P> {
  key: string;
  default: T | RecoilValueReadOnly<T> | ((param: P) => T | RecoilValueReadOnly<T>);
  effects_UNSTABLE?: AtomEffect<T> | ((param: P) => AtomEffect<T>[]);
}

/**
 * Options for creating a SelectorFamily
 */
export interface SelectorFamilyOptions<T, P> {
  key: string;
  get: (opts: { get: <U>(atomOrSelector: import('./RecoilState').RecoilState<U> | import('./RecoilState').RecoilValue<U>) => U }, param: P) => T | Promise<T>;
  cachingStrategy_UNSTABLE?: 'volatile' | 'eventual' | 'persist';
}
