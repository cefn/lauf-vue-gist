<template>
  <div class="counter">
    <h1>{{ count }}</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createStore } from "@lauf/store";
import { createOptions } from "../lib/lauf-store-vue";

const store = createStore({
  count: 0,
});

const options = createOptions(store, {
  count: (state) => state.count,
});
console.log(options);

export default Vue.extend({
  name: "Counter",
  ...options,
});

setInterval(() => {
  store.edit((state) => state.count++);
}, 1000);
</script>
