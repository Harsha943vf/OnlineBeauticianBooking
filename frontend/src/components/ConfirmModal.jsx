import { useState } from 'react';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, showInput, inputLabel }) {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(showInput ? inputValue : true);
    setInputValue('');
  };

  const handleCancel = () => {
    setInputValue('');
    onCancel();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div className="card" style={{
        maxWidth: '420px', width: '90%', padding: '30px',
        animation: 'fadeIn 0.2s ease'
      }}>
        <h3 style={{ marginBottom: '10px' }}>{title || 'Confirm'}</h3>
        <p style={{ marginBottom: '20px', color: 'var(--text-secondary, #666)' }}>{message}</p>

        {showInput && (
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>{inputLabel || 'Reason'}</label>
            <textarea
              rows="3"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Enter reason..."
              style={{ width: '100%' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          <button className="btn btn-primary" onClick={handleConfirm}
            style={!showInput ? {} : { background: '#e74c3c' }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
