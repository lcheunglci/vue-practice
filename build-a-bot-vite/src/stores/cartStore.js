import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const cart = ref([]);
  const lastRobotCost = ref(0);

  return { cart, lastRobotCost };
});
