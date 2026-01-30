/**
 * RecoilState represents a piece of state in the Recoil data-flow graph.
 * 
 * RecoilState can be either:
 * - An Atom: A writable piece of state that can be directly updated
 * - A Selector: A read-only derived value computed from other RecoilState
 */
export type RecoilState<T> = {
  _isAtom?: true;
  _isSelector?: true;
  key: string;
  default?: T | RecoilValue<T> | (() => T);
};

/**
 * RecoilValue represents a read-only piece of state.
 * This is the base type for both Atoms and Selectors when read.
 */
export type RecoilValue<T> = RecoilState<T>;

/**
 * Read-only RecoilValue (returned by selectors)
 */
export interface RecoilValueReadOnly<T> {
  readonly key: string;
  readonly _value?: T;
}

/**
 * Loadable represents the current state of a Recoil value.
 * It can be in one of three states:
 * - hasValue: The value is available
 * - hasError: An error occurred while computing the value
 * - loading: The value is still being computed
 */
export type Loadable<T> =
  | { state: 'hasValue'; contents: T }
  | { state: 'hasError'; contents: Error }
  | { state: 'loading'; contents: T | undefined };

/**
 * Check if a loadable has a value
 */
export function isLoadable<T>(loadable: Loadable<T>): loadable is { state: 'hasValue'; contents: T } {
  return loadable.state === 'hasValue';
}

/**
 * Check if a loadable has an error
 */
export function isLoadableError<T>(loadable: Loadable<T>): loadable is { state: 'hasError'; contents: Error } {
  return loadable.state === 'hasError';
}

/**
 * Check if a loadable is loading
 */
export function isLoadableLoading<T>(loadable: Loadable<T>): loadable is { state: 'loading'; contents: T | undefined } {
  return loadable.state === 'loading';
}
