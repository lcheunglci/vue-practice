import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cart = ref([]);
  const lastRobotCost = ref(0);
  const cartTotal = computed(() => cart.value.reduce((prev, cur) => (prev += cur.cost), 0));

  return { cart, lastRobotCost, cartTotal };
});
