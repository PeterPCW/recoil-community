import { describe, it, expect } from 'vitest';
import { atom } from './src/Atom';
import { selector } from './src/Selector';
import { RecoilState, RecoilValue } from './src/RecoilState';

describe('Atom', () => {
  it('creates an atom with a key and default value', () => {
    const countAtom = atom({
      key: 'count',
      default: 0,
    });
    
    expect(countAtom.key).toBe('count');
    expect((countAtom as any)._isAtom).toBe(true);
  });
  
  it('creates an atom with a selector as default', () => {
    const baseAtom = atom({ key: 'base', default: 10 });
    const derivedAtom = atom({
      key: 'derived',
      default: baseAtom,
    });
    
    expect(derivedAtom.key).toBe('derived');
  });
  
  it('creates atoms with custom effects', () => {
    const loggedAtom = atom({
      key: 'logged',
      default: 'hello',
      effects_UNSTABLE: [
        {
          onSet: (newValue, oldValue) => {
            console.log(`Changed from ${oldValue} to ${newValue}`);
          },
        },
      ],
    });
    
    expect(loggedAtom.key).toBe('logged');
  });
});

describe('Selector', () => {
  it('creates a read-only selector', () => {
    const countAtom = atom({ key: 'count', default: 0 });
    
    const doubleSelector = selector({
      key: 'double',
      get: ({ get }) => {
        const count = get(countAtom);
        return count * 2;
      },
    });
    
    expect(doubleSelector.key).toBe('double');
    expect((doubleSelector as any)._isSelector).toBe(true);
  });
  
  it('creates a writable selector with set', () => {
    const inputAtom = atom({ key: 'input', default: '' });
    const uppercaseAtom = selector({
      key: 'uppercase',
      get: ({ get }) => get(inputAtom).toUpperCase(),
      set: ({ set }, newValue) => {
        set(inputAtom, newValue);
      },
    });
    
    expect(uppercaseAtom.key).toBe('uppercase');
  });
});

describe('Type guards', () => {
  it('isAtom returns true for atoms', () => {
    const countAtom = atom({ key: 'count', default: 0 });
    expect((countAtom as any)._isAtom).toBe(true);
  });
  
  it('isSelector returns true for selectors', () => {
    const countSelector = selector({
      key: 'count',
      get: () => 0,
    });
    expect((countSelector as any)._isSelector).toBe(true);
  });
});
