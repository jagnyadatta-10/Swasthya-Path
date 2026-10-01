import React, { useState } from 'react';
import {
  ClipboardList,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  X,
  Activity,
  User,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { CarePlan } from '../types';
import { storage } from '../utils/storage';

interface CarePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  patientName?: string;
  patientId?: string;
  onSaved?: (plan: CarePlan) => void;
}

export const CarePlanModal: React.FC<CarePlanModalProps> = ({
  isOpen,
  onClose,
  doctorName,
  patientName = 'Keshab Rout',
  patientId = 'RHB-OD-KLH-0941',
  onSaved
}) => {
  const [diagnosis, setDiagnosis] = useState('Acute Febrile Illness / Viral Syndrome');
  const [followUpDate, setFollowUpDate] = useState('2026-10-07');
  const [followUpMode, setFollowUpMode] = useState<'Teleconsultation' | 'Physical PHC Review' | 'Specialist Referral'>('Teleconsultation');
  const [instructions, setInstructions] = useState('Maintain oral hydration with ORS and fresh fluids. Rest adequately. Record temperature twice daily.');
  const [selectedTests, setSelectedTests] = useState<string[]>(['CBC / Hemoglobin', 'Malaria Rapid Antigen Test (RDT)']);
  const [referralFacility, setReferralFacility] = useState('');
  const [medicinePlan, setMedicinePlan] = useState('Tab Paracetamol 500mg TDS after meals x 3 days; ORS sachets as required.');
  const [selectedWarnings, setSelectedWarnings] = useState<string[]>([
    'High fever > 103°F not subsiding with medication',
    'Severe breathing difficulty or chest heaviness'
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const testOptions = [
    'CBC / Hemoglobin',
    'Malaria Rapid Antigen Test (RDT)',
    'Blood Glucose (Fasting / Post-prandial)',
    'Sputum Smear / GeneXpert',
    'Urine Routine Examination',
    'Serum Creatinine & Electrolytes'
  ];

  const warningOptions = [
    'High fever > 103°F not subsiding with medication',
    'Severe breathing difficulty or chest heaviness',
    'Inability to retain liquids / continuous vomiting',
    'Sudden fainting, confusion, or marked lethargy',
    'Signs of abnormal bleeding or rash'
  ];

  const toggleTest = (test: string) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
  };

  const toggleWarning = (warning: string) => {
    setSelectedWarnings((prev) =>
      prev.includes(warning) ? prev.filter((w) => w !== warning) : [...prev, warning]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newPlan: CarePlan = {
      id: `cp-${Date.now()}`,
      patientId,
      patientName,
      doctorName,
      diagnosis,
      followUpDate,
      followUpMode,
      instructions,
      requiredTests: selectedTests,
      referralFacility: referralFacility || undefined,
      medicinePlan,
      warningSignsToWatch: selectedWarnings,
      status: 'Active'
    };

    storage.saveCarePlan(newPlan);
    storage.addAuditLog(`Doctor created care plan for ${patientName} (Follow-up: ${followUpDate})`, doctorName);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onSaved) onSaved(newPlan);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-dialog" style={{ maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#071c42' }}>
                Create Patient Care Plan & Follow-up
              </h3>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                eSanjeevani-inspired clinical discharge & continuous care engine (Prompt Section 32)
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 0, color: '#64748b', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Patient & Doctor Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
          <div>
            <span style={{ color: '#64748b' }}>Patient:</span> <strong>{patientName}</strong> ({patientId})
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Treating Clinician:</span> <strong>{doctorName}</strong>
          </div>
        </div>

        {savedSuccess ? (
          <div style={{ padding: '36px 20px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ margin: '0 0 6px', color: '#15803d' }}>Care Plan Successfully Created!</h3>
            <p style={{ fontSize: '13px', color: '#475569' }}>
              Follow-up scheduled for <strong>{followUpDate}</strong> ({followUpMode}). Patient dashboard updated with next care step.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Diagnosis / Clinical Assessment */}
            <div className="field">
              <label style={{ fontSize: '13px', fontWeight: 700 }}>
                1. Clinical Diagnosis / Impression
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* Follow-up Timing & Mode */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  2. Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  3. Follow-up Mode
                </label>
                <select
                  value={followUpMode}
                  onChange={(e) => setFollowUpMode(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Teleconsultation">Teleconsultation (Digital Video/Audio)</option>
                  <option value="Physical PHC Review">In-Person PHC / CHC Review</option>
                  <option value="Specialist Referral">Specialist Referral Review</option>
                </select>
              </div>
            </div>

            {/* Instructions */}
            <div className="field">
              <label style={{ fontSize: '13px', fontWeight: 700 }}>
                4. Patient Care Instructions & Lifestyle Guidance
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                placeholder="Specific guidance for patient (diet, rest, hydration, monitoring)..."
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* Medicine Plan Summary */}
            <div className="field">
              <label style={{ fontSize: '13px', fontWeight: 700 }}>
                5. Prescribed Regimen / Medicine Plan
              </label>
              <input
                type="text"
                value={medicinePlan}
                onChange={(e) => setMedicinePlan(e.target.value)}
                placeholder="Medicines and frequencies agreed upon..."
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* Required Tests Checklist */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                6. Required Diagnostic Tests (Before Next Review)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {testOptions.map((test) => (
                  <label
                    key={test}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      background: selectedTests.includes(test) ? '#eff6ff' : '#f8fafc',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: selectedTests.includes(test) ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTests.includes(test)}
                      onChange={() => toggleTest(test)}
                    />
                    <span>{test}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Warning Signs to Watch */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#991b1b' }}>
                7. Red Flag Warning Signs (Seek Immediate Physical Care if Occurring)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                {warningOptions.map((warn) => (
                  <label
                    key={warn}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      background: selectedWarnings.includes(warn) ? '#fef2f2' : '#f8fafc',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: selectedWarnings.includes(warn) ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedWarnings.includes(warn)}
                      onChange={() => toggleWarning(warn)}
                    />
                    <span style={{ color: selectedWarnings.includes(warn) ? '#991b1b' : '#334155' }}>{warn}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Referral Facility if applicable */}
            {followUpMode === 'Specialist Referral' && (
              <div className="field">
                <label style={{ fontSize: '13px', fontWeight: 700 }}>
                  Referral Hospital / Center
                </label>
                <input
                  type="text"
                  value={referralFacility}
                  onChange={(e) => setReferralFacility(e.target.value)}
                  placeholder="e.g. District Headquarters Hospital (DHH) Bhawanipatna or MKCG Berhampur"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            )}

            {/* Safety Disclaimer */}
            <div style={{ background: '#f8fafc', borderLeft: '3px solid #0284c7', padding: '10px 14px', borderRadius: '6px', fontSize: '11px', color: '#475569', marginBottom: '16px' }}>
              <strong>CLINICAL SAFETY MANDATE:</strong> AI assists intake and documentation; licensed doctors decide and authorize all care plans. This care plan will sync to the patient's local offline sandbox.
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontWeight: 800 }}
              >
                <FileCheck size={16} /> Authorize & Issue Care Plan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
