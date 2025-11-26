import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

/**
 * Reusable Modal Component
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Function to call when closing
 * @param {string} title - Modal title
 * @param {string} message - Modal message content
 * @param {string} type - Modal type: 'success', 'error', 'warning', 'info'
 */
export const Modal = ({ isOpen, onClose, title, message, type = 'info' }) => {
  if (!isOpen) return null;

  const iconStyles = {
    success: <FiCheckCircle className="text-gray-900 text-2xl" />,
    error: <FiAlertCircle className="text-gray-900 text-2xl" />,
    info: <FiInfo className="text-gray-900 text-2xl" />,
    warning: <FiAlertCircle className="text-gray-900 text-2xl" />,
  };

  return (
    <div
      className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
              {iconStyles[type]}
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">{message}</p>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-black transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to use modal functionality
 * @returns {object} - { modal, showModal, closeModal }
 */
export const useModal = () => {
  const [modal, setModal] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showModal = (title, message, type = 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  return { modal, showModal, closeModal };
};
