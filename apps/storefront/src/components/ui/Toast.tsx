import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Toast: React.FC = () => {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-stone-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-xl border border-stone-800 flex items-center gap-2.5 text-xs font-semibold">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{toast}</span>
      </div>
    </div>
  );
};
