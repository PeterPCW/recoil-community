import { useRecoilMutableSource } from '../RecoilRoot';
import type { RecoilState } from '../RecoilState';
import type { Atom, AtomOptions } from '../Atom';

/**
 * Callback options for useRecoilCallback
 */
export interface CallbackOptions {
  /** Get the current value of an atom or selector */
  get<T>(state: RecoilState<T> | import('../RecoilState').RecoilValue<T>): T;
  
  /** Set an atom's value */
  set<T>(state: Atom<T>, newValue: T): void;
  
  /** Refresh any subscribed selectors */
  refresh<T>(state: RecoilState<T>): void;
}

/**
 * Snapshot of Recoil state at a point in time
 */
export interface Snapshot {
  /** Get value from snapshot */
  getLoadable<T>(state: RecoilState<T>): import('../RecoilState').Loadable<T>;
}

/**
 * useRecoilCallback - Create a callback with Recoil access
 * 
 * Creates a callback function that can access Recoil state.
 * Useful for event handlers, setTimeout, etc.
 * 
 * @example
 * const incrementCount = useRecoilCallback(({ set }) => () => {
 *   set(countAtom, c => c + 1);
 * });
 * 
 * function MyComponent() {
 *   return <button onClick={incrementCount}>+1</button>;
 * }
 * 
 * @example
 * // With snapshot
 * const fetchUser = useRecoilCallback(async ({ get, set }) => {
 *   const userId = get(currentUserIdAtom);
 *   const user = await fetchUserAPI(userId);
 *   set(userAtom, user);
 * });
 */
export function useRecoilCallback<Args extends unknown[], Result>(
  fn: (options: CallbackOptions, snapshot: Snapshot) => (...args: Args) => Result,
  deps: React.DependencyList
): (...args: Args) => Result {
  const recoilMutableSource = useRecoilMutableSource();
  
  return (...args: Args): Result => {
    const callbackOptions: CallbackOptions = {
      get: <T>(state: RecoilState<T>) => {
        throw new Error('get requires implementation');
      },
      set: <T>(state: RecoilState<T>, newValue: T) => {
        console.log('set:', state.key, newValue);
      },
      refresh: <T>(state: RecoilState<T>) => {
        console.log('refresh:', state.key);
      },
    };
    
    const snapshot: Snapshot = {
      getLoadable: <T>(state: RecoilState<T>) => {
        throw new Error('getLoadable requires implementation');
      },
    };
    
    return fn(callbackOptions, snapshot)(...args);
  };
}
