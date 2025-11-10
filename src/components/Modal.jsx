import React from 'react';
import { FaCheckCircle, FaTimesCircle, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

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

  const typeStyles = {
    success: 'bg-green-50 border-green-500 text-green-900',
    error: 'bg-red-50 border-red-500 text-red-900',
    info: 'bg-blue-50 border-blue-500 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-900',
  };

  const iconStyles = {
    success: <FaCheckCircle className="text-green-600 text-3xl" />,
    error: <FaTimesCircle className="text-red-600 text-3xl" />,
    info: <FaInfoCircle className="text-blue-600 text-3xl" />,
    warning: <FaExclamationTriangle className="text-yellow-600 text-3xl" />,
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-l-4 ${typeStyles[type]}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              {iconStyles[type]}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-semibold transition-all"
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
