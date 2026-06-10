import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay confirm-dialog" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, background: 'var(--danger-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)'
            }}>
              <FiAlertTriangle size={18} />
            </div>
            <h2 className="modal-title">{title || 'Confirm action'}</h2>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        <p className="confirm-text">{message || 'Are you sure? This action cannot be undone.'}</p>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <><span className="spinner"></span> Deleting...</> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
