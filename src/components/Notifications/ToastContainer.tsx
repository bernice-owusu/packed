import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map(toast => {
        let Icon = CheckCircle2;
        let bg = 'bg-white border-emerald-500 text-emerald-800';
        let iconColor = 'text-emerald-500';

        if (toast.type === 'warning') {
          Icon = AlertCircle;
          bg = 'bg-white border-amber-500 text-amber-800';
          iconColor = 'text-amber-500';
        } else if (toast.type === 'info') {
          Icon = Info;
          bg = 'bg-white border-[#7A45A9] text-[#1D395F]';
          iconColor = 'text-[#7A45A9]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-2xl shadow-xl border-l-4 ${bg} border border-gray-100 animate-fade-in`}
          >
            <div className="flex items-center space-x-2.5 min-w-0 pr-2">
              <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
              <p className="text-xs font-semibold text-[#1D395F] leading-snug truncate">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
