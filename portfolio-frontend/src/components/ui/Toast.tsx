
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const ToastContext = createContext<{
  showToast: (message: string, type: ToastType, duration?: number) => void;
} | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={() => {
              setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast: React.FC<{
  toast: ToastMessage;
  onClose: () => void;
}> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
  };

  const backgrounds = {
    success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900 dark:border-green-700 dark:text-green-100',
    error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900 dark:border-red-700 dark:text-red-100',
    info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-100',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-100',
  };

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 pointer-events-auto ${backgrounds[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1">
        <p className="font-medium text-sm">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
