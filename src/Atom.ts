/**
 * Atom - A piece of state that can be read and written
 * 
 * @param options - Atom configuration options
 * @returns An Atom that can be used with Recoil hooks
 */

export type Atom<T> = {
  _isAtom: true;
  key: string;
  default?: T | RecoilValue<T> | (() => T);
  effects?: Array<AtomEffect<T>>;
  dangerouslyAllowMutability?: boolean;
};

export type AtomOptions<T> = {
  key: string;
  default?: T | RecoilValue<T> | (() => T);
  effects?: Array<AtomEffect<T>>;
  dangerouslyAllowMutability?: boolean;
};

export type AtomEffect<T> = (context: {
  get: <T>(atom: RecoilState<T>) => T;
  getLoadable: <T>(atom: RecoilState<T>) => Loadable<T>;
  set: <T>(atom: RecoilState<T>, value: T) => void;
  setLoadable: <T>(atom: RecoilState<T>, loadable: Loadable<T>) => void;
  reset: <T>(atom: RecoilState<T>) => void;
}) => void | (() => void);

export type RecoilState<T> = Atom<T>;
export type RecoilValue<T> = RecoilState<T> | Selector<T>;
export type Loadable<T> = {
  state: 'hasValue' | 'loading' | 'hasError';
  getValue: () => T;
  toPromise: () => Promise<T>;
  valueMaybe: () => T | undefined;
  valueOrThrow: () => T;
  errorMaybe: () => Error | undefined;
  errorOrThrow: () => Error;
  is(val: unknown): boolean;
};

export function atom<T>(options: AtomOptions<T>): Atom<T> {
  return {
    _isAtom: true,
    ...options,
  } as unknown as Atom<T>;
}
