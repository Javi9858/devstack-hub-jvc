import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="glass max-w-md w-full rounded-2xl p-6 relative border border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-textMuted hover:text-textPrimary bg-surface rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500 mb-4 mx-auto">
          <AlertTriangle size={24} />
        </div>

        <h3 className="text-xl font-bold text-textPrimary text-center mb-2">{title}</h3>
        <p className="text-textMuted text-center mb-8">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl font-medium text-textMuted hover:text-textPrimary bg-surface transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-3 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
