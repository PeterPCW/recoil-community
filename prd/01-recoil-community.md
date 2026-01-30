# Recoil Revival - PRD

**Project:** Community-maintained fork of Facebook's Recoil library  
**Status:** PRD Ready for Review  
**Created:** 2026-01-29  
**Priority:** High (Peter excited about this)

---

## Problem Statement

Recoil was Facebook's "goldilocks" React state management library — simpler than Redux, more powerful than Context. When Meta archived it in 2025, developers lost their preferred middle-ground solution.

**Current alternatives leave gaps:**

| Library | Problem |
|---------|---------|
| **Redux** | Too much boilerplate, complex middleware, overkill for most apps |
| **Context API** | Re-renders entire subtrees when any value changes (performance killer) |
| **Zustand** | Too minimal — no atoms/selectors concept, no built-in devtools, no Suspense support |
| **Jotai** | Good atoms model but different API, not a direct drop-in replacement |

**User pain:** "Recoil was the perfect balance of simplicity and power" — no current library matches the exact Recoil ergonomics.

---

## User Evidence

### HN/Reddit Language Found
> "What should I use instead of Recoil now?"
> "Recoil was so intuitive"
> "Why did Meta archive Recoil?"
> "Is there a maintained fork of Recoil?"

### What Developers Miss About Recoil

1. **Atoms/selectors API** — Declarative, composable state pieces
2. **React Suspense integration** — Built-in async handling
3. **Atom families** — Dynamic atom creation for lists/grids
4. ** selectors with read/write** — Derive and mutate state together
5. **Default memoization** — No unnecessary re-renders
6. **DevTools extension** — Built-in debugging

---

## Proposed Solution

### Product: Recoil Community Fork

**Name:** `recoil-community` (or similar, to avoid confusion)

**Core Features to Preserve (from original Recoil):**
- `atom()` — Declare independent pieces of state
- `selector()` — Derive computed state
- `atomFamily()` / `selectorFamily()` — Dynamic creation for lists
- `useRecoilState()` / `useRecoilValue()` / `useSetRecoilState()` — Hook variants
- `RecoilRoot` — Provider component
- Suspense integration for async selectors

**Modern Updates Needed:**
- React 18/19 compatibility
- TypeScript 5.x support
- Updated build tooling (modern Rollup/esbuild)
- Concurrent mode support
- Fix known bugs (atom lifecycle issues, memory leaks)

**Scope Boundaries:**

✅ **In Scope:**
- React 18/19 compatibility
- TypeScript improvements  
- Bug fixes
- Modern build pipeline
- Core API parity

❌ **Out of Scope (for MVP):**
- New features not in original Recoil
- Breaking API changes
- Integration with other state managers
- SSR frameworks (Next.js/Nuxt specific plugins)

---

## Success Criteria

| Metric | Target |
|--------|--------|
| **Downloads** | 10,000/week within 3 months |
| **GitHub Stars** | 1,000 within 6 months |
| **NPM Dependents** | 500+ packages using it |
| **Issue Response** | < 48 hours |
| **PR Merge Time** | < 1 week for non-breaking changes |

---

## Technical Approach

### Phase 1: Foundation
1. Fork archived Recoil repo
2. Update dependencies (React 18/19, TypeScript 5.x)
3. Fix critical bugs (from archived issue tracker)
4. Set up modern CI/CD (GitHub Actions)

### Phase 2: Compatibility
1. React 18 concurrent features
2. React 19 compatibility
3. Testing matrix (browsers, React versions)

### Phase 3: Community
1. Document migration from Recoil
2. Create examples/docs
3. Build Discord/community
4. Collect PRs from ecosystem

---

## Competitive Analysis

### Zustand (most popular alternative)
```javascript
// Zustand style
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

### Recoil style
```javascript
// Recoil style (what we preserve)
const countAtom = atom({ key: 'count', default: 0 })
const countSelector = selector({ key: 'countSelector', get: ({get}) => get(countAtom) * 2 })

function Counter() {
  const [count, setCount] = useRecoilState(countAtom)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Why preserve Recoil API:** Many teams already wrote code in Recoil style. Migration cost to Zustand/Jotai is real. A maintained fork lowers that cost.

---

## Revenue Potential (Optional)

**Free Tier:**
- Open source, MIT licensed
- Community support via GitHub Issues

**Potential Monetization (Future):**
- Paid consulting for migration
- Enterprise support tier
- Custom training materials

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Low adoption | Target existing Recoil users (19.5k stars = 100k+ users) |
| Maintenance burden | Build community of maintainers early |
| React 19 breaking changes | Start with React 18, plan React 19 roadmap |
| Perceived fragmentation | Clear communication: "official community fork" |

---

## Deliverables

1. **GitHub repo** — `recoil-community` fork with modern updates
2. **NPM package** — Published to npm (different name to avoid confusion)
3. **Migration guide** — For teams moving from archived Recoil
4. **Documentation** — Updated docs for modern React
5. **Examples** — Common use cases

---

## Next Steps (If Approved)

1. Fork archived Recoil repository
2. Update package.json for React 18/19
3. Fix top 5 reported bugs
4. Set up GitHub Actions CI
5. Publish to NPM as `recoil-community` (or similar)
6. Announce on HN/Reddit: "Recoil lives — community fork"

---

## Files

- `/projects/recoil-revival.md` — Project overview
- `/projects/research/03-candidate-survey.md` — User research
- `/projects/research/04-recoil-analysis.md` — Alternative comparison (to be created)
- `/projects/recoil-revival/prd/01-recoil-community.md` — This PRD
