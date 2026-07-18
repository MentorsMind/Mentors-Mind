type ToastType = 'info' | 'success' | 'error';

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type Listener = (toast: Toast) => void;

const listeners = new Set<Listener>();

export function showToast(message: string, type: ToastType = 'info') {
  const toast: Toast = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    message,
    type,
  };
  listeners.forEach((listener) => listener(toast));
}

export function subscribeToasts(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
