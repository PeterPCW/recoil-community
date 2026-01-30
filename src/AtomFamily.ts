/**
 * AtomFamily - Factory for creating dynamic atoms
 * 
 * Creates atoms on-demand based on a parameter.
 */
export function atomFamily<T, P>(options: AtomFamilyOptions<T, P>): AtomFamily<T, [P]> {
  return ((param: P) => {
    return atom({
      key: `${options.key}_${JSON.stringify(param)}`,
      default: typeof options.default === 'function'
        ? (options.default as (p: P) => T | RecoilValueReadOnly<T>)(param)
        : options.default,
    });
  }) as AtomFamily<T, [P]>;
}

/**
 * SelectorFamily - Factory for creating dynamic selectors
 * 
 * Creates selectors on-demand based on a parameter.
 */
export function selectorFamily<T, P>(options: SelectorFamilyOptions<T, P>): SelectorFamily<T, [P]> {
  return ((param: P) => {
    return selector({
      key: `${options.key}_${JSON.stringify(param)}`,
      get: ({ get }) => {
        return options.get({ get }, param);
      },
    });
  }) as SelectorFamily<T, [P]>;
}

import { AtomFamily, SelectorFamily, AtomFamilyOptions, SelectorFamilyOptions } from './RecoilFamily';
import { atom } from './Atom';
import { RecoilValueReadOnly } from './RecoilState';
