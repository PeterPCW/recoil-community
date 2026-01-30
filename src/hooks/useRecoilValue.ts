import { useCallback } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type { RecoilState, RecoilValue } from '../RecoilState';
import { useRecoilMutableSource } from '../RecoilRoot';

/**
 * useRecoilValue - Get an atom or selector's value (read-only)
 * 
 * Subscribe to a Recoil state and return its current value.
 * Uses useSyncExternalStore for React 18 concurrent mode compatibility.
 * 
 * @example
 * const userName = useRecoilValue(userNameAtom);
 * 
 * function UserDisplay() {
 *   const userName = useRecoilValue(userNameAtom);
 *   return <span>{userName}</span>;
 * }
 */
export function useRecoilValue<T>(
  state: RecoilValue<T>
): T {
  const mutableSource = useRecoilMutableSource();
  
  // Cast to RecoilState for internal use
  const atom = state as RecoilState<T>;
  
  // Subscribe using useSyncExternalStore for concurrent mode
  const getSnapshot = useCallback(() => {
    return mutableSource.getState(atom);
  }, [mutableSource, atom]);
  
  const subscribe = useCallback((callback: () => void) => {
    return mutableSource.subscribe(atom, callback);
  }, [mutableSource, atom]);
  
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  );
}
