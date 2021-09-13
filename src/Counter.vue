<template>
  <div id="app">
    <div class="counter">
      <h1>{{ count }}</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createStore } from "@lauf/store";
import { createOptions } from "./lib/lauf-store-vue";

const store = createStore({
  count: 0,
});

setInterval(() => {
  store.edit((state) => state.count++);
}, 1000);

export default Vue.extend({
  name: "App",
  ...createOptions(store, {
    count: (state) => state.count,
  }),
});
</script>
