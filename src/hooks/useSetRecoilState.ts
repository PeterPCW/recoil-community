import { useCallback } from 'react';
import { useRecoilMutableSource, RecoilState } from '../RecoilRoot';

/**
 * useSetRecoilState - Get only the setter function for an atom
 * 
 * Returns only the setter function, without the current value.
 * Useful when you only need to update state, not read it.
 * 
 * @example
 * const setCount = useSetRecoilState(countAtom);
 * 
 * function IncrementButton() {
 *   const setCount = useSetRecoilState(countAtom);
 *   return <button onClick={() => setCount(c => c + 1)}>Increment</button>;
 * }
 */
export function useSetRecoilState<T>(
  state: RecoilState<T>
): (newValue: T | ((prevValue: T) => T)) => void {
  const mutableSource = useRecoilMutableSource();
  
  return useCallback((update: T | ((prevValue: T) => T)) => {
    if (typeof update === 'function') {
      const currentValue = mutableSource.getState(state);
      const newValue = (update as (prev: T) => T)(currentValue);
      mutableSource.setState(state, newValue);
    } else {
      mutableSource.setState(state, update);
    }
  }, [mutableSource, state]);
}
