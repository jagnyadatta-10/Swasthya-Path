import React, { useState, useEffect } from 'react';
import { Pill, X, Download, Share2, Check, AlertCircle, Printer, FileText, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';
import { FullPrescription, PrescriptionMedicine, MedicineItem, Language } from '../types';
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
  lang?: Language;
}

const RX_I18N: Record<Language, {
  modalTitle: string;
  modalSub: string;
  headerGovt: string;
  hospital: string;
  clinician: string;
  dept: string;
  date: string;
  patient: string;
  patientId: string;
  ageSex: string;
  ageSexVal: string;
  district: string;
  districtVal: string;
  assessment: string;
  diagText: string;
  rxHeader: string;
  thNum: string;
  thMedicine: string;
  thDosage: string;
  thDuration: string;
  thInstructions: string;
  med1Name: string;
  med1Dosage: string;
  med1Freq: string;
  med1Duration: string;
  med1Inst: string;
  med2Name: string;
  med2Dosage: string;
  med2Freq: string;
  med2Duration: string;
  med2Inst: string;
  localAvailabilityTitle: string;
  localAvailabilitySub: string;
  storeCardTitle: string;
  storeCardSub: string;
  storeCardBtn: string;
  adviceLabel: string;
  adviceText: string;
  followUpLabel: string;
  followUpText: string;
  digitalSig: string;
  eSignedAt: string;
  disclaimer: string;
  btnPrint: string;
  btnShare: string;
  btnSave: string;
  btnSaved: string;
  btnClose: string;
  sharedSuccess: string;
}> = {
  English: {
    modalTitle: 'E-Prescription',
    modalSub: 'Swasthya Path Telehealth Initiative • Odisha MoHFW Workflow',
    headerGovt: 'GOVERNMENT OF ODISHA • DISTRICT HEALTH SOCIETY KALAHANDI',
    hospital: 'District Headquarters Hospital (DHH) Bhawanipatna Telehealth Unit',
    clinician: 'Consulting Clinician:',
    dept: '(General Medicine)',
    date: 'Date:',
    patient: 'Patient:',
    patientId: 'Patient ID:',
    ageSex: 'Age/Sex:',
    ageSexVal: '26 Y / M',
    district: 'District:',
    districtVal: 'Kalahandi',
    assessment: 'Clinical Impression & Assessment',
    diagText: 'Acute viral febrile episode with mild asthenia. No red-flag respiratory or hemorrhagic distress noted.',
    rxHeader: 'Prescribed Medicines (Fictional Demo Formulation)',
    thNum: '#',
    thMedicine: 'Medicine & Strength',
    thDosage: 'Dosage & Timing',
    thDuration: 'Duration',
    thInstructions: 'Instructions',
    med1Name: 'Tab Paracetamol (Jan Aushadhi)',
    med1Dosage: '1 tablet',
    med1Freq: 'SOS (When needed for fever > 100°F)',
    med1Duration: '3 days',
    med1Inst: 'Take after meals with warm water. Maximum 3 tablets in 24 hours.',
    med2Name: 'Oral Rehydration Salts (ORS) Sachet',
    med2Dosage: '1 sachet in 1 Litre water',
    med2Freq: 'Throughout the day',
    med2Duration: '3 days',
    med2Inst: 'Sip frequently to maintain hydration and electrolytes.',
    localAvailabilityTitle: 'LOCAL MEDICINE AVAILABILITY (Kalahandi Pharmacies)',
    localAvailabilitySub: '* Availability depends on pharmacy updates.',
    storeCardTitle: 'Find Medicine at Local Stores',
    storeCardSub: 'Check live availability in Store A (Jan Aushadhi), Store B (Junagarh), and Store C (Chhoriagarh).',
    storeCardBtn: 'Check Pharmacy Availability ➔',
    adviceLabel: 'Advice / General Measures:',
    adviceText: 'Maintain oral fluids and rest. Avoid self-medication with NSAIDs.',
    followUpLabel: 'Follow-up Schedule:',
    followUpText: 'Follow-up teleconsultation in 3 days if fever does not subside or if warning signs develop.',
    digitalSig: 'Digitally Authorized by Dr. Ananya Mishra (Reg No: OD-MED-8492)',
    eSignedAt: 'e-Signed at',
    disclaimer: 'Demo Telehealth E-Prescription issued via Swasthya Path Kalahandi platform. Fictional prototype formulation for demonstration only.',
    btnPrint: 'Print / PDF',
    btnShare: 'Share with Patient',
    btnSave: 'Save Prescription',
    btnSaved: 'Prescription Saved!',
    btnClose: 'Close',
    sharedSuccess: 'Shared to patient records & SMS notification simulated!'
  },
  'ଓଡ଼ିଆ': {
    modalTitle: 'ଇ-ପ୍ରେସକ୍ରିପସନ୍',
    modalSub: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ ଟେଲି-ହେଲ୍ଥ • ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ଓ ପରିବାର କଲ୍ୟାଣ ବିଭାଗ',
    headerGovt: 'ଓଡ଼ିଶା ସରକାର • ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ସମିତି କଳାହାଣ୍ଡି',
    hospital: 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ (DHH) ଭବାନୀପାଟଣା ଟେଲି-ହେଲ୍ଥ ୟୁନିଟ୍',
    clinician: 'ପରାମର୍ଶଦାତା ଡାକ୍ତର:',
    dept: '(ସାଧାରଣ ଚିକିତ୍ସା ବିଭାଗ)',
    date: 'ତାରିଖ:',
    patient: 'ରୋଗୀ:',
    patientId: 'ରୋଗୀ ID:',
    ageSex: 'ବୟସ/ଲିଙ୍ଗ:',
    ageSexVal: '୨୬ ବର୍ଷ / ପୁରୁଷ',
    district: 'ଜିଲ୍ଲା:',
    districtVal: 'କଳାହାଣ୍ଡି',
    assessment: 'କ୍ଲିନିକାଲ୍ ତଦନ୍ତ ଓ ସାରାଂଶ',
    diagText: 'ମୃଦୁ ଦୁର୍ବଳତା ସହିତ ଭୂତାଣୁଜନିତ ଜ୍ୱର। କୌଣସି ଜରୁରୀକାଳୀନ ଶ୍ୱାସକ୍ରିୟା ବା ରକ୍ତସ୍ରାବ ସଙ୍କେତ ନାହିଁ।',
    rxHeader: 'ନିର୍ଦ୍ଦେଶିତ ଔଷଧ ତାଲିକା (ସ୍ୱାସ୍ଥ୍ୟ ପଥ ପ୍ରୋଟୋଟାଇପ୍)',
    thNum: '#',
    thMedicine: 'ଔଷଧ ଓ ଶକ୍ତି',
    thDosage: 'ମାତ୍ରା ଓ ସମୟ',
    thDuration: 'ଅବଧି',
    thInstructions: 'ବିଶେଷ ନିର୍ଦ୍ଦେଶ',
    med1Name: 'ଟାବଲେଟ୍ ପାରାସିଟାମୋଲ୍ (ଜନ ଔଷଧି)',
    med1Dosage: '୧ ଟାବଲେଟ୍',
    med1Freq: 'ଜ୍ୱର > ୧୦୦°F ହେଲେ (SOS)',
    med1Duration: '୩ ଦିନ',
    med1Inst: 'ଖାଇବା ପରେ ଉଷୁମ ପାଣି ସହିତ ନିଅନ୍ତୁ। ୨୪ ଘଣ୍ଟାରେ ସର୍ବାଧିକ ୩ ଟି।',
    med2Name: 'ଓଆରଏସ୍ (ORS) ସାଚେଟ୍ (WHO ଫର୍ମୁଲା)',
    med2Dosage: '୧ ସାଚେଟ୍ ୧ ଲିଟର ପାଣିରେ',
    med2Freq: 'ଦିନସାରା ପିଅନ୍ତୁ',
    med2Duration: '୩ ଦିନ',
    med2Inst: 'ଶରୀରରେ ଜଳୀୟ ଅଂଶ ବଜାୟ ରଖିବା ପାଇଁ ଟିକେ ଟିକେ ପିଅନ୍ତୁ।',
    localAvailabilityTitle: 'ସ୍ଥାନୀୟ ଔଷଧ ଉପଲବ୍ଧତା (କଳାହାଣ୍ଡି ଜନ ଔଷଧି କେନ୍ଦ୍ର)',
    localAvailabilitySub: '* ଔଷଧ ଦୋକାନର ତାଜା ତଥ୍ୟ ଉପରେ ଆଧାରିତ।',
    storeCardTitle: 'ସ୍ଥାନୀୟ ଦୋକାନରେ ଔଷଧ ଖୋଜନ୍ତୁ',
    storeCardSub: 'ଷ୍ଟୋର୍ A (ଜନ ଔଷଧି), ଷ୍ଟୋର୍ B (ଜୁନାଗଡ଼), ଏବଂ ଷ୍ଟୋର୍ C ରେ ଲାଇଭ୍ ଷ୍ଟକ୍ ଦେଖନ୍ତୁ।',
    storeCardBtn: 'ଔଷଧ ଉପଲବ୍ଧତା ଯାଞ୍ଚ କରନ୍ତୁ ➔',
    adviceLabel: 'ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ / ସାଧାରଣ ଯତ୍ନ:',
    adviceText: 'ପ୍ରଚୁର ପାଣି ପିଅନ୍ତୁ ଏବଂ ବିଶ୍ରାମ ନିଅନ୍ତୁ। ବିନା ପରାମର୍ଶରେ ଅନ୍ୟ ଔଷଧ ଖାଆନ୍ତୁ ନାହିଁ।',
    followUpLabel: 'ପରବର୍ତ୍ତୀ ଯାଞ୍ଚ ସମୟ:',
    followUpText: '୩ ଦିନ ପରେ ପୁନର୍ବାର ଟେଲି-ପରାମର୍ଶ ନିଅନ୍ତୁ ଯଦି ଜ୍ୱର ନ କମେ।',
    digitalSig: 'ଡାକ୍ତର ଅନନ୍ୟା ମିଶ୍ରଙ୍କ ଦ୍ୱାରା ଡିଜିଟାଲ୍ ସ୍ୱାକ୍ଷରିତ (Reg: OD-MED-8492)',
    eSignedAt: 'ଇ-ସ୍ୱାକ୍ଷର ସମୟ:',
    disclaimer: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ କଳାହାଣ୍ଡି ପ୍ଲାଟଫର୍ମ ଦ୍ୱାରା ଜାରି କରାଯାଇଥିବା ଟେଲି-ହେଲ୍ଥ ଇ-ପ୍ରେସକ୍ରିପସନ୍। ପ୍ରୋଟୋଟାଇପ୍ ଉଦ୍ଦେଶ୍ୟ ପାଇଁ।',
    btnPrint: 'ପ୍ରିଣ୍ଟ / PDF',
    btnShare: 'ରୋଗୀଙ୍କୁ ପଠାନ୍ତୁ',
    btnSave: 'ପ୍ରେସକ୍ରିପସନ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ',
    btnSaved: 'ସଂରକ୍ଷିତ ହେଲା!',
    btnClose: 'ବନ୍ଦ କରନ୍ତୁ',
    sharedSuccess: 'ରୋଗୀଙ୍କ ରେକର୍ଡ ଓ SMS କୁ ସଫଳତାର ସହ ପଠାଗଲା!'
  },
  'हिन्दी': {
    modalTitle: 'ई-प्रिस्क्रिप्शन',
    modalSub: 'स्वास्थ्य पथ टेली-हेल्थ • ओडिशा स्वास्थ्य एवं परिवार कल्याण विभाग',
    headerGovt: 'ओडिशा सरकार • जिला स्वास्थ्य समिति कालाहांडी',
    hospital: 'जिला मुख्य चिकित्सालय (DHH) भवानीपटना टेली-हेल्थ यूनिट',
    clinician: 'परामर्शदाता चिकित्सक:',
    dept: '(सामान्य चिकित्सा विभाग)',
    date: 'दिनांक:',
    patient: 'रोगी:',
    patientId: 'रोगी ID:',
    ageSex: 'आयु/लिंग:',
    ageSexVal: '२६ वर्ष / पुरुष',
    district: 'जिला:',
    districtVal: 'कालाहांडी',
    assessment: 'क्लीनिकल मूल्यांकन एवं निष्कर्ष',
    diagText: 'हल्की कमजोरी के साथ तीव्र वायरल बुखार। श्वसन या रक्तस्राव का कोई आपातकालीन लक्षण नहीं है।',
    rxHeader: 'निर्धारित दवा सूची (स्वास्थ्य पथ प्रोटोटाइप)',
    thNum: '#',
    thMedicine: 'दवा और क्षमता',
    thDosage: 'खुराक और समय',
    thDuration: 'अवधि',
    thInstructions: 'विशेष निर्देश',
    med1Name: 'टैबलेट पैरासिटामोल (जन औषधि)',
    med1Dosage: '1 गोली',
    med1Freq: 'बुखार > 100°F होने पर (SOS)',
    med1Duration: '3 दिन',
    med1Inst: 'भोजन के बाद गुनगुने पानी के साथ लें। 24 घंटे में अधिकतम 3 गोलियां।',
    med2Name: 'ओआरएस (ORS) पैकेट (WHO फॉर्मूला)',
    med2Dosage: '1 पैकेट 1 लीटर पानी में',
    med2Freq: 'दिनभर',
    med2Duration: '3 दिन',
    med2Inst: 'शरीर में पानी और खनिज बनाए रखने के लिए थोड़ा-थोड़ा पिएं।',
    localAvailabilityTitle: 'स्थानीय दवा उपलब्धता (कालाहांडी मेडिकल स्टोर)',
    localAvailabilitySub: '* दवा दुकानों के नवीनतम अपडेट पर आधारित।',
    storeCardTitle: 'स्थानीय दुकानों पर दवा खोजें',
    storeCardSub: 'स्टोर A (जन औषधि), स्टोर B (जूनागढ़), और स्टोर C में लाइव स्टॉक देखें।',
    storeCardBtn: 'दवा की उपलब्धता जांचें ➔',
    adviceLabel: 'डॉक्टर की सलाह / सामान्य देखरेख:',
    adviceText: 'पर्याप्त पानी पिएं और आराम करें। बिना डॉक्टरी सलाह के अन्य दवा न लें।',
    followUpLabel: 'फॉलो-अप समय:',
    followUpText: 'यदि 3 दिनों में बुखार कम न हो तो दोबारा टेली-परामर्श लें।',
    digitalSig: 'डॉ. अनन्या मिश्रा द्वारा डिजिटली सत्यापित (Reg: OD-MED-8492)',
    eSignedAt: 'ई-हस्ताक्षर समय:',
    disclaimer: 'स्वास्थ्य पथ कालाहांडी प्लेटफॉर्म द्वारा जारी टेली-हेल्थ ई-प्रिस्क्रिप्शन। केवल डेमो प्रदर्शन के लिए।',
    btnPrint: 'प्रिंट / PDF',
    btnShare: 'रोगी को भेजें',
    btnSave: 'प्रिस्क्रिप्शन सुरक्षित करें',
    btnSaved: 'सुरक्षित हो गया!',
    btnClose: 'बंद करें',
    sharedSuccess: 'रोगी रिकॉर्ड और SMS पर सफलतापूर्वक भेजा गया!'
  }
};

export const EPrescriptionModal: React.FC<EPrescriptionModalProps> = ({
  isOpen,
  onClose,
  prescription,
  mode = 'view',
  onPrescriptionSaved,
  doctorName = 'Dr. Ananya Mishra',
  patientName = 'Keshab Rout',
  patientId = 'RHB-OD-KLH-0941',
  onCheckStock,
  lang = 'English'
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

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

  const t = RX_I18N[activeLang] || RX_I18N.English;

  // Active display prescription
  const currentRx: FullPrescription = prescription || {
    id: 'rx-draft',
    prescriptionNumber: `RX-KLH-2026-0941`,
    patientId,
    patientName,
    doctorName,
    doctorHospital: t.hospital,
    date: new Date().toLocaleDateString('en-GB'),
    diagnosisSummary,
    medicines,
    followUp,
    notes: clinicalNotes,
    digitalSignature: t.digitalSig
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
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
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
                {mode === 'create' ? `${t.modalTitle} (Create)` : `${t.modalTitle} • ${currentRx.prescriptionNumber}`}
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                {t.modalSub}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Interactive Language Selector inside E-Prescription */}
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
              onClick={onClose}
              className="btn"
              style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '6px', cursor: 'pointer' }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#0369a1', letterSpacing: '0.05em' }}>
                    {t.headerGovt}
                  </div>
                  <h4 style={{ margin: '2px 0 0', fontSize: '17px', color: '#071c42' }}>
                    {t.hospital}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {t.clinician} <strong>{currentRx.doctorName}</strong> {t.dept}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1', fontFamily: 'monospace' }}>
                    {currentRx.prescriptionNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {t.date} <strong>{currentRx.date}</strong>
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '8px',
                fontSize: '12px'
              }}>
                <div><span style={{ color: '#64748b' }}>{t.patient}</span> <strong>{currentRx.patientName}</strong></div>
                <div><span style={{ color: '#64748b' }}>{t.patientId}</span> <strong style={{ color: '#0284c7' }}>{currentRx.patientId}</strong></div>
                <div><span style={{ color: '#64748b' }}>{t.ageSex}</span> <strong>{t.ageSexVal}</strong></div>
                <div><span style={{ color: '#64748b' }}>{t.district}</span> <strong>{t.districtVal}</strong></div>
              </div>
            </div>

            {/* Clinical Evaluation Summary */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t.assessment}
              </div>
              <div style={{ fontSize: '13px', color: '#0f172a', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', lineHeight: 1.5 }}>
                {activeLang === 'English' ? currentRx.diagnosisSummary : t.diagText}
              </div>
            </div>

            {/* Prescribed Medicines Table (Rx) */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#0284c7', fontFamily: 'serif' }}>℞</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#071c42', textTransform: 'uppercase' }}>
                  {t.rxHeader}
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>{t.thNum}</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>{t.thMedicine}</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>{t.thDosage}</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>{t.thDuration}</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>{t.thInstructions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#64748b' }}>1</td>
                      <td style={{ padding: '8px' }}>
                        <strong style={{ color: '#0f172a' }}>{t.med1Name}</strong>
                        <div style={{ color: '#0284c7', fontSize: '11px', fontWeight: 600 }}>500 mg</div>
                      </td>
                      <td style={{ padding: '8px', color: '#334155' }}>
                        {t.med1Dosage} • <strong>{t.med1Freq}</strong>
                      </td>
                      <td style={{ padding: '8px', fontWeight: 600 }}>{t.med1Duration}</td>
                      <td style={{ padding: '8px', color: '#64748b', fontSize: '11px' }}>{t.med1Inst}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', fontWeight: 700, color: '#64748b' }}>2</td>
                      <td style={{ padding: '8px' }}>
                        <strong style={{ color: '#0f172a' }}>{t.med2Name}</strong>
                        <div style={{ color: '#0284c7', fontSize: '11px', fontWeight: 600 }}>21.8 g WHO Formula</div>
                      </td>
                      <td style={{ padding: '8px', color: '#334155' }}>
                        {t.med2Dosage} • <strong>{t.med2Freq}</strong>
                      </td>
                      <td style={{ padding: '8px', fontWeight: 600 }}>{t.med2Duration}</td>
                      <td style={{ padding: '8px', color: '#64748b', fontSize: '11px' }}>{t.med2Inst}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Local Medicine Availability Preview (MANDATORY REQUIREMENT) */}
            <div style={{
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} style={{ color: '#16a34a' }} />
                  <strong style={{ fontSize: '12px', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {t.localAvailabilityTitle}
                  </strong>
                </div>
                <span style={{ fontSize: '10px', color: '#15803d', fontStyle: 'italic' }}>
                  {t.localAvailabilitySub}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '11px' }}>
                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{t.med1Name}</div>
                  <div style={{ color: '#64748b' }}>{paracetamolStock.pharmacyName} ({paracetamolStock.block})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ଉପଲବ୍ଧ' : activeLang === 'हिन्दी' ? 'उपलब्ध' : 'AVAILABLE'}
                    </span>
                    <span style={{ color: '#64748b' }}>
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ଅପଡେଟ୍: ଆଜି' : activeLang === 'हिन्दी' ? 'अपडेट: आज' : `Updated ${paracetamolStock.lastUpdated}`}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{t.med2Name}</div>
                  <div style={{ color: '#64748b' }}>{orsStock.pharmacyName} ({orsStock.block})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ଉପଲବ୍ଧ' : activeLang === 'हिन्दी' ? 'उपलब्ध' : 'AVAILABLE'}
                    </span>
                    <span style={{ color: '#64748b' }}>
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ଅପଡେଟ୍: ଆଜି' : activeLang === 'हिन्दी' ? 'अपडेट: आज' : `Updated ${orsStock.lastUpdated}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Diagram Connection: Doctor Consult -> Care Advice & Medicine -> Find Medicine -> Pharmacy Availability (Store A, B, C) */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={15} /> {t.storeCardTitle}
                </strong>
                <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px' }}>
                  {t.storeCardSub}
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
                {t.storeCardBtn}
              </button>
            </div>

            {/* Follow-up & Advice */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: '#b45309', display: 'block', marginBottom: '4px' }}>{t.adviceLabel}</strong>
                <span style={{ color: '#78350f' }}>{activeLang === 'English' ? currentRx.notes : t.adviceText}</span>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px' }}>
                <strong style={{ color: '#0369a1', display: 'block', marginBottom: '4px' }}>{t.followUpLabel}</strong>
                <span style={{ color: '#334155' }}>{activeLang === 'English' ? currentRx.followUp : t.followUpText}</span>
              </div>
            </div>

            {/* Digital Signature & Disclaimer */}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', maxWidth: '320px' }}>
                {t.disclaimer}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                  <ShieldCheck size={14} /> {t.digitalSig}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>{t.eSignedAt} {currentRx.date}</div>
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
                <Check size={14} /> {t.sharedSuccess}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => alert(`Printing E-Prescription ${currentRx.prescriptionNumber}...`)}
            >
              <Printer size={14} /> {t.btnPrint}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleShare}
            >
              <Share2 size={14} /> {t.btnShare}
            </button>

            {mode === 'create' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                style={{ fontWeight: 800 }}
              >
                {isSaved ? <Check size={14} /> : <FileText size={14} />}
                <span>{isSaved ? t.btnSaved : t.btnSave}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                {t.btnClose}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
