import { useRecoilMutableSource } from '../RecoilRoot';
import { RecoilState } from '../RecoilState';

/**
 * useRecoilSnapshot - Get the current snapshot
 * 
 * Subscribe to a snapshot of the entire Recoil state tree.
 * 
 * @_UNSTABLE - This API is experimental and may change
 * 
 * @example
 * const snapshot = useRecoilSnapshot();
 * 
 * function DebugPanel() {
 *   const snapshot = useRecoilSnapshot();
 *   return (
 *     <pre>{JSON.stringify(snapshot.getContents(), null, 2)}</pre>
 *   );
 * }
 */
export function useRecoilSnapshot(): Snapshot {
  const recoilMutableSource = useRecoilMutableSource();
  
  // Placeholder - actual implementation returns snapshot
  return {
    getLoadable: <T>(state: RecoilState<T>) => {
      throw new Error('getLoadable requires implementation');
    },
    getContents: () => {
      return recoilMutableSource.getSnapshot() as Record<string, unknown>;
    },
  };
}

/**
 * Snapshot interface for accessing state
 */
export interface Snapshot {
  /** Get loadable value from snapshot */
  getLoadable<T>(state: RecoilState<T>): import('../RecoilState').Loadable<T>;
  
  /** Get the entire state tree (for debugging) */
  getContents(): Record<string, unknown>;
}
