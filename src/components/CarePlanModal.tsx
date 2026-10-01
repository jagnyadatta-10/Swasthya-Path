import React, { useState, useEffect } from 'react';
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
import { CarePlan, Language } from '../types';
import { storage } from '../utils/storage';

interface CarePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  patientName?: string;
  patientId?: string;
  onSaved?: (plan: CarePlan) => void;
  lang?: Language;
}

const PLAN_I18N: Record<Language, {
  title: string;
  sub: string;
  patientLabel: string;
  doctorLabel: string;
  successTitle: string;
  successDesc: string;
  diagLabel: string;
  followUpDateLabel: string;
  followUpModeLabel: string;
  modeTele: string;
  modePhc: string;
  modeReferral: string;
  instructionsLabel: string;
  regimenLabel: string;
  testsLabel: string;
  warningsLabel: string;
  btnCancel: string;
  btnSave: string;
}> = {
  English: {
    title: 'Create Patient Care Plan & Follow-up',
    sub: 'eSanjeevani-inspired clinical discharge & continuous care engine (Prompt Section 32)',
    patientLabel: 'Patient:',
    doctorLabel: 'Treating Clinician:',
    successTitle: 'Care Plan Successfully Created!',
    successDesc: 'Follow-up scheduled. Patient dashboard updated with next care step.',
    diagLabel: '1. Clinical Diagnosis / Impression',
    followUpDateLabel: '2. Next Follow-up Date',
    followUpModeLabel: '3. Follow-up Mode',
    modeTele: 'Teleconsultation (Digital Video/Audio)',
    modePhc: 'In-Person PHC / CHC Review',
    modeReferral: 'Specialist Referral Review',
    instructionsLabel: '4. Patient Care Instructions & Lifestyle Guidance',
    regimenLabel: '5. Prescribed Regimen / Medicine Plan',
    testsLabel: '6. Required Diagnostic Tests (Before Next Review)',
    warningsLabel: '7. Red-Flag Warning Signs to Watch (Trigger Emergency Transfer)',
    btnCancel: 'Cancel',
    btnSave: 'Save & Dispatch Care Plan'
  },
  'ଓଡ଼ିଆ': {
    title: 'ରୋଗୀ ଯତ୍ନ ଯୋଜନା ଓ ଫଲୋ-ଅପ୍ ପ୍ରସ୍ତୁତି',
    sub: 'ଇ-ସଞ୍ଜୀବନୀ ଆଧାରିତ କ୍ଲିନିକାଲ୍ ଡିସଚାର୍ଜ ଓ ନିରନ୍ତର ସ୍ୱାସ୍ଥ୍ୟ ଯତ୍ନ ଇଞ୍ଜିନ୍',
    patientLabel: 'ରୋଗୀ:',
    doctorLabel: 'ଚିକିତ୍ସା କରୁଥିବା ଡାକ୍ତର:',
    successTitle: 'ଯତ୍ନ ଯୋଜନା ସଫଳତାର ସହ ପ୍ରସ୍ତୁତ ହେଲା!',
    successDesc: 'ପରବର୍ତ୍ତୀ ଯାଞ୍ଚ ତାରିଖ ନିର୍ଦ୍ଧାରିତ ହେଲା ଏବଂ ରୋଗୀ ଡ୍ୟାସବୋର୍ଡ ଅପଡେଟ୍ ହେଲା।',
    diagLabel: '୧. ରୋଗ ନିର୍ଣ୍ଣୟ / କ୍ଲିନିକାଲ୍ ସାରାଂଶ',
    followUpDateLabel: '୨. ପରବର୍ତ୍ତୀ ଯାଞ୍ଚ ତାରିଖ',
    followUpModeLabel: '୩. ଯାଞ୍ଚ ପଦ୍ଧତି (ମୋଡ୍)',
    modeTele: 'ଟେଲି-ପରାମର୍ଶ (ଭିଡିଓ / ଅଡିଓ)',
    modePhc: 'ସିଧାସଳଖ PHC / CHC କେନ୍ଦ୍ରରେ ଯାଞ୍ଚ',
    modeReferral: 'ବିଶେଷଜ୍ଞ ରେଫରାଲ୍ ଯାଞ୍ଚ',
    instructionsLabel: '୪. ରୋଗୀଙ୍କ ଯତ୍ନ ନିର୍ଦ୍ଦେଶାବଳୀ ଓ ଜୀବନଶୈଳୀ ପରାମର୍ଶ',
    regimenLabel: '୫. ଔଷଧ ସେବନ ଯୋଜନା',
    testsLabel: '୬. ପରବର୍ତ୍ତୀ ଯାଞ୍ଚ ପୂର୍ବରୁ ଆବଶ୍ୟକୀୟ ଲାବ୍ ପରୀକ୍ଷା',
    warningsLabel: '୭. ସତର୍କତା ସଙ୍କେତ (ଏଗୁଡ଼ିକ ଦେଖାଗଲେ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ନିଅନ୍ତୁ)',
    btnCancel: 'ବାତିଲ୍ କରନ୍ତୁ',
    btnSave: 'ଯତ୍ନ ଯୋଜନା ସଂରକ୍ଷଣ ଓ ପ୍ରେରଣ'
  },
  'हिन्दी': {
    title: 'मरीज उपचार योजना एवं फॉलो-अप तैयार करें',
    sub: 'ई-संजीवनी प्रेरित क्लीनिकल डिस्चार्ज एवं सतत देखभाल मॉड्यूल',
    patientLabel: 'रोगी:',
    doctorLabel: 'उपचारक चिकित्सक:',
    successTitle: 'उपचार योजना सफलतापूर्वक तैयार!',
    successDesc: 'फॉलो-अप तारीख तय की गई और मरीज डैशबोर्ड पर अगला कदम अपडेट हो गया।',
    diagLabel: '1. रोग निदान / क्लीनिकल निष्कर्ष',
    followUpDateLabel: '2. अगली जांच (फॉलो-अप) तिथि',
    followUpModeLabel: '3. फॉलो-अप का माध्यम',
    modeTele: 'टेली-परामर्श (डिजिटल वीडियो/ऑडियो)',
    modePhc: 'निकटतम PHC / CHC अस्पताल में जांच',
    modeReferral: 'विशेषज्ञ रेफरल जांच',
    instructionsLabel: '4. मरीज की देखभाल निर्देश एवं जीवनशैली सलाह',
    regimenLabel: '5. दवा योजना एवं खुराक विवरण',
    testsLabel: '6. अगली जांच से पहले आवश्यक लैब टेस्ट',
    warningsLabel: '7. खतरे के चेतावनी संकेत (दिखने पर तुरंत अस्पताल जाएं)',
    btnCancel: 'रद्द करें',
    btnSave: 'उपचार योजना सुरक्षित व प्रेषित करें'
  }
};

export const CarePlanModal: React.FC<CarePlanModalProps> = ({
  isOpen,
  onClose,
  doctorName,
  patientName = 'Keshab Rout',
  patientId = 'RHB-OD-KLH-0941',
  onSaved,
  lang = 'English'
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
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

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = PLAN_I18N[activeLang] || PLAN_I18N.English;

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
      <div className="modal-dialog" style={{ maxWidth: '660px', maxHeight: '92vh', overflowY: 'auto', borderRadius: '16px', padding: 0 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(25, 211, 255, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#ffffff', fontWeight: 800 }}>
                {t.title}
              </h3>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                {t.sub}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Language Switcher */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setActiveLang(l)}
                  style={{
                    background: activeLang === l ? '#38bdf8' : 'transparent',
                    color: activeLang === l ? '#071c42' : '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: activeLang === l ? 800 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: 0, color: '#cbd5e1', cursor: 'pointer', padding: '6px' }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: '20px', background: '#f8fafc' }}>
          {/* Patient & Doctor Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '13px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ color: '#64748b' }}>{t.patientLabel}</span> <strong>{patientName}</strong> ({patientId})
            </div>
            <div>
              <span style={{ color: '#64748b' }}>{t.doctorLabel}</span> <strong>{doctorName}</strong>
            </div>
          </div>

          {savedSuccess ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#15803d' }}>{t.successTitle}</h3>
              <p style={{ fontSize: '13px', color: '#475569' }}>
                {t.successDesc}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              {/* Diagnosis / Clinical Assessment */}
              <div className="field" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  {t.diagLabel}
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1.5px solid #cbd5e1' }}
                />
              </div>

              {/* Follow-up Timing & Mode */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    {t.followUpDateLabel}
                  </label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1.5px solid #cbd5e1' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    {t.followUpModeLabel}
                  </label>
                  <select
                    value={followUpMode}
                    onChange={(e) => setFollowUpMode(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1.5px solid #cbd5e1' }}
                  >
                    <option value="Teleconsultation">{t.modeTele}</option>
                    <option value="Physical PHC Review">{t.modePhc}</option>
                    <option value="Specialist Referral">{t.modeReferral}</option>
                  </select>
                </div>
              </div>

              {/* Instructions */}
              <div className="field" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  {t.instructionsLabel}
                </label>
                <textarea
                  rows={3}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                  placeholder="Specific guidance for patient..."
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1.5px solid #cbd5e1' }}
                />
              </div>

              {/* Medicine Plan Summary */}
              <div className="field" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  {t.regimenLabel}
                </label>
                <input
                  type="text"
                  value={medicinePlan}
                  onChange={(e) => setMedicinePlan(e.target.value)}
                  placeholder="Medicines and frequencies agreed upon..."
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1.5px solid #cbd5e1' }}
                />
              </div>

              {/* Required Tests Checklist */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                  {t.testsLabel}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '6px' }}>
                  {testOptions.map((test) => (
                    <label
                      key={test}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        background: selectedTests.includes(test) ? '#eff6ff' : '#ffffff',
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
              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#b91c1c' }}>
                  {t.warningsLabel}
                </label>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {warningOptions.map((warning) => (
                    <label
                      key={warning}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        background: selectedWarnings.includes(warning) ? '#fef2f2' : '#ffffff',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: selectedWarnings.includes(warning) ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        color: selectedWarnings.includes(warning) ? '#991b1b' : '#334155'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedWarnings.includes(warning)}
                        onChange={() => toggleWarning(warning)}
                      />
                      <span>{warning}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  {t.btnCancel}
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                  {t.btnSave}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
