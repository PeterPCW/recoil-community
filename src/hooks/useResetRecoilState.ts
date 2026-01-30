import { useCallback } from 'react';
import { useRecoilMutableSource, RecoilState } from '../RecoilRoot';

/**
 * useResetRecoilState - Reset an atom to its default value
 * 
 * Returns a function that resets the atom to its default value.
 * Useful for "reset form" or "clear state" functionality.
 * 
 * @example
 * const resetForm = useResetRecoilState(formAtom);
 * 
 * function ClearButton() {
 *   const resetForm = useResetRecoilState(formAtom);
 *   return <button onClick={resetForm}>Clear Form</button>;
 * }
 */
export function useResetRecoilState<T>(
  state: RecoilState<T>
): () => void {
  const mutableSource = useRecoilMutableSource();
  
  return useCallback(() => {
    mutableSource.setState(state, state.defaultValue);
  }, [mutableSource, state, state.defaultValue]);
}
