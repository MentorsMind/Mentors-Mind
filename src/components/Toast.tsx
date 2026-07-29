import { useEffect, useState } from 'react';
import { subscribeToasts } from '../lib/toast';

type ToastType = 'info' | 'success' | 'error';

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastProps {
    duration?: number;
}

const typeStyles: Record<ToastType, string> = {
    info: 'bg-slate-800 text-white border-white/10',
    success: 'bg-emerald-600 text-white border-emerald-400/30',
    error: 'bg-rose-600 text-white border-rose-400/30',
};

const typeIcons: Record<ToastType, string> = {
    info: 'ℹ',
    success: '✓',
    error: '✕',
};

export function Toast({ duration = 3000 }: ToastProps) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    useEffect(() => {
        return subscribeToasts((toast) => {
            setToasts(prev => [...prev, toast]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, duration);
        });
    }, [duration]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    role="alert"
                    aria-live="assertive"
                    className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-fade-in-up ${typeStyles[toast.type]}`}
                >
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                        {typeIcons[toast.type]}
                    </span>
                    <span>{toast.message}</span>
                    <button
                        onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                        className="ml-auto flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
                        aria-label="Dismiss notification"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}

