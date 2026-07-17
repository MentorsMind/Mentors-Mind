import { useEffect, useState } from 'react';
import { subscribeToasts } from '../lib/toast';

type ToastItem = {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
};

const typeStyles: Record<ToastItem['type'], string> = {
  info: 'bg-slate-800 text-white border-white/10',
  success: 'bg-emerald-600 text-white border-emerald-400/30',
  error: 'bg-rose-600 text-white border-rose-400/30',
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToasts((toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 3000);
    });
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-fade-in-up ${typeStyles[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
