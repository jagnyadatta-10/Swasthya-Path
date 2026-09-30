import React, { useState } from 'react';
import {
  HeartPulse,
  X,
  Baby,
  Syringe,
  Activity,
  Smile,
  Eye,
  Ear,
  SmilePlus,
  Shield,
  Clock,
  Phone,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { storage } from '../utils/storage';

interface PrimaryCareServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToQueue: () => void;
}

export const PrimaryCareServicesModal: React.FC<PrimaryCareServicesModalProps> = ({
  isOpen,
  onClose,
  onNavigateToQueue
}) => {
  const [activeCategory, setActiveCategory] = useState<'aam' | 'mental' | 'ncd' | 'tb'>('aam');

  // Mental Health (Tele-MANAS) states
  const [mentalFeeling, setMentalFeeling] = useState('Feeling stressed / overwhelmed');
  const [mentalSubmitted, setMentalSubmitted] = useState(false);

  const ncd = storage.getNcd();
  const tb = storage.getTb();

  if (!isOpen) return null;

  const handleMentalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMentalSubmitted(true);
    storage.addNotification({
      title: 'Tele-MANAS Support Request',
      body: `Demo notification: Mental well-being teleconsultation request logged for ${mentalFeeling}.`,
      type: 'doctor'
    });
    storage.addAuditLog(`Tele-MANAS request logged for ${mentalFeeling}`, 'Rina Das');
    setTimeout(() => {
      setMentalSubmitted(false);
      onClose();
      onNavigateToQueue();
    }, 1800);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="aam-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '680px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
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
              <HeartPulse size={18} />
            </div>
            <div>
              <h3 id="aam-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                Comprehensive Primary Health Services
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                Ayushman Arogya Mandir (AAM), Tele-MANAS & Longitudinal Support Modules
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

        {/* Category Tabs */}
        <div style={{ display: 'flex', background: '#e2e8f0', borderBottom: '1px solid #cbd5e1', padding: '4px 10px', gap: '6px', overflowX: 'auto' }}>
          <button
            type="button"
            className={`tab-btn ${activeCategory === 'aam' ? 'active' : ''}`}
            onClick={() => setActiveCategory('aam')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            AAM Primary Care (12 Packages)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeCategory === 'mental' ? 'active' : ''}`}
            onClick={() => setActiveCategory('mental')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Mental Well-Being (Tele-MANAS)
          </button>
          <button
            type="button"
            className={`tab-btn ${activeCategory === 'ncd' ? 'active' : ''}`}
            onClick={() => setActiveCategory('ncd')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            NCD Chronic Care
          </button>
          <button
            type="button"
            className={`tab-btn ${activeCategory === 'tb' ? 'active' : ''}`}
            onClick={() => setActiveCategory('tb')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            Long-Term Treatment (TB)
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '72vh', overflowY: 'auto' }}>
          {/* CATEGORY 1: AAM 12 Essential Primary Care Packages */}
          {activeCategory === 'aam' && (
            <div>
              <div style={{ background: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '11px', color: '#0369a1', marginBottom: '14px' }}>
                * Operational navigation categories aligned with Ayushman Arogya Mandir (AAM) guidelines for rural Odisha.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', marginBottom: '4px' }}>
                    <Baby size={18} />
                    <strong style={{ fontSize: '13px' }}>Maternal & Child</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Antenatal checks, anemia screening, and infant growth monitoring.</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', marginBottom: '4px' }}>
                    <Syringe size={18} />
                    <strong style={{ fontSize: '13px' }}>Immunisation</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Universal vaccination schedule & local ASHA session tracking.</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', marginBottom: '4px' }}>
                    <Activity size={18} />
                    <strong style={{ fontSize: '13px' }}>NCD Screening</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Hypertension, diabetes & oral/breast/cervical cancer awareness.</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7c3aed', marginBottom: '4px' }}>
                    <Smile size={18} />
                    <strong style={{ fontSize: '13px' }}>Mental Health</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Stress reduction, counseling & Tele-MANAS district linkage.</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', marginBottom: '4px' }}>
                    <Eye size={18} />
                    <strong style={{ fontSize: '13px' }}>Eye & Vision Care</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Cataract screening & basic refraction referrals at CHC.</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0891b2', marginBottom: '4px' }}>
                    <Ear size={18} />
                    <strong style={{ fontSize: '13px' }}>ENT Care</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Ear discharge, hearing loss & chronic throat infection reviews.</p>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    onClose();
                    onNavigateToQueue();
                  }}
                >
                  Schedule Tele-Consultation for Primary Care
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 2: Mental Well-Being (Tele-MANAS) */}
          {activeCategory === 'mental' && (
            <div>
              <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6d28d9', fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>
                  <Smile size={18} />
                  <span>Tele-MANAS Mental Well-Being Pathway</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#5b21b6', lineHeight: 1.5 }}>
                  Confidential emotional well-being check and counselor connection. In accordance with clinical safety principles, AI does not diagnose psychiatric disorders.
                </p>
              </div>

              <form onSubmit={handleMentalSubmit}>
                <div className="field" style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700 }}>How are you feeling?</label>
                  <select
                    value={mentalFeeling}
                    onChange={(e) => setMentalFeeling(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Feeling stressed / overwhelmed">Feeling stressed / overwhelmed with daily work</option>
                    <option value="Feeling anxious / restless">Feeling anxious or restless</option>
                    <option value="Low mood / lack of interest">Low mood / feeling sad for several days</option>
                    <option value="Sleep difficulty / insomnia">Sleep difficulty / waking up tired</option>
                    <option value="Need someone to talk to">Need someone supportive to talk to</option>
                  </select>
                </div>

                {/* 24x7 Tele-MANAS Helpline Linkage */}
                <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>National Tele-MANAS Helpline</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Toll-Free 24x7 Mental Health Counseling</div>
                  </div>
                  <a href="tel:14416" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <Phone size={13} /> Dial 14416
                  </a>
                </div>

                {mentalSubmitted && (
                  <div className="alert ok" style={{ marginBottom: '12px' }}>
                    <CheckCircle2 size={16} /> Tele-counseling appointment requested! Transitioning to queue...
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                    Request Supportive Tele-Counseling
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CATEGORY 3: NCD Chronic Care */}
          {activeCategory === 'ncd' && (
            <div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px', marginBottom: '14px', fontSize: '12px', color: '#92400e' }}>
                * Longitudinal Non-Communicable Disease (NCD) chronic care tracker (Kalahandi NCD Cell demo).
              </div>

              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1.5px solid #cbd5e1', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '16px', color: '#071c42' }}>{ncd.condition} Management Plan</strong>
                  <span className="badge badge-green">{ncd.status}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#334155', marginBottom: '8px' }}>
                  <strong>Care Protocol:</strong> {ncd.carePlan}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Last Reading:</span> <strong>{ncd.lastReading}</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Target Goal:</span> <strong>{ncd.targetGoal}</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>Adherence:</span> <strong style={{ color: '#16a34a' }}>{ncd.adherencePercent}%</strong>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '10px', fontWeight: 600 }}>
                  Next Follow-up Due: {ncd.nextFollowUp}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 4: Long-Term TB Treatment Module */}
          {activeCategory === 'tb' && (
            <div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', marginBottom: '14px', fontSize: '12px', color: '#166534' }}>
                * Government-program integration concept — prototype only (Inspired by Ni-kshay longitudinal treatment workflows).
              </div>

              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1.5px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '15px', color: '#071c42' }}>Tuberculosis Treatment Support</strong>
                  <span className="badge badge-green">{tb.status}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#334155', marginBottom: '6px' }}>
                  Regimen: <strong>{tb.regimen}</strong> ({tb.phase})
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  DOTS Center: {tb.dotsCenter} • Next Sputum Smear: <strong>{tb.nextSputumTest}</strong>
                </div>

                {/* Progress Bar */}
                <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '10px', overflow: 'hidden', margin: '12px 0 6px' }}>
                  <div style={{ width: `${(tb.treatmentMonthsCompleted / tb.totalMonths) * 100}%`, height: '100%', background: '#16a34a' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span>Completed: {tb.treatmentMonthsCompleted} of {tb.totalMonths} months</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>Adherence: {tb.adherencePercent}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
