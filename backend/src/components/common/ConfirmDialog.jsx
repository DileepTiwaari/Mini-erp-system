// src/components/common/ConfirmDialog.jsx
// Standardised confirmation card modal.
// Prompts users before destructive workflows (like deletion or status overrides).

import React from 'react';
import Modal from './Modal';
import { AlertCircle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning' | 'danger' | 'info'
}) => {
  const confirmBtnColors = {
    danger: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white',
    info: 'bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 text-white',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center p-2">
        <div className="p-3 bg-amber-50 rounded-full text-amber-500 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors duration-150"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2 text-sm font-semibold rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ${
              confirmBtnColors[type] || confirmBtnColors.warning
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
