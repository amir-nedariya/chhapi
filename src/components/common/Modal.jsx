import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, maxWidth = 'max-w-4xl', children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 200); // Wait for transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div 
        className={`relative bg-white rounded-lg w-full ${maxWidth} shadow-2xl flex flex-col max-h-[95vh] transition-all duration-200 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

Modal.Header = ({ children, onClose }) => (
  <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
    <h2 className="text-xl md:text-[22px] font-bold text-[#1C2434]">
      {children}
    </h2>
    {onClose && (
      <button 
        type="button"
        onClick={onClose} 
        className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
      >
        <X size={22} strokeWidth={2} />
      </button>
    )}
  </div>
);

Modal.Body = ({ children, className = "" }) => (
  <div className={`p-6 overflow-y-auto modal-scrollbar flex-1 ${className}`}>
    {children}
  </div>
);

Modal.Footer = ({ children, className = "" }) => (
  <div className={`flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-200 bg-white rounded-b-lg ${className}`}>
    {children}
  </div>
);

export default Modal;
