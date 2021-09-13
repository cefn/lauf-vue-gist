import { Store, Selector, RootState } from "@lauf/store";

type SelectorMap<S extends RootState, K extends string | number | symbol, V> = {
  [key in K]: Selector<S, V>;
};

type OptionMap<
  M extends SelectorMap<S, K, V>,
  S extends RootState,
  K extends string | number | symbol,
  V
> = {
  data: () => DataMap<M, S, K, V>;
  created: (this: DataMap<M, S, K, V>) => unknown;
};

type DataMap<
  M extends SelectorMap<S, K, V>,
  S extends RootState,
  K extends string | number | symbol,
  V
> = {
  [key in keyof M]: ReturnType<M[key]>;
};

export function createOptions<
  M extends SelectorMap<S, K, V>,
  S extends RootState,
  K extends string | number | symbol,
  V
>(store: Store<S>, selectorMap: M): OptionMap<M, S, K, V> {
  type Data = DataMap<M, S, K, V>;

  function data() {
    return Object.fromEntries(
      Object.entries(selectorMap).map((entry) => {
        const [name, selector] = entry as [K, M[K]];
        return [name, selector(store.read()) as ReturnType<typeof selector>];
      })
    ) as unknown as Data;
  }

  function created(this: Data) {
    store.watch((state) => {
      for (const entry of Object.entries(selectorMap)) {
        const [name, selector] = entry as [K, M[K]];
        const selected = selector(state) as ReturnType<typeof selector>;
        if (!Object.is(this[name], selected)) {
          this[name] = selected;
        }
      }
    });
  }
  return {
    data,
    created,
  };
}
