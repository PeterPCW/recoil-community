import type { RecoilValue, Loadable } from '../RecoilState';
import { useRecoilValue } from './useRecoilValue';

/**
 * useRecoilValueLoadable - Get a loadable without setter
 * 
 * @example
 * const userLoadable = useRecoilValueLoadable(userSelector);
 */
export function useRecoilValueLoadable<T>(
  state: RecoilValue<T>
): Loadable<T> {
  // Placeholder
  return { state: 'loading' as const, contents: undefined };
}

export { useRecoilValueLoadable as useRecoilValueLoadable_UNSTABLE };
