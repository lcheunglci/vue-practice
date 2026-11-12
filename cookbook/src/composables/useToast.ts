import { ref } from 'vue';

interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

const currentToast = ref<ToastMessage | null>(null);

export function useToast() {
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    currentToast.value = { text, type };
  };

  const hideToast = () => {
    currentToast.value = null;
  };

  return {
    currentToast,
    showToast,
    hideToast,
  };
}