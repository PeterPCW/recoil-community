import { useCallback } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type { RecoilState } from '../RecoilRoot';
import { useRecoilMutableSource } from '../RecoilRoot';

/**
 * useRecoilState - Get and set an atom's value
 * 
 * Returns a tuple of [value, setterFunction], similar to useState.
 * Uses useSyncExternalStore for React 18 concurrent mode compatibility.
 * 
 * @example
 * const [count, setCount] = useRecoilState(countAtom);
 * 
 * function Counter() {
 *   const [count, setCount] = useRecoilState(countAtom);
 *   return (
 *     <button onClick={() => setCount(count + 1)}>
 *       {count}
 *     </button>
 *   );
 * }
 */
export function useRecoilState<T>(
  state: RecoilState<T>
): [T, (newValue: T | ((prevValue: T) => T)) => void] {
  const mutableSource = useRecoilMutableSource();
  
  // Subscribe to state changes using useSyncExternalStore
  // This handles React 18 concurrent mode correctly
  const getSnapshot = useCallback(() => {
    return mutableSource.getState(state);
  }, [mutableSource, state]);
  
  const subscribe = useCallback((callback: () => void) => {
    return mutableSource.subscribe(state, callback);
  }, [mutableSource, state]);
  
  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  );
  
  // Setter function
  const setValue = useCallback((update: T | ((prevValue: T) => T)) => {
    if (typeof update === 'function') {
      // Handle updater function
      const currentValue = mutableSource.getState(state);
      const newValue = (update as (prev: T) => T)(currentValue);
      mutableSource.setState(state, newValue);
    } else {
      // Handle direct value
      mutableSource.setState(state, update);
    }
  }, [mutableSource, state]);
  
  return [value, setValue];
}
