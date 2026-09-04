import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Toast: React.FC = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-emerald-950 text-white px-5 py-3 rounded-full shadow-2xl border border-emerald-700 flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <span className="text-xs sm:text-sm font-bold">{toast}</span>
      </div>
    </div>
  );
};
