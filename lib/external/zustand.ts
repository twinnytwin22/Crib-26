import { useSyncExternalStore } from "react";

type SetStateInternal<T> = (
  partial: Partial<T> | ((state: T) => Partial<T> | T),
  replace?: boolean
) => void;

type GetStateInternal<T> = () => T;

type Listener<T> = (state: T, previousState: T) => void;

type Subscribe<T> = (listener: Listener<T>) => () => void;

export interface StoreApi<T> {
  setState: SetStateInternal<T>;
  getState: GetStateInternal<T>;
  subscribe: Subscribe<T>;
  destroy: () => void;
}

export type StateCreator<T> = (
  set: SetStateInternal<T>,
  get: GetStateInternal<T>,
  api: StoreApi<T>
) => T;

export type UseBoundStore<T> = {
  (): T;
  <U>(selector: (state: T) => U, equalityFn?: (a: U, b: U) => boolean): U;
  getState: StoreApi<T>["getState"];
  setState: StoreApi<T>["setState"];
  subscribe: StoreApi<T>["subscribe"];
  destroy: StoreApi<T>["destroy"];
};

function createStore<T>(initializer: StateCreator<T>): StoreApi<T> {
  let state: T;
  const listeners = new Set<Listener<T>>();

  const setState: SetStateInternal<T> = (partial, replace) => {
    const nextState =
      typeof partial === "function"
        ? (partial as (state: T) => Partial<T> | T)(state)
        : partial;

    if (nextState === state) return;

    const previousState = state;
    state = replace ? (nextState as T) : { ...state, ...(nextState as Partial<T>) };
    listeners.forEach((listener) => listener(state, previousState));
  };

  const getState: GetStateInternal<T> = () => state;

  const subscribe: Subscribe<T> = (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  const destroy = () => {
    listeners.clear();
  };

  const api: StoreApi<T> = {
    setState,
    getState,
    subscribe,
    destroy,
  };

  state = initializer(setState, getState, api);

  return api;
}

export function create<T>(initializer: StateCreator<T>): UseBoundStore<T> {
  const api = createStore(initializer);

  const useBoundStore = (<U>(
    selector?: (state: T) => U,
    equalityFn?: (a: U, b: U) => boolean
  ) => {
    const sliceSelector = selector ?? ((state: T) => state as unknown as U);
    const equality = equalityFn ?? Object.is;

    // Cache both snapshots to avoid infinite loops
    let cachedSnapshot = sliceSelector(api.getState());

    return useSyncExternalStore(
      (listener) =>
        api.subscribe((state, previousState) => {
          const nextSlice = sliceSelector(state);
          const currentSlice = sliceSelector(previousState);
          if (!equality(currentSlice, nextSlice)) {
            cachedSnapshot = nextSlice; // Update cached snapshot
            listener();
          }
        }),
      () => cachedSnapshot, // Return cached snapshot
      () => cachedSnapshot  // Return same cached snapshot for server
    );
  }) as UseBoundStore<T>;

  useBoundStore.getState = api.getState;
  useBoundStore.setState = api.setState;
  useBoundStore.subscribe = api.subscribe;
  useBoundStore.destroy = api.destroy;

  return useBoundStore;
}

export type { StateCreator as StateCreatorFn };
