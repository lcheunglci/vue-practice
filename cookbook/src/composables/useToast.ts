import { ref } from 'vue';

interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

const messages = ref<ToastMessage[]>([]);
let nextId = 0;

export function useToast() {
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = nextId++;
    messages.value.push({ id, text, type });
    setTimeout(() => {
      messages.value = messages.value.filter(m => m.id !== id);
    }, 3000);
  };

  return {
    messages,
    showToast,
  };
}