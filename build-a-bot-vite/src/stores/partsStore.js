import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePartsStore = defineStore('parts', () => {
  const parts = ref(null);

  const getParts = async () => {
    const res = await fetch('/api/parts');
    parts.value= await res.json();
  }

  return {parts, getParts};
});
