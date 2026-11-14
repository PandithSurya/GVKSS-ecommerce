import React from 'react';

export const FloatingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#fafaf9] select-none">
      {/* Subtle, soft ambient botanical atmosphere */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/35 via-stone-100/30 to-transparent rounded-full blur-3xl opacity-70" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] bg-gradient-to-bl from-teal-50/40 via-emerald-100/25 to-transparent rounded-full blur-3xl opacity-60" />
      <div className="absolute top-[60%] -left-36 w-[580px] h-[580px] bg-gradient-to-tr from-stone-100/50 via-emerald-50/30 to-transparent rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-10 right-[5%] w-[620px] h-[620px] bg-gradient-to-tl from-emerald-100/30 via-stone-100/30 to-transparent rounded-full blur-3xl opacity-65" />

      {/* Ultra-subtle, elegant static botanical watermark accents (low opacity, zero distracting motion) */}
      <div className="absolute top-12 left-10 opacity-[0.035] text-emerald-950 hidden lg:block">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-48 h-48">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>

      <div className="absolute bottom-16 right-12 opacity-[0.035] text-emerald-950 hidden lg:block">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-56 h-56 rotate-180">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
        </svg>
      </div>
    </div>
  );
};
