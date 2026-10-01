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
import { CarePlan, Language } from '../types';
import { storage } from '../utils/storage';

interface CarePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  patientName?: string;
  patientId?: string;
  lang?: Language;
  onSaved?: (plan: CarePlan) => void;
}

const PLAN_I18N: Record<Language, {
  modalTitle: string;
  modalSub: string;
  patientLabel: string;
  doctorLabel: string;
  successTitle: string;
  successDesc: string;
  f1Label: string;
  f2Label: string;
  f3Label: string;
  f3Tele: string;
  f3Phc: string;
  f3Specialist: string;
  f4Label: string;
  f4Placeholder: string;
  f5Label: string;
  f6Label: string;
  f7Label: string;
  referralLabel: string;
  safetyNotice: string;
  cancelBtn: string;
  submitBtn: string;
}> = {
  English: {
    modalTitle: 'Create Patient Care Plan & Follow-up',
    modalSub: 'eSanjeevani-inspired clinical discharge & continuous care engine (Prompt Section 32)',
    patientLabel: 'Patient:',
    doctorLabel: 'Treating Clinician:',
    successTitle: 'Care Plan Successfully Created!',
    successDesc: 'Follow-up scheduled and patient dashboard updated with next care step.',
    f1Label: '1. Clinical Diagnosis / Impression',
    f2Label: '2. Next Follow-up Date',
    f3Label: '3. Follow-up Mode',
    f3Tele: 'Teleconsultation (Digital Video/Audio)',
    f3Phc: 'In-Person PHC / CHC Review',
    f3Specialist: 'Specialist Referral Review',
    f4Label: '4. Patient Care Instructions & Lifestyle Guidance',
    f4Placeholder: 'Specific guidance for patient (diet, rest, hydration, monitoring)...',
    f5Label: '5. Prescribed Regimen / Medicine Plan',
    f6Label: '6. Required Diagnostic Tests (Before Next Review)',
    f7Label: '7. Red Flag Warning Signs (Seek Immediate Physical Care if Occurring)',
    referralLabel: 'Referral Hospital / Center',
    safetyNotice: 'CLINICAL SAFETY MANDATE: AI assists intake and documentation; licensed doctors decide and authorize all care plans. This care plan will sync to the patient\'s local offline sandbox.',
    cancelBtn: 'Cancel',
    submitBtn: 'Authorize & Issue Care Plan'
  },
  'ଓଡ଼ିଆ': {
    modalTitle: 'ରୋଗୀ ଯତ୍ନ ଯୋଜନା ଓ ପରବର୍ତ୍ତୀ ପରାମର୍ଶ',
    modalSub: 'ଇ-ସଞ୍ଜୀବନୀ ଆଧାରିତ ନିରନ୍ତର ସ୍ୱାସ୍ଥ୍ୟ ସେବା ବ୍ୟବସ୍ଥା',
    patientLabel: 'ରୋଗୀଙ୍କ ନାମ:',
    doctorLabel: 'ଡାକ୍ତର:',
    successTitle: 'ଯତ୍ନ ଯୋଜନା ସଫଳତାର ସହ ପ୍ରସ୍ତୁତ ହେଲା!',
    successDesc: 'ପରବର୍ତ୍ତୀ ପରାମର୍ଶ ତାରିଖ ସ୍ଥିର ହେଲା ଏବଂ ରୋଗୀଙ୍କ ଡ୍ୟାସବୋର୍ଡ ଅପଡେଟ୍ ହେଲା।',
    f1Label: '୧. ଡାକ୍ତରୀ ଆକଳନ ଓ ରୋଗ ନିର୍ଣ୍ଣୟ',
    f2Label: '୨. ପରବର୍ତ୍ତୀ ପରାମର୍ଶ ତାରିଖ',
    f3Label: '୩. ପରାମର୍ଶ ମାଧ୍ୟମ',
    f3Tele: 'ଟେଲି-ପରାମର୍ଶ (ଭିଡିଓ / ଅଡିଓ କଲ୍)',
    f3Phc: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (PHC) ଯାଇ ଦେଖାଇବା',
    f3Specialist: 'ବିଶେଷଜ୍ଞ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ',
    f4Label: '୪. ରୋଗୀଙ୍କ ପାଇଁ ଯତ୍ନ ଉପଦେଶ ଓ ନିୟମ',
    f4Placeholder: 'ଖାଦ୍ୟପେୟ, ବିଶ୍ରାମ, ଜଳୀୟଅଂଶ, ତାପମାତ୍ରା ମାପିବା ନିୟମ...',
    f5Label: '୫. ଔଷଧ ସେବନ ଯୋଜନା',
    f6Label: '୬. ଆବଶ୍ୟକୀୟ ପରୀକ୍ଷା (ପରବର୍ତ୍ତୀ ପରାମର୍ଶ ପୂର୍ବରୁ)',
    f7Label: '୭. ଜରୁରୀ ବିପଦଜନକ ଲକ୍ଷଣ (ଏହା ଦେଖାଦେଲେ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ)',
    referralLabel: 'ରେଫରାଲ୍ ଡାକ୍ତରଖାନା / ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର',
    safetyNotice: 'ଚିକିତ୍ସା ନିୟମ: AI କେବଳ ଲକ୍ଷଣ ଲିପିବଦ୍ଧ କରିବାରେ ସାହାଯ୍ୟ କରେ; ପଞ୍ଜୀକୃତ ଡାକ୍ତର ହିଁ ଚିକିତ୍ସା ନିଷ୍ପତ୍ତି ନିଅନ୍ତି। ଏହି ଯୋଜନା ରୋଗୀଙ୍କ ଫୋନରେ ଅଫଲାଇନରେ ରହିବ।',
    cancelBtn: 'ବାତିଲ କରନ୍ତୁ',
    submitBtn: 'ଅନୁମୋଦନ କରନ୍ତୁ ଓ ଯୋଜନା ଜାରି କରନ୍ତୁ'
  },
  'हिन्दी': {
    modalTitle: 'रोगी देखभाल योजना एवं अनुवर्ती निर्देश',
    modalSub: 'ई-संजीवनी प्रेरित सतत स्वास्थ्य सेवा प्रणाली',
    patientLabel: 'रोगी का नाम:',
    doctorLabel: 'चिकित्सक:',
    successTitle: 'देखभाल योजना सफलतापूर्वक तैयार!',
    successDesc: 'अगला परामर्श निर्धारित किया गया और रोगी डैशबोर्ड अपडेट किया गया।',
    f1Label: '१. चिकित्सकीय निदान एवं मूल्यांकन',
    f2Label: '२. अगले परामर्श की तिथि',
    f3Label: '३. परामर्श का माध्यम',
    f3Tele: 'टेली-परामर्श (डिजिटल वीडियो/ऑडियो)',
    f3Phc: 'प्राथमिक स्वास्थ्य केंद्र (PHC) में व्यक्तिगत जांच',
    f3Specialist: 'विशेषज्ञ चिकित्सक परामर्श',
    f4Label: '४. रोगी देखभाल निर्देश एवं जीवनशैली सलाह',
    f4Placeholder: 'खान-पान, आराम, पानी की मात्रा, तापमान जांच के निर्देश...',
    f5Label: '५. निर्धारित दवा योजना',
    f6Label: '६. आवश्यक जांच (अगली समीक्षा से पहले)',
    f7Label: '७. गंभीर खतरे के लक्षण (दिखने पर तुरंत अस्पताल जाएं)',
    referralLabel: 'रेफरल अस्पताल / केंद्र',
    safetyNotice: 'चिकित्सा सुरक्षा निर्देश: AI केवल प्रलेखन में सहायता करता है; लाइसेंस प्राप्त डॉक्टर ही देखभाल योजना निर्धारित करते हैं। यह योजना रोगी के ऑफलाइन फोन में सुरक्षित रहेगी।',
    cancelBtn: 'रद्द करें',
    submitBtn: 'प्रमाणित करें एवं योजना जारी करें'
  }
};

const TEST_OPTIONS_MAP: Record<string, { en: string; or: string; hi: string }> = {
  'CBC / Hemoglobin': { en: 'CBC / Hemoglobin', or: 'ସିବିସି / ହିମୋଗ୍ଲୋବିନ୍ (CBC)', hi: 'सीबीसी / हीमोग्लोबिन (CBC)' },
  'Malaria Rapid Antigen Test (RDT)': { en: 'Malaria Rapid Antigen Test (RDT)', or: 'ମ୍ୟାଲେରିଆ RDT ପରୀକ୍ଷା', hi: 'मलेरिया आरडीटी जांच' },
  'Blood Glucose (Fasting / Post-prandial)': { en: 'Blood Glucose (Fasting / Post-prandial)', or: 'ରକ୍ତ ଶର୍କରା (Blood Sugar)', hi: 'ब्लड शुगर (फास्टिंग/पीपी)' },
  'Sputum Smear / GeneXpert': { en: 'Sputum Smear / GeneXpert', or: 'କଫ ପରୀକ୍ଷା (GeneXpert)', hi: 'बलगम जांच (GeneXpert)' },
  'Urine Routine Examination': { en: 'Urine Routine Examination', or: 'ପରିସ୍ରା ପରୀକ୍ଷା (Urine Routine)', hi: 'पेशाब की नियमित जांच' },
  'Serum Creatinine & Electrolytes': { en: 'Serum Creatinine & Electrolytes', or: 'ସିରମ୍ କ୍ରିଏଟିନିନ୍ ଓ ଇଲେକ୍ଟ୍ରୋଲାଇଟ୍', hi: 'सीरम क्रिएटिनिन और इलेक्ट्रोलाइट्स' }
};

const WARNING_OPTIONS_MAP: Record<string, { en: string; or: string; hi: string }> = {
  'High fever > 103°F not subsiding with medication': {
    en: 'High fever > 103°F not subsiding with medication',
    or: 'ଔଷଧ ଖାଇବା ପରେ ମଧ୍ୟ ୧୦୩°F ରୁ ଅଧିକ ଜ୍ୱର ନ କମିବା',
    hi: 'दवा के बाद भी १०३°F से अधिक तेज बुखार न उतरना'
  },
  'Severe breathing difficulty or chest heaviness': {
    en: 'Severe breathing difficulty or chest heaviness',
    or: 'ପ୍ରବଳ ଶ୍ୱାସକ୍ରିୟା କଷ୍ଟ ବା ଛାତିରେ ଭାରୀପଣ',
    hi: 'गंभीर सांस लेने में तकलीफ या सीने में भारीपन'
  },
  'Inability to retain liquids / continuous vomiting': {
    en: 'Inability to retain liquids / continuous vomiting',
    or: 'ଲଗାତାର ବାନ୍ତି ହେବା ଓ ପାଣି ମଧ୍ୟ ପେଟରେ ନ ରହିବା',
    hi: 'लगातार उल्टी होना और पानी भी न पचना'
  },
  'Sudden fainting, confusion, or marked lethargy': {
    en: 'Sudden fainting, confusion, or marked lethargy',
    or: 'ହଠାତ୍ ମୂର୍ଚ୍ଛା ଯିବା ବା ଚେତା ହରାଇବା',
    hi: 'अचानक बेहोशी, अत्यधिक सुस्ती या भ्रम'
  },
  'Signs of abnormal bleeding or rash': {
    en: 'Signs of abnormal bleeding or rash',
    or: 'ଶରୀରରୁ ଅସ୍ୱାଭାବିକ ରକ୍ତସ୍ରାବ ବା ଚର୍ମରେ ଲାଲ୍ ଦାଗ',
    hi: 'शरीर से असामान्य रक्तस्राव या लाल चकत्ते'
  }
};

export const CarePlanModal: React.FC<CarePlanModalProps> = ({
  isOpen,
  onClose,
  doctorName,
  patientName = 'Keshab Rout',
  patientId = 'RHB-OD-KLH-0941',
  lang = 'English',
  onSaved
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

  React.useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = PLAN_I18N[activeLang] || PLAN_I18N.English;

  const toggleTest = (testKey: string) => {
    setSelectedTests((prev) =>
      prev.includes(testKey) ? prev.filter((t) => t !== testKey) : [...prev, testKey]
    );
  };

  const toggleWarning = (warningKey: string) => {
    setSelectedWarnings((prev) =>
      prev.includes(warningKey) ? prev.filter((w) => w !== warningKey) : [...prev, warningKey]
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
      <div className="modal-dialog" style={{ maxWidth: '680px', maxHeight: '92vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#eff6ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ClipboardList size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#071c42' }}>
                {t.modalTitle}
              </h3>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {t.modalSub}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Language toggle pills */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '20px',
              padding: '2px',
              border: '1px solid #cbd5e1'
            }}>
              {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setActiveLang(l)}
                  style={{
                    background: activeLang === l ? '#0284c7' : 'transparent',
                    color: activeLang === l ? '#ffffff' : '#475569',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: activeLang === l ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{ background: 'transparent', border: 0, color: '#64748b', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Patient & Doctor Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ color: '#64748b' }}>{t.patientLabel}</span> <strong>{patientName}</strong> ({patientId})
          </div>
          <div>
            <span style={{ color: '#64748b' }}>{t.doctorLabel}</span> <strong>{doctorName}</strong>
          </div>
        </div>

        {savedSuccess ? (
          <div style={{ padding: '36px 20px', textAlign: 'center' }}>
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
            <div className="field">
              <label style={{ fontSize: '13px', fontWeight: 700 }}>
                {t.f1Label}
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  {t.f2Label}
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
                  {t.f3Label}
                </label>
                <select
                  value={followUpMode}
                  onChange={(e) => setFollowUpMode(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Teleconsultation">{t.f3Tele}</option>
                  <option value="Physical PHC Review">{t.f3Phc}</option>
                  <option value="Specialist Referral">{t.f3Specialist}</option>
                </select>
              </div>
            </div>

            {/* Instructions */}
            <div className="field">
              <label style={{ fontSize: '13px', fontWeight: 700 }}>
                {t.f4Label}
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                placeholder={t.f4Placeholder}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* Medicine Plan Summary */}
            <div className="field">
              <label style={{ fontSize: '13px', fontWeight: 700 }}>
                {t.f5Label}
              </label>
              <input
                type="text"
                value={medicinePlan}
                onChange={(e) => setMedicinePlan(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            {/* Required Tests Checklist */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                {t.f6Label}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '6px' }}>
                {Object.entries(TEST_OPTIONS_MAP).map(([key, item]) => {
                  const label = activeLang === 'ଓଡ଼ିଆ' ? item.or : activeLang === 'हिन्दी' ? item.hi : item.en;
                  const isChecked = selectedTests.includes(key);
                  return (
                    <label
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        background: isChecked ? '#eff6ff' : '#f8fafc',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: isChecked ? '1px solid #93c5fd' : '1px solid #e2e8f0',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleTest(key)}
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Warning Signs to Watch */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px', color: '#991b1b' }}>
                {t.f7Label}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                {Object.entries(WARNING_OPTIONS_MAP).map(([key, item]) => {
                  const label = activeLang === 'ଓଡ଼ିଆ' ? item.or : activeLang === 'हिन्दी' ? item.hi : item.en;
                  const isChecked = selectedWarnings.includes(key);
                  return (
                    <label
                      key={key}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        background: isChecked ? '#fef2f2' : '#f8fafc',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: isChecked ? '1px solid #fca5a5' : '1px solid #e2e8f0',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleWarning(key)}
                      />
                      <span style={{ color: isChecked ? '#991b1b' : '#334155' }}>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Referral Facility if applicable */}
            {followUpMode === 'Specialist Referral' && (
              <div className="field">
                <label style={{ fontSize: '13px', fontWeight: 700 }}>
                  {t.referralLabel}
                </label>
                <input
                  type="text"
                  value={referralFacility}
                  onChange={(e) => setReferralFacility(e.target.value)}
                  placeholder="e.g. District Headquarters Hospital (DHH) Bhawanipatna"
                  style={{ width: '100%', padding: '8px 10px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>
            )}

            {/* Safety Disclaimer */}
            <div style={{ background: '#f8fafc', borderLeft: '3px solid #0284c7', padding: '10px 14px', borderRadius: '6px', fontSize: '11px', color: '#475569', marginBottom: '16px' }}>
              <strong>CLINICAL SAFETY MANDATE:</strong> {t.safetyNotice}
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ fontWeight: 800 }}
              >
                <FileCheck size={16} /> {t.submitBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
