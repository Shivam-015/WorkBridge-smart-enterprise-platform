import React, { useEffect, useState } from 'react';

const icons = {
  success: (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const bgColors = {
  success: 'bg-white border-emerald-100 shadow-emerald-500/10',
  error: 'bg-white border-rose-100 shadow-rose-500/10',
  info: 'bg-white border-blue-100 shadow-blue-500/10',
};

const barColors = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-blue-500',
};

export default function Toast({ message, type, duration = 3000, onClose }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`relative overflow-hidden flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl transition-all duration-300
        ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}
        ${bgColors[type] || bgColors.info}`}
      style={{ minWidth: '320px', zIndex: 10000 }}
    >
      {/* Progress Bar Animation Overlay */}
      <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full opacity-30" />
      <div 
        className={`absolute bottom-0 left-0 h-1 ${barColors[type] || barColors.info} transition-all linear`}
        style={{ 
          width: '100%',
          animation: `toast-progress ${duration}ms linear forwards` 
        }}
      />

      <div className="flex-shrink-0">
        {icons[type] || icons.info}
      </div>
      
      <p className="text-sm font-bold text-slate-800 flex-grow tracking-tight">{message}</p>
      
      <button 
        onClick={() => {
          setIsExiting(true);
          setTimeout(onClose, 300);
        }} 
        className="flex-shrink-0 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}} />
    </div>
  );
}
