import React, { useState } from 'react';
import { CreditCard, X, QrCode, Shield, Download, Check, AlertCircle, Heart, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { DemoUser } from '../types';

interface DigitalHealthCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: DemoUser;
  onViewFullRecord?: () => void;
}

export const DigitalHealthCardModal: React.FC<DigitalHealthCardModalProps> = ({
  isOpen,
  onClose,
  user,
  onViewFullRecord
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const patientId = user.patientId || 'RHB-OD-KLH-0941';
  const abhaId = user.abhaId || '91-8472-9102-4821';
  const bloodGroup = user.bloodGroup || 'B+';
  const allergies = user.allergies || 'No known drug allergies';
  const conditions = user.conditions || 'None chronic reported';
  const emergencyContact = user.emergencyContact || '+91 94370 12345 (Family)';
  const location = user.location || 'Kalahandi, Odisha';

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="card-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '580px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0c3672 100%)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
              <CreditCard size={18} />
            </div>
            <div>
              <h3 id="card-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                Kalahandi Rural Digital Health Card
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                Low-Bandwidth Telehealth & Care-Navigation Identification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn"
            style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '6px', cursor: 'pointer' }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', background: '#f8fafc' }}>
          {/* THE HEALTH CARD CONTAINER */}
          <div style={{
            background: 'linear-gradient(135deg, #0a1f44 0%, #0d2e61 50%, #071936 100%)',
            borderRadius: '16px',
            color: '#ffffff',
            padding: '20px 22px',
            boxShadow: '0 12px 28px rgba(7, 28, 66, 0.35)',
            border: '1.5px solid rgba(25, 211, 255, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Watermark/Emblem overlay */}
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-20px',
              opacity: 0.05,
              pointerEvents: 'none'
            }}>
              <Shield size={240} />
            </div>

            {/* Top row: State / Project & Chip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800 }}>
                  Government of Odisha • Kalahandi District Telehealth
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.03em' }}>
                  SWASTHYA PATH SMART HEALTH ID
                </div>
              </div>

              {/* Digital Chip Simulation */}
              <div style={{
                width: '38px',
                height: '28px',
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                borderRadius: '6px',
                border: '1px solid #fef08a',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)'
              }} />
            </div>

            {/* Middle: Patient Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Patient Full Name
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  {user.name}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Patient ID: </span>
                    <strong style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '13px' }}>{patientId}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Age / Gender: </span>
                    <strong style={{ color: '#ffffff' }}>{user.age || 24} yrs • {user.gender || 'Female'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Blood Group: </span>
                    <strong style={{ color: '#f87171' }}>{bloodGroup}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>ABHA ID: </span>
                    <strong style={{ color: '#cbd5e1', fontSize: '11px' }}>{abhaId}</strong>
                  </div>
                </div>
              </div>

              {/* QR Code Demo Box */}
              <div style={{
                background: '#ffffff',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                <QrCode size={68} color="#0a1f44" />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#0a1f44', marginTop: '4px' }}>
                  SCAN FOR OPD
                </span>
              </div>
            </div>

            {/* Bottom Details Row */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              paddingTop: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              fontSize: '11px'
            }}>
              <div>
                <span style={{ color: '#94a3b8', display: 'block' }}>Location:</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{location}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block' }}>Allergies:</span>
                <span style={{ color: '#fca5a5', fontWeight: 600 }}>{allergies}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block' }}>Emergency Contact:</span>
                <span style={{ color: '#86efac', fontWeight: 600 }}>{emergencyContact}</span>
              </div>
            </div>
          </div>

          {/* Privacy & Healthcare Statement */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '14px',
            padding: '10px 14px',
            background: '#e0f2fe',
            borderRadius: '10px',
            color: '#0369a1',
            fontSize: '12px'
          }}>
            <Shield size={16} style={{ flexShrink: 0 }} />
            <span>
              “Your information is used to support your healthcare journey.” Consent is verified before each teleconsultation.
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '18px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDownload}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {downloadSuccess ? <Check size={16} color="#059669" /> : <Download size={16} />}
              <span>{downloadSuccess ? 'Card Downloaded (PDF)' : 'Download Offline Card'}</span>
            </button>

            {onViewFullRecord && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onViewFullRecord();
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}
              >
                <FileText size={16} />
                <span>View Full Health Record</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
