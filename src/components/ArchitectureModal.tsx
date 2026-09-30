import React from 'react';
import { X, Layers, Cpu, Database, Network, ShieldCheck, HeartPulse, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="arch-title">
      <div className="modal-dialog" style={{ maxWidth: '840px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={22} />
            </div>
            <div>
              <h2 id="arch-title" style={{ margin: 0, fontSize: '20px' }}>Swasthya Path: System Architecture</h2>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--muted)' }}>
                Offline-First • Clinical Safety Enforced • High Scalability for Underserved Rural Districts
              </p>
            </div>
          </div>
          <button className="btn" onClick={onClose} style={{ borderRadius: '50%', minHeight: '36px', padding: '6px 10px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Core Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
              <Network size={18} />
              <span>1. Offline-First Resilience</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
              Local edge storage sandbox (IndexedDB / localStorage) preserves full patient records, past prescriptions, and vitals without active cellular signals. When connectivity drops to 2G/EDGE, payload sizes drop to &lt;3KB with delta sync.
            </p>
          </div>

          <div style={{ padding: '16px', background: '#fef3f2', borderRadius: '12px', border: '1px solid #fecdca' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b42318', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
              <ShieldCheck size={18} />
              <span>2. Clinical Safety Guardrails</span>
            </div>
            <p style={{ fontSize: '13px', color: '#7a271a', margin: 0, lineHeight: 1.5 }}>
              AI is strictly an <strong>intake and navigation aid</strong>, NEVER a diagnostic engine. Deterministic rule-based red-flag filters intercept acute emergencies (chest pain, dyspnea, stroke signs) and route directly to 108 / physical PHC emergency.
            </p>
          </div>

          <div style={{ padding: '16px', background: '#ecfdf3', borderRadius: '12px', border: '1px solid #a6f4c5' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#027a48', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
              <HeartPulse size={18} />
              <span>3. Integrated Care Ecosystem</span>
            </div>
            <p style={{ fontSize: '13px', color: '#054f31', margin: 0, lineHeight: 1.5 }}>
              Triangulates rural patient, district hospital tele-clinician, and local Jan Aushadhi / chemist stock in real time. Eliminates 70%+ of futile 20km+ bus journeys to distant towns where medicines or doctors are unavailable.
            </p>
          </div>

          <div style={{ padding: '16px', background: '#f5f3ff', borderRadius: '12px', border: '1px solid #ddd6fe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6d28d9', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
              <Database size={18} />
              <span>4. ABDM & FHIR Interoperability</span>
            </div>
            <p style={{ fontSize: '13px', color: '#5b21b6', margin: 0, lineHeight: 1.5 }}>
              Data models align with Ayushman Bharat Digital Mission (ABDM) and HL7 FHIR standards for seamless migration from village ASHA worker tablets to tertiary referral apex hospitals across India.
            </p>
          </div>
        </div>

        {/* Architecture Data Flow Diagram */}
        <div style={{ background: '#061126', color: '#ffffff', padding: '20px', borderRadius: '14px', marginBottom: '20px', border: '1px solid rgba(25, 211, 255, 0.2)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#19d3ff', marginBottom: '12px', letterSpacing: '0.04em' }}>
            END-TO-END CARE NAVIGATION PIPELINE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap', fontSize: '12px' }}>
            <div style={{ background: '#0f244c', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e3a8a', textAlign: 'center', flex: 1, minWidth: '120px' }}>
              <div style={{ color: '#93c5fd', fontWeight: 700 }}>Rural Patient</div>
              <div style={{ color: '#cbd5e1', fontSize: '11px' }}>Voice/Text Intake (Odia, Hindi, Eng)</div>
            </div>
            <div style={{ color: '#19d3ff', fontWeight: 700 }}>➔</div>
            <div style={{ background: '#0f244c', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e3a8a', textAlign: 'center', flex: 1, minWidth: '120px' }}>
              <div style={{ color: '#f87171', fontWeight: 700 }}>Red Flag Filter</div>
              <div style={{ color: '#cbd5e1', fontSize: '11px' }}>Deterministic Emergency Triaging</div>
            </div>
            <div style={{ color: '#19d3ff', fontWeight: 700 }}>➔</div>
            <div style={{ background: '#0f244c', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e3a8a', textAlign: 'center', flex: 1, minWidth: '120px' }}>
              <div style={{ color: '#6ee7b7', fontWeight: 700 }}>Tele-Clinician</div>
              <div style={{ color: '#cbd5e1', fontSize: '11px' }}>Structured Summary & Decision</div>
            </div>
            <div style={{ color: '#19d3ff', fontWeight: 700 }}>➔</div>
            <div style={{ background: '#0f244c', padding: '10px 14px', borderRadius: '8px', border: '1px solid #1e3a8a', textAlign: 'center', flex: 1, minWidth: '120px' }}>
              <div style={{ color: '#fde047', fontWeight: 700 }}>Local Pharmacy</div>
              <div style={{ color: '#cbd5e1', fontSize: '11px' }}>Live Stock & Hold Request</div>
            </div>
          </div>
        </div>

        {/* Stakeholder Impact Highlights */}
        <div>
          <h4 style={{ fontSize: '14px', color: 'var(--navy-mid)', marginBottom: '10px' }}>
            Key Stakeholder Impact:
          </h4>
          <ul style={{ listStyle: 'none', display: 'grid', gap: '8px', fontSize: '13px', color: 'var(--ink)' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
              <span><strong>Rural Daily-Wage Workers & Farmers:</strong> Saves an estimated ₹300–₹500 per episode in transport and avoids lost day wages.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
              <span><strong>Doctors & Hospital Staff:</strong> Pre-screened, structured symptom summaries accelerate teleconsultation throughput by 3x.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
              <span><strong>Village Pharmacies:</strong> Live inventory alerts prevent stockouts of critical drugs (ORS, antipyretics, insulin).</span>
            </li>
          </ul>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Close Architecture Overview
          </button>
        </div>
      </div>
    </div>
  );
};
