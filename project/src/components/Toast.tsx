import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type = 'error', duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-950/80 border-red-500/50 text-red-200';
      case 'warning':
        return 'bg-yellow-950/80 border-yellow-500/50 text-yellow-200';
      case 'info':
        return 'bg-blue-950/80 border-blue-500/50 text-blue-200';
      default:
        return 'bg-black/80 border-white/10 text-white';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`backdrop-blur-sm border rounded-lg p-4 shadow-lg ${getToastStyles()}`}>
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p className="flex-1">{message}</p>
          <button
            onClick={onClose}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}