import { useRecoilValue } from './useRecoilValue';
import { useRecoilState } from './useRecoilState';
import { useSetRecoilState } from './useSetRecoilState';
import { useResetRecoilState } from './useResetRecoilState';
import type { RecoilState, RecoilValue } from '../RecoilState';

/**
 * useRecoilInterface - Get all Recoil hooks in one hook
 * 
 * Returns an object with all Recoil hooks for advanced use cases.
 * Useful when you need access to multiple hooks programmatically.
 * 
 * @example
 * const { useRecoilValue, useRecoilState, setRecoilState } = useRecoilInterface();
 */
export function useRecoilInterface() {
  return {
    useRecoilValue: <T>(state: RecoilValue<T>) => useRecoilValue(state),
    useRecoilState: <T>(state: RecoilState<T>) => useRecoilState(state),
    setRecoilState: <T>(state: RecoilState<T>) => useSetRecoilState(state),
    resetRecoilState: <T>(state: RecoilState<T>) => useResetRecoilState(state),
  };
}
