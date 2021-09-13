import Vue from "vue";
import Counter from "./Counter.vue";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Counter),
}).$mount("#app");
