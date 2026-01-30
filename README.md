# Recoil Community

**Community-maintained fork of Facebook's Recoil library**

[![NPM Package](https://img.shields.io/npm/v/recoil-community.svg)](https://www.npmjs.com/package/recoil-community)
[![License](https://img.shields.io/npm/l/recoil-community.svg)](LICENSE)

## What is Recoil?

Recoil is a state management library for React that provides a simpler, more ergonomic alternative to Redux. It introduces two core concepts:

- **Atoms** — Independent pieces of state that components can subscribe to
- **Selectors** — Derived state computed from atoms or other selectors

```jsx
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil-community';

// Define atoms
const countAtom = atom({
  key: 'count',
  default: 0,
});

// Define selectors
const countLabelSelector = selector({
  key: 'countLabel',
  get: ({ get }) => {
    const count = get(countAtom);
    return `${count} items`;
  },
});

function Counter() {
  const [count, setCount] = useRecoilState(countAtom);
  const label = useRecoilValue(countLabelSelector);
  
  return (
    <div>
      <p>{label}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## Why Recoil Community?

Recoil was created by Facebook/Meta but was archived in 2025. Recoil Community provides:

- ✅ React 18/19 compatibility
- ✅ TypeScript 5.x with strict mode
- ✅ Modern build tooling (ESM/CJS dual package)
- ✅ Active maintenance and bug fixes
- ✅ Community support

## Installation

```bash
npm install recoil-community
# or
yarn add recoil-community
# or
pnpm add recoil-community
```

**Peer Dependencies:**
- React >= 18.0.0
- React DOM >= 18.0.0

## Documentation

- [Getting Started](/docs/getting-started.md)
- [Atoms](/docs/atoms.md)
- [Selectors](/docs/selectors.md)
- [Async Data](/docs/async.md)
- [API Reference](/docs/api.md)

## Migration from Original Recoil

If you're migrating from the archived `recoil` package:

```bash
npm uninstall recoil
npm install recoil-community
```

Update your imports:

```diff
- import { atom, useRecoilState } from 'recoil';
+ import { atom, useRecoilState } from 'recoil-community';
```

## Contributing

Contributions are welcome! Please see our [Contributing Guide](/CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](/LICENSE) for details.
