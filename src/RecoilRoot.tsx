import React, { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

/**
 * RecoilRoot - Provider component for Recoil state
 * 
 * Wrap your app with RecoilRoot to enable Recoil state management.
 * 
 * @example
 * function App() {
 *   return (
 *     <RecoilRoot>
 *       <Component />
 *     </RecoilRoot>
 *   );
 * }
 */
export interface RecoilRootProps {
  children: React.ReactNode;
  
  /**
   * Override how Recoil renders outside the root
   * @_UNSTABLE - This API is experimental and may change
   */
  override?: RecoilOutsideRenderPolicy;
  
  /**
   * Initialize with specific values
   * @_UNSTABLE - This API is experimental and may change
   */
  initializeState?: (mutableSource: RecoilMutableSource) => void;
}

/**
 * Policy for rendering outside RecoilRoot
 */
export enum RecoilOutsideRenderPolicy {
  /** Never allow renders outside RecoilRoot */
  Never = 'never',
  
  /** Allow renders if no subscriptions */
  AllowEmpty = 'allow-empty',
  
  /** Always allow renders outside RecoilRoot */
  Always = 'always',
}

/**
 * Recoil state node - internal representation
 */
interface RecoilStateNode<T> {
  value: T;
  subscribers: Set<(value: unknown) => void>;
  dependents: Set<string>;
}

/**
 * RecoilMutableSource - Internal state manager for React 18 concurrent mode
 * @_UNSTABLE - This API is experimental and may change
 */
export interface RecoilMutableSource {
  /** Get unique ID for this mutable source */
  readonly _instanceID: string;
  
  /** Get current state value */
  getState<T>(atom: RecoilState<T>): T;
  
  /** Set new state value */
  setState<T>(atom: RecoilState<T>, newValue: T): void;
  
  /** Subscribe to state changes */
  subscribe<T>(
    atom: RecoilState<T>, 
    callback: (value: T) => void
  ): () => void;
  
  /** Get snapshot for debugging */
  getSnapshot(): Map<string, unknown>;
}

/**
 * RecoilState interface
 */
export interface RecoilState<T = unknown> {
  readonly _id: string;
  readonly key: string;
  readonly defaultValue: T;
}

/**
 * Create a new mutable source instance
 */
function createRecoilMutableSource(): RecoilMutableSource {
  const stateMap = new Map<string, RecoilStateNode<unknown>>();
  const subscribersMap = new Map<string, Set<(value: unknown) => void>>();
  
  return {
    _instanceID: `Recoil_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    
    getState<T>(atom: RecoilState<T>): T {
      let node = stateMap.get(atom.key) as RecoilStateNode<T> | undefined;
      if (!node) {
        // Initialize with default value
        node = {
          value: atom.defaultValue,
          subscribers: new Set(),
          dependents: new Set(),
        };
        stateMap.set(atom.key, node);
      }
      return node.value;
    },
    
    setState<T>(atom: RecoilState<T>, newValue: T): void {
      const node = stateMap.get(atom.key) as RecoilStateNode<T> | undefined;
      if (node && node.value !== newValue) {
        node.value = newValue;
        // Notify subscribers
        node.subscribers.forEach(callback => callback(newValue as unknown));
      }
    },
    
    subscribe<T>(atom: RecoilState<T>, callback: (value: T) => void): () => void {
      let subscribers = subscribersMap.get(atom.key);
      if (!subscribers) {
        subscribers = new Set();
        subscribersMap.set(atom.key, subscribers);
      }
      subscribers.add(callback as (value: unknown) => void);
      
      // Return unsubscribe function
      return () => {
        subscribers?.delete(callback as (value: unknown) => void);
      };
    },
    
    getSnapshot(): Map<string, unknown> {
      const snapshot = new Map<string, unknown>();
      stateMap.forEach((node, key) => {
        snapshot.set(key, node.value);
      });
      return snapshot;
    },
  };
}

/**
 * Context for Recoil state
 */
const RecoilContext = createContext<RecoilMutableSource | null>(null);

/**
 * Get the RecoilMutableSource from context
 */
export function useRecoilMutableSource(): RecoilMutableSource {
  const context = useContext(RecoilContext);
  if (!context) {
    throw new Error('useRecoilMutableSource must be used within a RecoilRoot');
  }
  return context;
}

/**
 * Subscribe to a Recoil state with concurrent mode support
 * Uses useSyncExternalStore for React 18 concurrent features
 */
function useRecoilStateSubscription<T>(
  mutableSource: RecoilMutableSource,
  atom: RecoilState<T>
): T {
  // Use useSyncExternalStore for concurrent mode compatibility
  // This ensures proper handling of React 18's concurrent features
  const getSnapshot = useCallback(() => {
    return mutableSource.getState(atom);
  }, [mutableSource, atom]);
  
  const subscribe = useCallback((callback: () => void) => {
    return mutableSource.subscribe(atom, callback as (value: T) => void);
  }, [mutableSource, atom]);
  
  // useSyncExternalStore handles concurrent mode correctly
  // It works with both legacy and concurrent React modes
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  );
}

/**
 * Main RecoilRoot component with React 18 concurrent mode support
 */
export function RecoilRoot({ 
  children,
  initializeState 
}: RecoilRootProps): JSX.Element {
  // Create mutable source (one per RecoilRoot instance)
  const mutableSourceRef = useRef<RecoilMutableSource | null>(null);
  
  if (!mutableSourceRef.current) {
    mutableSourceRef.current = createRecoilMutableSource();
    
    // Apply initial state if provided
    if (initializeState) {
      initializeState(mutableSourceRef.current);
    }
  }
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  
  return (
    <RecoilContext.Provider value={mutableSourceRef.current}>
      {children}
    </RecoilContext.Provider>
  );
}

/**
 * Hook to check if inside a RecoilRoot
 */
export function useRecoilTransaction_UNSTABLE<T>(
  callback: (mutableSource: RecoilMutableSource) => T
): T {
  const mutableSource = useRecoilMutableSource();
  return callback(mutableSource);
}

/**
 * Get snapshot of all Recoil state (for debugging)
 */
export function useRecoilSnapshot(): Map<string, unknown> {
  const mutableSource = useRecoilMutableSource();
  return mutableSource.getSnapshot();
}

/**
 * Check if a value is a RecoilState
 */
export function isRecoilValue(value: unknown): value is RecoilState<unknown> {
  return value !== null && typeof value === 'object' && 'key' in value;
}

export { RecoilContext };
