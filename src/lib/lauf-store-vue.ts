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

  // TODO factor out the common traversal

  function data() {
    return Object.fromEntries(
      Object.entries(selectorMap).map((entry) => {
        const [name, selector] = entry;
        return [name, selector(store.read())];
      })
    ) as unknown as Data;
  }

  function created(this: Data) {
    store.watch((state) => {
      for (const entry of Object.entries(selectorMap)) {
        const [name, selector] = entry as [keyof Data, M[keyof Data]];
        const selected = selector(state) as Data[typeof name];
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
