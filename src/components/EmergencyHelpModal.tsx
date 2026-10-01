import React, { useState } from 'react';
import { PhoneCall, X, Phone, ShieldAlert, MapPin, Share2, FileText, Check, AlertOctagon } from 'lucide-react';
import { storage } from '../utils/storage';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMERGENCY_CATEGORIES = [
  'Severe breathing difficulty / gasping',
  'Severe chest pain / pressure radiating to arm',
  'Loss of consciousness / fainting / unresponsive',
  'Severe or uncontrollable bleeding',
  'Sudden stroke-like symptoms (face droop, slurred speech)',
  'Serious vehicular or agricultural injury',
  'Snakebite or acute poisoning',
  'Other urgent life-threatening problem'
];

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({ isOpen, onClose }) => {
  const [selectedIssue, setSelectedIssue] = useState<string>('Severe chest pain / pressure radiating to arm');
  const [generatedSummary, setGeneratedSummary] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  const facilities = storage.getFacilities().filter(f => f.type === 'District Hospital' || f.type === 'CHC');

  const handleGenerateSummary = () => {
    setGeneratedSummary(true);
    storage.addAuditLog(`Emergency summary generated for: ${selectedIssue}`, 'Emergency System');
  };

  const handleShareSummary = () => {
    setShareSuccess(true);
    storage.addAuditLog(`Emergency summary shared with 108 Dispatch & ASHA coordinator`, 'Emergency System');
    setTimeout(() => setShareSuccess(false), 2500);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="emergency-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '640px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <PhoneCall size={20} />
            </div>
            <div>
              <h3 id="emergency-modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>
                EMERGENCY MEDICAL ASSISTANCE
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#fca5a5' }}>
                Kalahandi District Emergency Response Protocol • Immediate Action Required
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn"
            style={{ background: 'transparent', color: '#fca5a5', border: 'none', padding: '6px', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', background: '#fef2f2', maxHeight: '76vh', overflowY: 'auto' }}>
          {/* Warning Banner */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>
              <AlertOctagon size={20} />
              <span>DO NOT WAIT FOR ONLINE TELECONSULTATION</span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#7f1d1d', lineHeight: 1.5 }}>
              If you or someone nearby is experiencing acute symptoms, normal teleconsultation waiting queues are stopped. Immediate in-person physical medical stabilization is required.
            </p>
          </div>

          {/* Quick Issue Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#7f1d1d', display: 'block', marginBottom: '8px' }}>
              What is happening right now?
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
              {EMERGENCY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedIssue(cat)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: selectedIssue === cat ? 700 : 500,
                    cursor: 'pointer',
                    border: selectedIssue === cat ? '2px solid #b91c1c' : '1px solid #fca5a5',
                    background: selectedIssue === cat ? '#fee2e2' : '#ffffff',
                    color: selectedIssue === cat ? '#991b1b' : '#334155'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Configured Emergency Contacts */}
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca', marginBottom: '16px' }}>
            <strong style={{ fontSize: '13px', color: '#991b1b', display: 'block', marginBottom: '10px' }}>
              CONFIGURED EMERGENCY SERVICES (Call Immediately)
            </strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <a
                href="tel:108"
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Phone size={22} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>108 Ambulance</div>
                  <div style={{ fontSize: '11px', color: '#fee2e2' }}>Free Emergency Dispatch</div>
                </div>
              </a>

              <a
                href="tel:104"
                style={{
                  background: '#b91c1c',
                  color: '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Phone size={22} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>104 Health Advice</div>
                  <div style={{ fontSize: '11px', color: '#fee2e2' }}>24x7 Medical Helpline</div>
                </div>
              </a>

              <a
                href="tel:06670230450"
                style={{
                  background: '#7f1d1d',
                  color: '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Phone size={22} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>DHH Casualty</div>
                  <div style={{ fontSize: '11px', color: '#fee2e2' }}>06670-230450 (Bhawanipatna)</div>
                </div>
              </a>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
              * Configured emergency services for Kalahandi district deployment.
            </div>
          </div>

          {/* Nearby Emergency Facilities */}
          <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #fecaca', marginBottom: '16px' }}>
            <strong style={{ fontSize: '13px', color: '#7f1d1d', display: 'block', marginBottom: '8px' }}>
              Nearby Emergency Health Facilities (Kalahandi, Odisha)
            </strong>
            <div style={{ display: 'grid', gap: '8px' }}>
              {facilities.slice(0, 2).map((fac) => (
                <div key={fac.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px' }}>
                  <div>
                    <strong style={{ color: '#0f172a' }}>{fac.name}</strong>
                    <div style={{ color: '#64748b' }}>{fac.address} • {fac.distanceKm} km away</div>
                  </div>
                  <a href={`tel:${fac.phone}`} className="btn" style={{ padding: '4px 10px', fontSize: '11px', background: '#ef4444', color: '#fff', border: 'none' }}>
                    Call {fac.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Summary Generator & Sharing */}
          <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #fecaca' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong style={{ fontSize: '13px', color: '#7f1d1d' }}>
                Emergency Clinical Handover Summary
              </strong>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGenerateSummary}
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                <FileText size={12} /> {generatedSummary ? 'Regenerate' : 'Generate Summary'}
              </button>
            </div>

            {generatedSummary && (
              <div>
                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#1e293b', marginBottom: '10px' }}>
                  <div><strong>Patient:</strong> Keshab Rout (RHB-OD-KLH-0941) • Age: 26 • Male • B+</div>
                  <div><strong>Acute Emergency Issue:</strong> {selectedIssue}</div>
                  <div><strong>Location:</strong> Kalahandi District, Odisha (Bhawanipatna Block)</div>
                  <div><strong>Known Allergies:</strong> No known drug allergies</div>
                  <div style={{ color: '#b91c1c', marginTop: '4px' }}><strong>Triage Priority:</strong> RED / IMMEDIATE PHYSICAL INTERVENTION</div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleShareSummary}
                    style={{ fontSize: '12px', padding: '6px 14px' }}
                  >
                    <Share2 size={13} /> Share with 108 Dispatch & ASHA Worker
                  </button>
                  {shareSuccess && (
                    <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Shared successfully!
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: 700 }}>
            Swasthya Path Emergency Guardian • Configured 108/104 Routing
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close Emergency Panel
          </button>
        </div>
      </div>
    </div>
  );
};
