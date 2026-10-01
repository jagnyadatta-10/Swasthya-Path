import React, { useState } from 'react';
import { Pill, X, Download, Share2, Check, AlertCircle, Printer, FileText, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { FullPrescription, PrescriptionMedicine, MedicineItem } from '../types';
import { storage } from '../utils/storage';

interface EPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: FullPrescription | null;
  mode?: 'view' | 'create';
  onPrescriptionSaved?: (newRx: FullPrescription) => void;
  doctorName?: string;
  patientName?: string;
  patientId?: string;
  onCheckStock?: (medName: string) => void;
}

export const EPrescriptionModal: React.FC<EPrescriptionModalProps> = ({
  isOpen,
  onClose,
  prescription,
  mode = 'view',
  onPrescriptionSaved,
  doctorName = 'Dr. Ananya Mishra',
  patientName = 'Keshab Rout',
  patientId = 'RHB-OD-KLH-0941',
  onCheckStock
}) => {
  // Creation form state if mode === 'create'
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: 'm1',
      name: 'Tab Paracetamol (Jan Aushadhi)',
      strength: '500 mg',
      dosage: '1 tablet',
      frequency: 'SOS (When needed for fever > 100°F)',
      duration: '3 days',
      instructions: 'Take after meals with warm water. Maximum 3 tablets in 24 hours.'
    },
    {
      id: 'm2',
      name: 'Oral Rehydration Salts (ORS) Sachet',
      strength: '21.8 g WHO Formula',
      dosage: '1 sachet in 1 Litre water',
      frequency: 'Throughout the day',
      duration: '3 days',
      instructions: 'Sip frequently to maintain hydration and electrolytes.'
    }
  ]);

  const [diagnosisSummary, setDiagnosisSummary] = useState(
    'Acute viral febrile episode with mild asthenia. No red-flag respiratory or hemorrhagic distress noted.'
  );
  const [followUp, setFollowUp] = useState(
    'Follow-up teleconsultation in 3 days if fever does not subside or if warning signs develop.'
  );
  const [clinicalNotes, setClinicalNotes] = useState('Maintain oral fluids and rest. Avoid self-medication with NSAIDs.');
  const [isSaved, setIsSaved] = useState(false);
  const [sharedAlert, setSharedAlert] = useState(false);

  if (!isOpen) return null;

  // Active display prescription
  const currentRx: FullPrescription = prescription || {
    id: 'rx-draft',
    prescriptionNumber: `RX-KLH-2026-0941`,
    patientId,
    patientName,
    doctorName,
    doctorHospital: 'District Headquarters Hospital (DHH) Bhawanipatna Telehealth Unit',
    date: new Date().toLocaleDateString('en-GB'),
    diagnosisSummary,
    medicines,
    followUp,
    notes: clinicalNotes,
    digitalSignature: 'Digitally Authorized by Dr. Ananya Mishra (Reg No: OD-MED-8492)'
  };

  // Nearby Jan Aushadhi & local pharmacy stock
  const allStock = storage.getMedicines();
  const paracetamolStock = allStock.find(m => m.name.toLowerCase().includes('paracetamol')) || allStock[0];
  const orsStock = allStock.find(m => m.name.toLowerCase().includes('ors')) || allStock[1];

  const handleSave = () => {
    const saved = storage.savePrescription({
      patientId,
      patientName,
      doctorName,
      doctorHospital: 'DHH Bhawanipatna Telehealth Unit',
      diagnosisSummary,
      medicines,
      followUp,
      notes: clinicalNotes,
      digitalSignature: `Digitally Authorized by ${doctorName} (Govt Telehealth Verification)`
    });

    setIsSaved(true);
    if (onPrescriptionSaved) onPrescriptionSaved(saved);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  const handleShare = () => {
    setSharedAlert(true);
    setTimeout(() => setSharedAlert(false), 2500);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="rx-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '680px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
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
              <Pill size={18} />
            </div>
            <div>
              <h3 id="rx-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                {mode === 'create' ? 'Authorizing Clinician E-Prescription' : `E-Prescription • ${currentRx.prescriptionNumber}`}
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                Swasthya Path Telehealth Initiative • Odisha MoHFW Workflow
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

        {/* Prescription Paper Preview */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '72vh', overflowY: 'auto' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1.5px solid #cbd5e1',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            position: 'relative'
          }}>
            {/* Header / Watermark */}
            <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', letterSpacing: '0.05em' }}>
                    GOVERNMENT OF ODISHA • DISTRICT HEALTH SOCIETY KALAHANDI
                  </div>
                  <h4 style={{ margin: '2px 0 0', fontSize: '18px', color: '#071c42' }}>
                    {currentRx.doctorHospital}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Consulting Clinician: <strong>{currentRx.doctorName}</strong> (General Medicine)
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>
                    {currentRx.prescriptionNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Date: <strong>{currentRx.date}</strong>
                  </div>
                </div>
              </div>

              {/* Patient Banner */}
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: '#f0f9ff',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                fontSize: '12px'
              }}>
                <div><span style={{ color: '#64748b' }}>Patient:</span> <strong>{currentRx.patientName}</strong></div>
                <div><span style={{ color: '#64748b' }}>Patient ID:</span> <strong style={{ color: '#0284c7' }}>{currentRx.patientId}</strong></div>
                <div><span style={{ color: '#64748b' }}>Age/Sex:</span> <strong>24 Y / F</strong></div>
                <div><span style={{ color: '#64748b' }}>District:</span> <strong>Kalahandi</strong></div>
              </div>
            </div>

            {/* Clinical Evaluation Summary */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                Clinical Impression & Assessment
              </div>
              <div style={{ fontSize: '13px', color: '#0f172a', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                {currentRx.diagnosisSummary}
              </div>
            </div>

            {/* Prescribed Medicines Table (Rx) */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#0284c7', fontFamily: 'serif' }}>℞</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#071c42', textTransform: 'uppercase' }}>
                  Prescribed Medicines (Fictional Demo Formulation)
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                    <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Medicine & Strength</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Dosage & Timing</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Duration</th>
                    <th style={{ padding: '8px', textAlign: 'left' }}>Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRx.medicines.map((m, idx) => (
                    <tr key={m.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '8px' }}>
                        <strong style={{ color: '#0f172a' }}>{m.name}</strong>
                        <div style={{ color: '#0284c7', fontSize: '11px' }}>{m.strength}</div>
                      </td>
                      <td style={{ padding: '8px', color: '#334155' }}>
                        {m.dosage} • <strong>{m.frequency}</strong>
                      </td>
                      <td style={{ padding: '8px', fontWeight: 600 }}>{m.duration}</td>
                      <td style={{ padding: '8px', color: '#64748b', fontSize: '11px' }}>{m.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Local Medicine Availability Preview (MANDATORY REQUIREMENT) */}
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} style={{ color: '#16a34a' }} />
                  <strong style={{ fontSize: '12px', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    LOCAL MEDICINE AVAILABILITY (Kalahandi Pharmacies)
                  </strong>
                </div>
                <span style={{ fontSize: '10px', color: '#15803d', fontStyle: 'italic' }}>
                  * Availability depends on pharmacy updates.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '11px' }}>
                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{paracetamolStock.name}</div>
                  <div style={{ color: '#64748b' }}>{paracetamolStock.pharmacyName} ({paracetamolStock.block})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>{paracetamolStock.status}</span>
                    <span style={{ color: '#64748b' }}>Updated {paracetamolStock.lastUpdated}</span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{orsStock.name}</div>
                  <div style={{ color: '#64748b' }}>{orsStock.pharmacyName} ({orsStock.block})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>{orsStock.status}</span>
                    <span style={{ color: '#64748b' }}>Updated {orsStock.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Diagram Connection: Doctor Consult -> Care Advice & Medicine -> Find Medicine -> Pharmacy Availability (Store A, B, C) */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={15} /> Find Medicine at Local Stores
                </strong>
                <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px' }}>
                  Check live availability in Store A (Jan Aushadhi), Store B (Junagarh), and Store C (Chhoriagarh).
                </div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  if (onCheckStock) onCheckStock('Paracetamol 500mg');
                }}
                style={{ background: '#16a34a', border: 'none', padding: '8px 14px', fontSize: '12px', fontWeight: 800, borderRadius: '8px', cursor: 'pointer' }}
              >
                Check Pharmacy Availability ➔
              </button>
            </div>

            {/* Follow-up & Advice */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: '#b45309', display: 'block', marginBottom: '4px' }}>Advice / General Measures:</strong>
                <span style={{ color: '#78350f' }}>{currentRx.notes}</span>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: '#0369a1', display: 'block', marginBottom: '4px' }}>Follow-up Schedule:</strong>
                <span style={{ color: '#334155' }}>{currentRx.followUp}</span>
              </div>
            </div>

            {/* Digital Signature & Disclaimer */}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', maxWidth: '320px' }}>
                Demo Telehealth E-Prescription issued via Swasthya Path Kalahandi platform. Fictional prototype formulation for demonstration only.
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                  <ShieldCheck size={14} /> {currentRx.digitalSignature}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>e-Signed at {currentRx.date}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{
          padding: '14px 20px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            {sharedAlert && (
              <span style={{ color: '#059669', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={14} /> Shared to patient records & SMS notification simulated!
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => alert(`Printing E-Prescription ${currentRx.prescriptionNumber}...`)}
            >
              <Printer size={14} /> Print / PDF
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleShare}
            >
              <Share2 size={14} /> Share with Patient
            </button>

            {mode === 'create' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                style={{ fontWeight: 800 }}
              >
                {isSaved ? <Check size={14} /> : <FileText size={14} />}
                <span>{isSaved ? 'Prescription Saved!' : 'Save Prescription'}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
