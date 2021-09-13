import { Store, Selector, RootState } from "@lauf/store";

type Key = string | number;

type SelectorMap<S extends RootState> = {
  [key in Key]: Selector<S, unknown>;
};

type DataMap<M extends SelectorMap<S>, S extends RootState> = {
  [key in keyof M]: ReturnType<M[key]>;
};

type OptionMap<M extends SelectorMap<S>, S extends RootState> = {
  data: () => DataMap<M, S>;
  created: (this: DataMap<M, S>) => unknown;
};

export function createOptions<M extends SelectorMap<S>, S extends RootState>(
  store: Store<S>,
  selectorMap: M
): OptionMap<M, S> {
  type Data = DataMap<M, S>;

  function data() {
    return Object.fromEntries(
      Object.entries(selectorMap).map((entry) => {
        const [name, selector] = entry as [Key, M[Key]];
        return [name, selector(store.read()) as ReturnType<typeof selector>];
      })
    ) as unknown as Data;
  }

  function created(this: Data) {
    store.watch((state) => {
      for (const entry of Object.entries(selectorMap)) {
        const [name, selector] = entry as [keyof M, M[Key]];
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
