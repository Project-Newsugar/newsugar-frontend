// components/Modal.tsx
import React from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content: string | React.ReactNode;
  type?: 'alert' | 'confirm';
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showActionButton?: boolean;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  type = 'alert',
  onConfirm,
  onCancel,
  confirmText = '예',
  cancelText = '아니오',
  showActionButton = false,
  actionButtonText = '이동',
  onActionButtonClick,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full relative shadow-lg"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않게
      >
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        <div className="text-gray-700 mb-6">{content}</div>

        {type === 'alert' && (
         <div className="flex justify-end gap-3">
            {showActionButton && onActionButtonClick && (
              <button
                onClick={() => {
                  onActionButtonClick();
                  onClose();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {actionButtonText}
              </button>
            )}
            {!showActionButton && (
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            )}
        </div>
        )}

        {type === 'confirm' && (
          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                onConfirm?.();
                onClose();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              {confirmText}
            </button>
            <button
              onClick={() => {
                onCancel?.();
                onClose();
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              {cancelText}
            </button>
            
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Modal;