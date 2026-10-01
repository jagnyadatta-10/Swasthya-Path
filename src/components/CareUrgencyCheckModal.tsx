import React, { useState } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  Calendar,
  FileText,
  Activity,
  Heart,
  HelpCircle,
  MapPin,
  Share2
} from 'lucide-react';
import { WarningSignId, CareCategory } from '../types';
import { storage } from '../utils/storage';

interface CareUrgencyCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToQueue: () => void;
  onNavigateToEmergency: () => void;
  onNavigateToFacilities: () => void;
}

const COMMON_SYMPTOMS = [
  'Fever',
  'Cough',
  'Cold',
  'Pain / Body ache',
  'Weakness',
  'Breathing problem',
  'Vomiting',
  'Diarrhea',
  'Headache',
  'Injury / Cut',
  'Skin rash / Itching',
  'Mental health / Anxiety',
  'Other concern'
];

export const CareUrgencyCheckModal: React.FC<CareUrgencyCheckModalProps> = ({
  isOpen,
  onClose,
  onNavigateToQueue,
  onNavigateToEmergency,
  onNavigateToFacilities
}) => {
  const [selectedSymptom, setSelectedSymptom] = useState<string>('Fever');
  const [customSymptom, setCustomSymptom] = useState('');
  const [duration, setDuration] = useState('2–3 days');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [trend, setTrend] = useState<'Getting worse' | 'Same' | 'Improving'>('Getting worse');
  const [warningSign, setWarningSign] = useState<WarningSignId>('no');

  // Outcome Category state: null | 'low' | 'intermediate' | 'emergency'
  const [resultCategory, setResultCategory] = useState<CareCategory | null>(null);

  if (!isOpen) return null;

  const currentConcern = selectedSymptom === 'Other concern' && customSymptom ? customSymptom : selectedSymptom;

  const handleEvaluate = () => {
    // If high-risk red flag selected -> EMERGENCY CATEGORY (Red)
    if (warningSign !== 'no' || (selectedSymptom === 'Breathing problem' && severity === 'Severe')) {
      setResultCategory('emergency');
      storage.addAuditLog(`Care Urgency Check: Triggered EMERGENCY for ${currentConcern}`, 'Keshab Rout');
      return;
    }

    // If moderate or severe without red flags -> INTERMEDIATE / CLINICAL REVIEW (Amber)
    if (severity === 'Severe' || severity === 'Moderate' || trend === 'Getting worse') {
      setResultCategory('intermediate');
      storage.addToTriageQueue({
        patientId: 'RHB-OD-KLH-0941',
        patientName: 'Keshab Rout',
        age: 26,
        gender: 'Male',
        village: 'Kalahandi',
        symptoms: `${currentConcern} (${trend}, ${severity} severity)`,
        duration,
        warningSign: 'None',
        urgency: 'moderate',
        aiSummary: `Priority Review: Patient reported ${currentConcern} for ${duration} with ${severity.toLowerCase()} severity. Clinical review recommended.`
      });
      storage.addAuditLog(`Care Urgency Check: Evaluated as INTERMEDIATE for ${currentConcern}`, 'Keshab Rout');
      return;
    }

    // Otherwise -> LOW / ROUTINE (Green)
    setResultCategory('low');
    storage.saveRecord({
      patientId: 'RHB-OD-KLH-0941',
      type: 'symptom',
      symptoms: `${currentConcern} (${severity}, ${trend})`,
      duration,
      warningSign: 'None selected',
      pathway: 'routine care monitoring',
      urgency: 'routine',
      synced: true
    });
    storage.addAuditLog(`Care Urgency Check: Evaluated as ROUTINE for ${currentConcern}`, 'Keshab Rout');
  };

  const handleReset = () => {
    setResultCategory(null);
    setWarningSign('no');
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="urgency-check-title">
      <div className="modal-dialog" style={{ maxWidth: '640px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
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
              <Sparkles size={18} />
            </div>
            <div>
              <h3 id="urgency-check-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                Care Urgency Check & Pathway Navigation
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                AI assists. Doctors decide. • Low / Intermediate / Emergency Screening
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

        {/* Screening Content */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '74vh', overflowY: 'auto' }}>
          {!resultCategory ? (
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '14px', fontWeight: 800, color: '#071c42', display: 'block', marginBottom: '8px' }}>
                  Tell us what is bothering you today:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {COMMON_SYMPTOMS.map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setSelectedSymptom(sym)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: selectedSymptom === sym ? '2px solid #0284c7' : '1px solid #cbd5e1',
                        background: selectedSymptom === sym ? '#e0f2fe' : '#ffffff',
                        color: selectedSymptom === sym ? '#0369a1' : '#334155'
                      }}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>

              {selectedSymptom === 'Other concern' && (
                <div className="field" style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Describe other health concern:</label>
                  <input
                    type="text"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    placeholder="e.g. Ear discharge or stomach cramps"
                  />
                </div>
              )}

              {/* Questions: Duration, Severity, Trend */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>How long?</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value="Today (under 24h)">Today (under 24h)</option>
                    <option value="2–3 days">2–3 days</option>
                    <option value="1 week">1 week</option>
                    <option value="More than a week">More than a week</option>
                  </select>
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Severity</label>
                  <select value={severity} onChange={(e) => setSeverity(e.target.value as any)}>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                <div className="field">
                  <label style={{ fontSize: '12px', fontWeight: 700 }}>Progression</label>
                  <select value={trend} onChange={(e) => setTrend(e.target.value as any)}>
                    <option value="Getting worse">Getting worse</option>
                    <option value="Same">Same</option>
                    <option value="Improving">Improving</option>
                  </select>
                </div>
              </div>

              {/* Safety Warning Signs Selection */}
              <div className="field" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#b42318' }}>
                  Safety Check: Any of these serious warning signs?
                </label>
                <select
                  value={warningSign}
                  onChange={(e) => setWarningSign(e.target.value as WarningSignId)}
                  style={{
                    borderColor: warningSign !== 'no' ? '#b42318' : '#cbd5e1',
                    background: warningSign !== 'no' ? '#fff5f5' : '#ffffff'
                  }}
                >
                  <option value="no">✓ No warning signs present</option>
                  <option value="breathing">🚨 Severe difficulty breathing / gasping</option>
                  <option value="chest">🚨 Severe chest pain / tight pressure</option>
                  <option value="unconscious">🚨 Loss of consciousness / fainting</option>
                  <option value="bleeding">🚨 Severe or uncontrollable bleeding</option>
                  <option value="stroke">🚨 Sudden face droop / speech slurring</option>
                </select>
              </div>

              {/* Clinical Principle Notice */}
              <div style={{
                background: '#f0f9ff',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#0369a1',
                borderLeft: '3px solid #0284c7',
                marginBottom: '16px'
              }}>
                <strong>Clinical Principle:</strong> “AI assists. Doctors decide. Do not wait for an online consultation if immediate physical medical care is required.”
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleEvaluate}
                style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 800 }}
              >
                Determine Appropriate Care Pathway
              </button>
            </div>
          ) : (
            /* Result Screen based on Category */
            <div>
              {resultCategory === 'emergency' && (
                <div style={{
                  background: '#fef2f2',
                  border: '2px solid #ef4444',
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#991b1b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <ShieldAlert size={28} color="#dc2626" />
                    <div>
                      <span className="badge badge-red" style={{ fontSize: '11px' }}>CATEGORY C — EMERGENCY</span>
                      <h3 style={{ margin: '4px 0 0', color: '#7f1d1d', fontSize: '20px' }}>
                        Immediate Medical Attention May Be Required
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#7f1d1d' }}>
                    <strong>Warning:</strong> Predefined high-risk warning signs were identified. Routine teleconsultation is <strong>STOPPED</strong> for your safety.
                  </p>

                  <div style={{ background: '#ffffff', padding: '14px', borderRadius: '10px', border: '1px solid #fecaca', margin: '14px 0' }}>
                    <strong style={{ display: 'block', marginBottom: '6px', color: '#991b1b' }}>Recommended Emergency Actions:</strong>
                    <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                      • Call <strong>108 Configured Emergency Ambulance</strong> immediately.<br />
                      • Proceed directly to District Headquarters Hospital (DHH) Bhawanipatna Emergency Room.<br />
                      • Do not stay alone or attempt self-medication.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <a
                      href="tel:108"
                      className="btn btn-danger"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}
                    >
                      <Phone size={16} /> Call 108 Ambulance
                    </a>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        onClose();
                        onNavigateToEmergency();
                      }}
                      style={{ background: '#ffffff', color: '#dc2626', borderColor: '#fca5a5' }}
                    >
                      Open Emergency Center
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleReset}
                      style={{ color: '#64748b' }}
                    >
                      Restart Check
                    </button>
                  </div>
                </div>
              )}

              {resultCategory === 'intermediate' && (
                <div style={{
                  background: '#fffbeb',
                  border: '2px solid #f59e0b',
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#92400e'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <AlertTriangle size={28} color="#d97706" />
                    <div>
                      <span className="badge badge-amber" style={{ fontSize: '11px' }}>CATEGORY B — CLINICAL REVIEW</span>
                      <h3 style={{ margin: '4px 0 0', color: '#78350f', fontSize: '20px' }}>
                        Your Symptoms Need Review by a Healthcare Professional
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#78350f' }}>
                    Reported: <strong>{currentConcern}</strong> ({severity}, {trend}). Sent to clinician dashboard as <strong>Priority Review</strong>.
                  </p>

                  <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fde68a', margin: '14px 0', fontSize: '12px' }}>
                    <strong>Navigation result — not a medical diagnosis.</strong> A medical officer will review your complaint in the consultation queue.
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        onClose();
                        onNavigateToQueue();
                      }}
                      style={{ fontWeight: 800 }}
                    >
                      <Clock size={16} /> Join Priority Doctor Queue
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        onClose();
                        onNavigateToFacilities();
                      }}
                    >
                      <MapPin size={16} /> Find Nearby Facility
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleReset}
                    >
                      Re-check
                    </button>
                  </div>
                </div>
              )}

              {resultCategory === 'low' && (
                <div style={{
                  background: '#f0fdf4',
                  border: '2px solid #22c55e',
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#166534'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <CheckCircle2 size={28} color="#16a34a" />
                    <div>
                      <span className="badge badge-green" style={{ fontSize: '11px' }}>CATEGORY A — ROUTINE CARE</span>
                      <h3 style={{ margin: '4px 0 0', color: '#14532d', fontSize: '20px' }}>
                        Routine Monitoring & Self-Care Guidance
                      </h3>
                    </div>
                  </div>

                  <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#166534', margin: '10px 0' }}>
                    “Based on the information entered, no urgent warning flag was identified by this screening. If symptoms worsen or new warning signs appear, seek medical care.”
                  </p>

                  <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #bbf7d0', margin: '14px 0', fontSize: '12px' }}>
                    ✓ Recommended: Rest, oral hydration, and routine symptom tracking.<br />
                    ✓ You can schedule a routine teleconsultation at your convenience.
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        onClose();
                        onNavigateToQueue();
                      }}
                    >
                      <Calendar size={15} /> Book Routine Doctor Consult
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        alert('Symptom entry saved to your offline health notes log!');
                        onClose();
                      }}
                    >
                      <FileText size={15} /> Save Health Note
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={handleReset}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
