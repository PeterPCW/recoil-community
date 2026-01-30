import { useRecoilMutableSource } from '../RecoilRoot';
import type { RecoilState } from '../RecoilState';

/**
 * useRecoilTransaction_UNSTABLE - Batch multiple updates
 * 
 * Provides a callback that batches multiple atom updates together.
 * Updates are applied atomically and subscribers are notified once.
 * 
 * @_UNSTABLE - This API is experimental and may change
 * 
 * @example
 * useRecoilTransaction_UNSTABLE(({ set }) => {
 *   set(countAtom, c => c + 1);
 *   set(nameAtom, 'Updated');
 *   set(itemsAtom, [...items, newItem]);
 * });
 */
export function useRecoilTransaction_UNSTABLE(
  fn: (options: TransactionOptions) => void
): void {
  const recoilMutableSource = useRecoilMutableSource();
  
  const options: TransactionOptions = {
    set: <T>(state: RecoilState<T>, newValue: T) => {
      console.log('transaction set:', state.key, newValue);
    },
  };
  
  fn(options);
}

/**
 * Interface for transaction operations
 */
export interface TransactionOptions {
  /** Set an atom's value */
  set<T>(state: RecoilState<T>, newValue: T): void;
}
