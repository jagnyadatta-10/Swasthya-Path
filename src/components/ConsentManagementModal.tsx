import React, { useState } from 'react';
import { ShieldCheck, X, Check, AlertCircle, RefreshCw, Key, Lock, Eye, FileText } from 'lucide-react';
import { ConsentItem } from '../types';
import { storage } from '../utils/storage';

interface ConsentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
}

export const ConsentManagementModal: React.FC<ConsentManagementModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId
}) => {
  const [consents, setConsents] = useState<ConsentItem[]>(storage.getConsents());
  const [abhaId, setAbhaId] = useState('98-2143-8765-1094');
  const [abhaAddress, setAbhaAddress] = useState('keshabrout@abdm');
  const [notice, setNotice] = useState('');

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    const updated = storage.toggleConsent(id);
    setConsents([...updated]);
    setNotice('Consent state updated and saved locally in browser sandbox.');
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="consent-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '640px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(25, 211, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Lock size={18} />
            </div>
            <div>
              <h3 id="consent-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                MY DATA & CONSENT MANAGEMENT
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                ABDM-Inspired Consent Manager • Patient-Centric Health Privacy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn"
            style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '6px', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '74vh', overflowY: 'auto' }}>
          {notice && (
            <div className="alert ok" style={{ marginBottom: '14px' }}>
              <Check size={16} /> {notice}
            </div>
          )}

          {/* ABHA Simulated Identity Section */}
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} color="#0284c7" />
                <strong style={{ fontSize: '14px', color: '#071c42' }}>ABHA & Digital Health Profile</strong>
              </div>
              <span className="badge badge-blue" style={{ fontSize: '10px' }}>
                ABDM integration is simulated in this prototype
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>ABHA ID (14-Digit):</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{abhaId}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>ABHA Address:</span>
                <strong style={{ color: '#0284c7' }}>{abhaAddress}</strong>
              </div>
            </div>
          </div>

          {/* Active Consent Artifacts */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#071c42' }}>
              Active Health Data Access Permissions
            </h4>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#64748b' }}>
              You maintain total control over which healthcare providers can access your longitudinal health record.
            </p>

            <div className="data-list">
              {consents.map((c) => (
                <div key={c.id} className="data-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{c.party}</strong>
                      <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
                        Shared Data: <strong>{c.dataType}</strong>
                      </div>
                    </div>
                    <span className={`badge ${c.status === 'Granted' ? 'badge-green' : 'badge-red'}`}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '6px 8px', borderRadius: '4px' }}>
                    <strong>Purpose:</strong> {c.purpose} • <strong>Validity:</strong> {c.duration} (Expires: {c.expiresAt})
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      className={`btn ${c.status === 'Granted' ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => handleToggle(c.id)}
                      style={{ fontSize: '11px', padding: '4px 12px' }}
                    >
                      {c.status === 'Granted' ? 'Revoke Consent' : 'Grant Consent'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
