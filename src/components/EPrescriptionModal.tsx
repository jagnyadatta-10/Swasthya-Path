import React, { useState, useEffect } from 'react';
import {
  Pill,
  X,
  Share2,
  Check,
  Printer,
  FileText,
  ShieldCheck,
  MapPin,
  Edit3,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { FullPrescription, PrescriptionMedicine, Language } from '../types';
import { storage } from '../utils/storage';

interface EPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: FullPrescription | null;
  mode?: 'view' | 'create' | 'edit';
  onPrescriptionSaved?: (newRx: FullPrescription) => void;
  doctorName?: string;
  patientName?: string;
  patientId?: string;
  onCheckStock?: (medName: string) => void;
  lang?: Language;
}

const RX_I18N = {
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
    thAction: 'Action',
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
    btnUpdate: 'Update & Save Changes',
    btnUpdated: 'Prescription Updated!',
    btnEdit: 'Edit Prescription',
    btnCancelEdit: 'Cancel Edit',
    btnAddMed: '+ Add Medicine',
    quickAddTitle: 'Quick Add Essential Medicines:',
    editBadge: 'Editing Mode',
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
    thAction: 'କାର୍ଯ୍ୟ',
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
    btnUpdate: 'ଅପଡେଟ୍ ଓ ସଂରକ୍ଷଣ କରନ୍ତୁ',
    btnUpdated: 'ଅପଡେଟ୍ ହେଲା!',
    btnEdit: 'ପ୍ରେସକ୍ରିପସନ୍ ସଂଶୋଧନ କରନ୍ତୁ',
    btnCancelEdit: 'ବାତିଲ୍ କରନ୍ତୁ',
    btnAddMed: '+ ନୂଆ ଔଷଧ ଯୋଡ଼ନ୍ତୁ',
    quickAddTitle: 'ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ଜରୁରୀ ଔଷଧ ତାଲିକା:',
    editBadge: 'ସଂଶୋଧନ ମୋଡ୍',
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
    thAction: 'कार्रवाई',
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
    btnUpdate: 'अपडेट एवं सुरक्षित करें',
    btnUpdated: 'अपडेट हो गया!',
    btnEdit: 'प्रिस्क्रिप्शन संपादित करें',
    btnCancelEdit: 'रद्द करें',
    btnAddMed: '+ नई दवा जोड़ें',
    quickAddTitle: 'त्वरित आवश्यक दवाएं जोड़ें:',
    editBadge: 'संपादन मोड',
    btnClose: 'बंद करें',
    sharedSuccess: 'रोगी रिकॉर्ड और SMS पर सफलतापूर्वक भेजा गया!'
  }
};

const COMMON_ESSENTIAL_MEDS: Partial<PrescriptionMedicine>[] = [
  { name: 'Tab Paracetamol (Jan Aushadhi)', strength: '500 mg', dosage: '1 tablet', frequency: 'SOS (Fever > 100°F)', duration: '3 days', instructions: 'Take with warm water after meals' },
  { name: 'Oral Rehydration Salts (ORS)', strength: '21.8g WHO Sachet', dosage: '1 sachet in 1L water', frequency: 'Throughout day', duration: '3 days', instructions: 'Sip frequently for oral rehydration' },
  { name: 'Tab Amoxicillin 500mg', strength: '500 mg', dosage: '1 capsule', frequency: 'Thrice daily', duration: '5 days', instructions: 'Complete full 5-day course' },
  { name: 'Tab Cetirizine 10mg', strength: '10 mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', duration: '5 days', instructions: 'May cause mild drowsiness' },
  { name: 'Tab Azithromycin 250mg', strength: '250 mg', dosage: '1 tablet', frequency: 'Once daily', duration: '3 days', instructions: 'Take 1 hour before or 2 hours after meals' },
  { name: 'Tab Pantoprazole 40mg', strength: '40 mg', dosage: '1 tablet', frequency: 'Once daily empty stomach', duration: '5 days', instructions: 'Take 30 mins before breakfast' }
];

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
  const [isEditing, setIsEditing] = useState<boolean>(mode === 'create' || mode === 'edit');

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

  // Synchronize state on prescription/mode change
  useEffect(() => {
    if (prescription) {
      if (prescription.medicines && prescription.medicines.length > 0) {
        setMedicines([...prescription.medicines]);
      }
      if (prescription.diagnosisSummary) setDiagnosisSummary(prescription.diagnosisSummary);
      if (prescription.followUp) setFollowUp(prescription.followUp);
      if (prescription.notes) setClinicalNotes(prescription.notes);
    } else {
      setMedicines([
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
      setDiagnosisSummary('Acute viral febrile episode with mild asthenia. No red-flag respiratory or hemorrhagic distress noted.');
      setFollowUp('Follow-up teleconsultation in 3 days if fever does not subside or if warning signs develop.');
      setClinicalNotes('Maintain oral fluids and rest. Avoid self-medication with NSAIDs.');
    }
    setIsEditing(mode === 'create' || mode === 'edit');
  }, [prescription, mode, isOpen]);

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

  // Medicine table management
  const handleMedChange = (index: number, field: keyof PrescriptionMedicine, value: string) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleAddMedicine = (preset?: Partial<PrescriptionMedicine>) => {
    const newMed: PrescriptionMedicine = {
      id: `m-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: preset?.name || 'New Medicine',
      strength: preset?.strength || '500 mg',
      dosage: preset?.dosage || '1 tablet',
      frequency: preset?.frequency || 'Twice daily after food',
      duration: preset?.duration || '3 days',
      instructions: preset?.instructions || 'Take with water after meals'
    };
    setMedicines([...medicines, newMed]);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  // Save / Update prescription
  const handleSave = () => {
    const targetId = prescription?.id;
    const targetRxNum = prescription?.prescriptionNumber;

    const saved = storage.savePrescription({
      id: targetId,
      prescriptionNumber: targetRxNum,
      patientId: prescription?.patientId || patientId,
      patientName: prescription?.patientName || patientName,
      doctorName: prescription?.doctorName || doctorName,
      doctorHospital: prescription?.doctorHospital || 'DHH Bhawanipatna Telehealth Unit',
      diagnosisSummary,
      medicines,
      followUp,
      notes: clinicalNotes,
      digitalSignature: `Digitally Authorized by ${prescription?.doctorName || doctorName} (Reg No: OD-MED-8492)`
    });

    setIsSaved(true);
    if (onPrescriptionSaved) onPrescriptionSaved(saved);
    setTimeout(() => {
      setIsSaved(false);
      setIsEditing(false);
      if (mode === 'create') onClose();
    }, 1200);
  };

  const handleShare = () => {
    setSharedAlert(true);
    setTimeout(() => setSharedAlert(false), 2500);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="rx-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '740px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 id="rx-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                  {mode === 'create'
                    ? `${t.modalTitle} (Create)`
                    : isEditing
                    ? `${t.modalTitle} • ${currentRx.prescriptionNumber} (${t.editBadge})`
                    : `${t.modalTitle} • ${currentRx.prescriptionNumber}`}
                </h3>
                {isEditing && (
                  <span style={{ background: '#f59e0b', color: '#000', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                    {t.editBadge}
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                {t.modalSub}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Edit / View Mode Toggle button right in header */}
            {!isEditing && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.18)',
                  borderColor: '#38bdf8',
                  color: '#ffffff',
                  fontSize: '11px',
                  padding: '4px 10px',
                  fontWeight: 700
                }}
                title="Edit this prescription"
              >
                <Edit3 size={12} />
                <span>{t.btnEdit}</span>
              </button>
            )}

            {/* Interactive Language Selector */}
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

        {/* Modal Content */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '74vh', overflowY: 'auto' }}>
          {isEditing ? (
            /* ======================================================== */
            /* 1. EDIT MODE INTERFACE */
            /* ======================================================== */
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              border: '1.5px solid #93c5fd',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.12)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit3 size={18} style={{ color: '#0284c7' }} />
                  <strong style={{ fontSize: '15px', color: '#071c42' }}>
                    {mode === 'create' ? 'Create New E-Prescription' : `Edit E-Prescription: ${currentRx.prescriptionNumber}`}
                  </strong>
                </div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Patient: <strong>{currentRx.patientName}</strong> ({currentRx.patientId})
                </span>
              </div>

              {/* 1.1 Clinical Assessment / Diagnosis */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  {t.assessment} (Diagnosis Summary)
                </label>
                <textarea
                  rows={2}
                  value={diagnosisSummary}
                  onChange={(e) => setDiagnosisSummary(e.target.value)}
                  style={{ width: '100%', fontSize: '13px', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  placeholder="Enter clinical assessment or diagnosis impression..."
                />
              </div>

              {/* 1.2 Quick Add Preset Essential Medicines */}
              <div style={{ marginBottom: '16px', background: '#f0f9ff', padding: '12px', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} />
                  <span>{t.quickAddTitle}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {COMMON_ESSENTIAL_MEDS.map((med, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddMedicine(med)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #93c5fd',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#0284c7',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus size={11} />
                      <span>{med.name?.split(' ')[1] || med.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 1.3 Editable Medicines Table */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#0284c7', fontFamily: 'serif' }}>℞</span>
                    <strong style={{ fontSize: '13px', color: '#071c42' }}>Prescribed Medicines ({medicines.length})</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddMedicine()}
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={13} />
                    <span>{t.btnAddMed}</span>
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1', color: '#334155' }}>
                        <th style={{ padding: '6px 8px', textAlign: 'left', width: '25%' }}>{t.thMedicine}</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left', width: '15%' }}>Strength</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left', width: '20%' }}>{t.thDosage}</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left', width: '15%' }}>{t.thDuration}</th>
                        <th style={{ padding: '6px 8px', textAlign: 'left', width: '20%' }}>{t.thInstructions}</th>
                        <th style={{ padding: '6px 8px', textAlign: 'center', width: '5%' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((m, idx) => (
                        <tr key={m.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '6px 4px' }}>
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) => handleMedChange(idx, 'name', e.target.value)}
                              style={{ width: '100%', fontSize: '12px', padding: '4px 6px' }}
                              placeholder="Medicine Name"
                            />
                          </td>
                          <td style={{ padding: '6px 4px' }}>
                            <input
                              type="text"
                              value={m.strength}
                              onChange={(e) => handleMedChange(idx, 'strength', e.target.value)}
                              style={{ width: '100%', fontSize: '12px', padding: '4px 6px' }}
                              placeholder="500 mg"
                            />
                          </td>
                          <td style={{ padding: '6px 4px' }}>
                            <input
                              type="text"
                              value={m.dosage}
                              onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)}
                              style={{ width: '100%', fontSize: '12px', padding: '4px 6px' }}
                              placeholder="1 tablet"
                            />
                          </td>
                          <td style={{ padding: '6px 4px' }}>
                            <input
                              type="text"
                              value={m.duration}
                              onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                              style={{ width: '100%', fontSize: '12px', padding: '4px 6px' }}
                              placeholder="3 days"
                            />
                          </td>
                          <td style={{ padding: '6px 4px' }}>
                            <input
                              type="text"
                              value={m.instructions}
                              onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                              style={{ width: '100%', fontSize: '12px', padding: '4px 6px' }}
                              placeholder="Instructions"
                            />
                          </td>
                          <td style={{ padding: '6px 4px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicine(idx)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete medicine"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 1.4 Advice & Follow-up */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    {t.adviceLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    style={{ width: '100%', fontSize: '12px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    placeholder="Dietary, fluid, and rest advice..."
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    {t.followUpLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    style={{ width: '100%', fontSize: '12px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    placeholder="Follow-up instructions or referral date..."
                  />
                </div>
              </div>

              {/* Edit Mode Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                {mode !== 'create' && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    <RotateCcw size={14} />
                    <span>{t.btnCancelEdit}</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  style={{
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #059669, #0284c7)'
                  }}
                >
                  <Save size={14} />
                  <span>{isSaved ? t.btnUpdated : t.btnUpdate}</span>
                </button>
              </div>
            </div>
          ) : (
            /* ======================================================== */
            /* 2. VIEW MODE INTERFACE (Official Formatted Sheet) */
            /* ======================================================== */
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
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1', fontFamily: 'monospace' }}>
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
                  {diagnosisSummary || currentRx.diagnosisSummary || t.diagText}
                </div>
              </div>

              {/* Prescribed Medicines Table (Rx) */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#0284c7', fontFamily: 'serif' }}>℞</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#071c42', textTransform: 'uppercase' }}>
                      {t.rxHeader}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit3 size={13} />
                    <span>{t.btnEdit}</span>
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', minWidth: '500px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                        <th style={{ padding: '8px', textAlign: 'left', width: '30px' }}>{t.thNum}</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>{t.thMedicine}</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>{t.thDosage}</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>{t.thDuration}</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>{t.thInstructions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((med, mIdx) => (
                        <tr key={med.id || mIdx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px', fontWeight: 700, color: '#64748b' }}>{mIdx + 1}</td>
                          <td style={{ padding: '8px' }}>
                            <strong style={{ color: '#0f172a' }}>{med.name}</strong>
                            {med.strength && (
                              <div style={{ color: '#0284c7', fontSize: '11px', fontWeight: 600 }}>{med.strength}</div>
                            )}
                          </td>
                          <td style={{ padding: '8px', color: '#334155' }}>
                            {med.dosage} • <strong>{med.frequency}</strong>
                          </td>
                          <td style={{ padding: '8px', fontWeight: 600 }}>{med.duration}</td>
                          <td style={{ padding: '8px', color: '#64748b', fontSize: '11px' }}>{med.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Local Medicine Availability Preview */}
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
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{medicines[0]?.name || 'Tab Paracetamol 500mg'}</div>
                    <div style={{ color: '#64748b' }}>{paracetamolStock.pharmacyName} ({paracetamolStock.block})</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span className="badge badge-green" style={{ fontSize: '10px' }}>AVAILABLE</span>
                      <span style={{ color: '#64748b' }}>Updated {paracetamolStock.lastUpdated}</span>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{medicines[1]?.name || 'ORS Sachet'}</div>
                    <div style={{ color: '#64748b' }}>{orsStock.pharmacyName} ({orsStock.block})</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span className="badge badge-green" style={{ fontSize: '10px' }}>AVAILABLE</span>
                      <span style={{ color: '#64748b' }}>Updated {orsStock.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pharmacy Availability CTA */}
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
                    if (onCheckStock) onCheckStock(medicines[0]?.name || 'Paracetamol 500mg');
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
                  <span style={{ color: '#78350f' }}>{clinicalNotes || currentRx.notes || t.adviceText}</span>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px', borderRadius: '8px' }}>
                  <strong style={{ color: '#0369a1', display: 'block', marginBottom: '4px' }}>{t.followUpLabel}</strong>
                  <span style={{ color: '#334155' }}>{followUp || currentRx.followUp || t.followUpText}</span>
                </div>
              </div>

              {/* Digital Signature & Disclaimer */}
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', maxWidth: '320px' }}>
                  {t.disclaimer}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                    <ShieldCheck size={14} /> {currentRx.digitalSignature || t.digitalSig}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{t.eSignedAt} {currentRx.date}</div>
                </div>
              </div>
            </div>
          )}
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
            {!isEditing ? (
              <>
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

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(true)}
                  style={{ background: '#f0f9ff', borderColor: '#38bdf8', color: '#0284c7', fontWeight: 700 }}
                >
                  <Edit3 size={14} />
                  <span>{t.btnEdit}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onClose}
                >
                  {t.btnClose}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  <RotateCcw size={14} /> {t.btnCancelEdit}
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  style={{ fontWeight: 800, background: 'linear-gradient(135deg, #059669, #0284c7)' }}
                >
                  {isSaved ? <Check size={14} /> : <FileText size={14} />}
                  <span>{isSaved ? t.btnUpdated : t.btnUpdate}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EPrescriptionModal;
