import React, { useState } from 'react';
import { Pill, X, Download, Share2, Check, AlertCircle, Printer, FileText, CheckCircle2, ShieldCheck, MapPin, Globe } from 'lucide-react';
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
  lang?: Language;
  onCheckStock?: (medName: string) => void;
}

const RX_I18N: Record<Language, {
  headerTitleView: string;
  headerTitleCreate: string;
  subHeader: string;
  govtHeader: string;
  consultingClinician: string;
  patient: string;
  patientId: string;
  ageSex: string;
  district: string;
  clinicalImpression: string;
  rxHeader: string;
  tableNum: string;
  tableMed: string;
  tableDosage: string;
  tableDuration: string;
  tableInstructions: string;
  localStockTitle: string;
  localStockNote: string;
  findMedStoreTitle: string;
  findMedStoreSub: string;
  checkPharmacyBtn: string;
  adviceTitle: string;
  followUpTitle: string;
  signatureText: string;
  eSignedAt: string;
  disclaimer: string;
  printPdf: string;
  sharePatient: string;
  closeBtn: string;
  saveBtn: string;
  savedNotice: string;
  sharedSuccess: string;
}> = {
  English: {
    headerTitleView: 'E-Prescription',
    headerTitleCreate: 'Authorizing Clinician E-Prescription',
    subHeader: 'Swasthya Path Telehealth Initiative • Odisha MoHFW Workflow',
    govtHeader: 'GOVERNMENT OF ODISHA • DISTRICT HEALTH SOCIETY KALAHANDI',
    consultingClinician: 'Consulting Clinician',
    patient: 'Patient',
    patientId: 'Patient ID',
    ageSex: 'Age / Gender',
    district: 'District',
    clinicalImpression: 'Clinical Assessment & Provisional Diagnosis',
    rxHeader: 'Prescribed Medicines (Fictional Demo Formulation)',
    tableNum: '#',
    tableMed: 'Medicine & Strength',
    tableDosage: 'Dosage & Frequency',
    tableDuration: 'Duration',
    tableInstructions: 'Patient Instructions',
    localStockTitle: 'LOCAL MEDICINE AVAILABILITY (Kalahandi Jan Aushadhi)',
    localStockNote: '* Availability depends on pharmacy stock updates.',
    findMedStoreTitle: 'Find Medicine at Local Stores',
    findMedStoreSub: 'Check live availability in Store A (Jan Aushadhi), Store B (Junagarh), and Store C (Chhoriagarh).',
    checkPharmacyBtn: 'Check Pharmacy Availability ➔',
    adviceTitle: 'Advice & General Measures',
    followUpTitle: 'Follow-up Schedule',
    signatureText: 'Digitally Authorized by',
    eSignedAt: 'e-Signed at',
    disclaimer: 'Official Telehealth E-Prescription issued via Swasthya Path Kalahandi platform. Verified on ABDM / eSanjeevani Telehealth Gateway.',
    printPdf: 'Print / PDF',
    sharePatient: 'Share with Patient',
    closeBtn: 'Close',
    saveBtn: 'Save & Authorize Prescription',
    savedNotice: 'Prescription Saved!',
    sharedSuccess: 'Shared to patient records & SMS notification simulated!'
  },
  'ଓଡ଼ିଆ': {
    headerTitleView: 'ଇ-ପ୍ରେସକ୍ରିପସନ୍ (ଡାକ୍ତରୀ ଚିଠା)',
    headerTitleCreate: 'ଅନୁମୋଦିତ ଡାକ୍ତରୀ ଇ-ପ୍ରେସକ୍ରିପସନ୍',
    subHeader: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ ଟେଲି-ହେଲ୍ଥ ପଦକ୍ଷେପ • ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ଓ ପରିବାର କଲ୍ୟାଣ ବିଭାଗ',
    govtHeader: 'ଓଡ଼ିଶା ସରକାର • ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ସମିତି, କଳାହାଣ୍ଡି',
    consultingClinician: 'ପରାମର୍ଶଦାତା ଡାକ୍ତର',
    patient: 'ରୋଗୀଙ୍କ ନାମ',
    patientId: 'ରୋଗୀ ଆଇଡି',
    ageSex: 'ବୟସ / ଲିଙ୍ଗ',
    district: 'ଜିଲ୍ଲା',
    clinicalImpression: 'ଡାକ୍ତରୀ ଆକଳନ ଓ ସମ୍ଭାବ୍ୟ ରୋଗ ନିର୍ଣ୍ଣୟ',
    rxHeader: 'ଡାକ୍ତରଙ୍କ ଦ୍ୱାରା ଲେଖାଯାଇଥିବା ଔଷଧ (Rx)',
    tableNum: 'କ୍ରମିକ',
    tableMed: 'ଔଷଧ ନାମ ଓ ଶକ୍ତି',
    tableDosage: 'ଖାଇବା ମାତ୍ରା ଓ ସମୟ',
    tableDuration: 'ଦିନ ସଂଖ୍ୟା',
    tableInstructions: 'ରୋଗୀଙ୍କ ପାଇଁ ନିୟମ',
    localStockTitle: 'ସ୍ଥାନୀୟ ଔଷଧ ଷ୍ଟକ୍ ଉପଲବ୍ଧତା (କଳାହାଣ୍ଡି ଜନ ଔଷଧି କେନ୍ଦ୍ର)',
    localStockNote: '* ଷ୍ଟକ୍ ସ୍ଥିତି ଫାର୍ମାସୀର ସଦ୍ୟତମ ତଥ୍ୟ ଉପରେ ନିର୍ଭରଶୀଳ।',
    findMedStoreTitle: 'ନିକଟସ୍ଥ ଦୋକାନରୁ ଔଷଧ ଖୋଜନ୍ତୁ',
    findMedStoreSub: 'ଦୋକାନ A (ଜନ ଔଷଧି), ଦୋକାନ B (ଜୁନାଗଡ଼) ଏବଂ ଦୋକାନ C ରେ ଔଷଧ ଅଛି କି ନାହିଁ ଦେଖନ୍ତୁ।',
    checkPharmacyBtn: 'ଔଷଧ ଉପଲବ୍ଧତା ଯାଞ୍ଚ କରନ୍ତୁ ➔',
    adviceTitle: 'ଉପଦେଶ ଓ ସାଧାରଣ ଯତ୍ନ',
    followUpTitle: 'ପରବର୍ତ୍ତୀ ଡାକ୍ତରୀ ପରାମର୍ଶ ତାରିଖ',
    signatureText: 'ଡିଜିଟାଲ୍ ସ୍ୱାକ୍ଷର ଦ୍ୱାରା ପ୍ରମାଣିତ:',
    eSignedAt: 'ଡିଜିଟାଲ୍ ସ୍ୱାକ୍ଷରିତ ତାରିଖ',
    disclaimer: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ କଳାହାଣ୍ଡି ଟେଲି-ମେଡିସିନ ପୋର୍ଟାଲ ଦ୍ୱାରା ପ୍ରଦତ୍ତ ଅଫିସିଆଲ ଡାକ୍ତରୀ ଚିଠା। ABDM ଏବଂ ଇ-ସଞ୍ଜୀବନୀ ମାନଦଣ୍ଡ ଅନୁଯାୟୀ ଯାଞ୍ଚ ହୋଇଛି।',
    printPdf: 'ପ୍ରିଣ୍ଟ / PDF ଡାଉନଲୋଡ୍',
    sharePatient: 'ରୋଗୀଙ୍କ ସହ ସେୟାର କରନ୍ତୁ',
    closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
    saveBtn: 'ପ୍ରେସକ୍ରିପସନ୍ ସାଇତନ୍ତୁ',
    savedNotice: 'ପ୍ରେସକ୍ରିପସନ୍ ସଫଳତାର ସହ ସାଇତାଗଲା!',
    sharedSuccess: 'ରୋଗୀଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ଓ ମୋବାଇଲ SMS କୁ ପଠାଗଲା!'
  },
  'हिन्दी': {
    headerTitleView: 'ई-प्रिस्क्रिप्शन (दवा पर्ची)',
    headerTitleCreate: 'अधिकृत चिकित्सीय ई-प्रिस्क्रिप्शन',
    subHeader: 'स्वास्थ्य पथ टेली-हेल्थ पहल • ओडिशा स्वास्थ्य विभाग कार्यप्रणाली',
    govtHeader: 'ओडिशा सरकार • जिला स्वास्थ्य समिति, कालाहांडी',
    consultingClinician: 'परामर्शदाता डॉक्टर',
    patient: 'रोगी का नाम',
    patientId: 'रोगी आईडी',
    ageSex: 'आयु / लिंग',
    district: 'जिला',
    clinicalImpression: 'चिकित्सीय मूल्यांकन एवं संभावित निदान',
    rxHeader: 'निर्धारित दवाइयां (Rx)',
    tableNum: 'क्र.',
    tableMed: 'दवा का नाम और मात्रा',
    tableDosage: 'खुराक और समय',
    tableDuration: 'अवधि',
    tableInstructions: 'रोगी के लिए निर्देश',
    localStockTitle: 'स्थानीय दवा उपलब्धता (कालाहांडी जन औषधि केंद्र)',
    localStockNote: '* दवा की उपलब्धता फार्मेसी के ताजा अपडेट पर निर्भर है।',
    findMedStoreTitle: 'नजदीकी मेडिकल स्टोर में दवा खोजें',
    findMedStoreSub: 'दुकान A (जन औषधि), दुकान B (जूनागढ़) और दुकान C में लाइव स्टॉक देखें।',
    checkPharmacyBtn: 'दवा की उपलब्धता जांचें ➔',
    adviceTitle: 'सलाह एवं सामान्य सावधानियां',
    followUpTitle: 'अगला परामर्श कार्यक्रम',
    signatureText: 'डिजिटल रूप से अधिकृत:',
    eSignedAt: 'डिजिटल हस्ताक्षर तिथि',
    disclaimer: 'स्वास्थ्य पथ कालाहांडी टेली-हेल्थ पोर्टल द्वारा जारी आधिकारिक ई-प्रिस्क्रिप्शन। ABDM और ई-संजीवनी मानकों के अनुरूप सत्यापित।',
    printPdf: 'प्रिंट / PDF डाउनलोड',
    sharePatient: 'रोगी के साथ साझा करें',
    closeBtn: 'बंद करें',
    saveBtn: 'प्रिस्क्रिप्शन सहेजें',
    savedNotice: 'प्रिस्क्रिप्शन सहेज लिया गया!',
    sharedSuccess: 'रोगी के स्वास्थ्य रिकॉर्ड और मोबाइल SMS पर भेजा गया!'
  }
};

const translateText = (text: string, currentLang: Language): string => {
  if (currentLang === 'English') return text;

  const odiaMap: Record<string, string> = {
    '1 tablet': '୧ ଟି ଟାବଲେଟ୍',
    '1 sachet in 1 Litre water': '୧ ଲିଟର ପାଣିରେ ୧ ପ୍ୟାକେଟ୍',
    'SOS (When needed for fever > 100°F)': 'ଆବଶ୍ୟକ ହେଲେ (୧୦୦°F ରୁ ଅଧିକ ଜ୍ୱର ହେଲେ)',
    'Throughout the day': 'ସାରା ଦିନ ଧରି',
    '3 days': '୩ ଦିନ',
    'Take after meals with warm water. Maximum 3 tablets in 24 hours.': 'ଖାଇବା ପରେ ଉଷୁମ ପାଣି ସହିତ ନିଅନ୍ତୁ। ୨୪ ଘଣ୍ଟାରେ ସର୍ବାଧିକ ୩ଟି ଟାବଲେଟ।',
    'Sip frequently to maintain hydration and electrolytes.': 'ଶରୀରରେ ଜଳୀୟଅଂଶ ବଜାୟ ରଖିବା ପାଇଁ ବାରମ୍ବାର ଟିକେ ଟିକେ ପିଅନ୍ତୁ।',
    'Acute viral febrile episode with mild asthenia. No red-flag respiratory or hemorrhagic distress noted.': 'ସାମାନ୍ୟ ଦୁର୍ବଳତା ସହ ଭାଇରାଲ ଜ୍ୱର। କୌଣସି ଜରୁରୀ ଶ୍ୱାସକ୍ରିୟା ବା ରକ୍ତସ୍ରାବ ସଙ୍କଟ ନାହିଁ।',
    'Acute mild viral upper respiratory infection without emergency red-flags.': 'ଜରୁରୀ ସଙ୍କଟ ବିନା ସାମାନ୍ୟ ଋତୁକାଳୀନ ଭାଇରାଲ ଥଣ୍ଡା ଓ ଜ୍ୱର।',
    'Maintain oral fluids and rest. Avoid self-medication with NSAIDs.': 'ପ୍ରଚୁର ପାଣି/ଓଆରଏସ ପିଅନ୍ତୁ ଓ ବିଶ୍ରାମ ନିଅନ୍ତୁ। ନିଜ ଇଚ୍ଛାରେ ଅନ୍ୟ ଔଷଧ ଖାଆନ୍ତୁ ନାହିଁ।',
    'Follow-up teleconsultation in 3 days if fever does not subside or if warning signs develop.': 'ଯଦି ୩ ଦିନରେ ଜ୍ୱର ନ କମେ ବା କୌଣସି ଜରୁରୀ ସଙ୍କଟ ଲକ୍ଷଣ ଦେଖାଦିଏ, ତେବେ ପୁଣି ଟେଲି-ପରାମର୍ଶ କରନ୍ତୁ।',
    'Kalahandi': 'କଳାହାଣ୍ଡି, ଓଡ଼ିଶା',
    '26 Y / M': '୨୬ ବର୍ଷ / ପୁରୁଷ',
    'District Headquarters Hospital (DHH) Bhawanipatna Telehealth Unit': 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ (DHH) ଭବାନୀପାଟଣା ଟେଲି-ହେଲ୍ଥ ୟୁନିଟ୍',
    'DHH Bhawanipatna Telehealth Unit': 'DHH ଭବାନୀପାଟଣା ଟେଲି-ହେଲ୍ଥ ୟୁନିଟ୍'
  };

  const hindiMap: Record<string, string> = {
    '1 tablet': '१ गोली',
    '1 sachet in 1 Litre water': '१ लीटर पानी में १ पैकेट',
    'SOS (When needed for fever > 100°F)': 'ज़रूरत पड़ने पर (१००°F से अधिक बुखार होने पर)',
    'Throughout the day': 'दिन भर में',
    '3 days': '३ दिन',
    'Take after meals with warm water. Maximum 3 tablets in 24 hours.': 'खाना खाने के बाद गुनगुने पानी के साथ लें। २४ घंटे में अधिकतम ३ गोलियां।',
    'Sip frequently to maintain hydration and electrolytes.': 'शरीर में पानी की कमी दूर करने के लिए थोड़ा-थोड़ा पीते रहें।',
    'Acute viral febrile episode with mild asthenia. No red-flag respiratory or hemorrhagic distress noted.': 'हल्की कमजोरी के साथ वायरल बुखार। सांस लेने में या कोई गंभीर खतरे के लक्षण नहीं हैं।',
    'Acute mild viral upper respiratory infection without emergency red-flags.': 'सामान्य मौसमी वायरल बुखार और सर्दी। कोई गंभीर आपातकालीन लक्षण नहीं।',
    'Maintain oral fluids and rest. Avoid self-medication with NSAIDs.': 'भरपूर पानी/ओआरएस पिएं और आराम करें। बिना सलाह के अन्य दवाइयां न लें।',
    'Follow-up teleconsultation in 3 days if fever does not subside or if warning signs develop.': 'यदि ३ दिनों में बुखार कम न हो या कोई गंभीर लक्षण दिखे, तो पुनः टेली-परामर्श करें।',
    'Kalahandi': 'कालाहांडी, ओडिशा',
    '26 Y / M': '२६ वर्ष / पुरुष',
    'District Headquarters Hospital (DHH) Bhawanipatna Telehealth Unit': 'जिला मुख्य चिकित्सालय (DHH) भवानीपटना टेली-हेल्थ यूनिट',
    'DHH Bhawanipatna Telehealth Unit': 'DHH भवानीपटना टेली-हेल्थ यूनिट'
  };

  const map = currentLang === 'ଓଡ଼ିଆ' ? odiaMap : hindiMap;
  return map[text] || text;
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
  lang = 'English',
  onCheckStock
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);

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

  // Sync internal language state if external prop changes
  React.useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = RX_I18N[activeLang] || RX_I18N.English;

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
    digitalSignature: `Digitally Authorized by ${doctorName} (Reg No: OD-MED-8492)`
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
      <div className="modal-dialog" style={{ maxWidth: '720px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
          color: '#ffffff',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexWrap: 'wrap',
          gap: '10px'
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
                {mode === 'create' ? t.headerTitleCreate : `${t.headerTitleView} • ${currentRx.prescriptionNumber}`}
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                {t.subHeader}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Multilingual Switcher Pills inside Prescription */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.12)',
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
                    {t.govtHeader}
                  </div>
                  <h4 style={{ margin: '2px 0 0', fontSize: '17px', color: '#071c42' }}>
                    {translateText(currentRx.doctorHospital, activeLang)}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {t.consultingClinician}: <strong>{currentRx.doctorName}</strong> (General Medicine / ସାଧାରଣ ଚିକିତ୍ସା)
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1' }}>
                    {currentRx.prescriptionNumber}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {activeLang === 'ଓଡ଼ିଆ' ? 'ତାରିଖ:' : activeLang === 'हिन्दी' ? 'दिनांक:' : 'Date:'} <strong>{currentRx.date}</strong>
                  </div>
                </div>
              </div>

              {/* Patient Banner */}
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                background: '#f0f9ff',
                borderRadius: '8px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '8px',
                fontSize: '12px',
                border: '1px solid #bae6fd'
              }}>
                <div><span style={{ color: '#64748b' }}>{t.patient}:</span> <strong>{currentRx.patientName}</strong></div>
                <div><span style={{ color: '#64748b' }}>{t.patientId}:</span> <strong style={{ color: '#0284c7' }}>{currentRx.patientId}</strong></div>
                <div><span style={{ color: '#64748b' }}>{t.ageSex}:</span> <strong>{translateText('26 Y / M', activeLang)}</strong></div>
                <div><span style={{ color: '#64748b' }}>{t.district}:</span> <strong>{translateText('Kalahandi', activeLang)}</strong></div>
              </div>
            </div>

            {/* Clinical Evaluation Summary */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                {t.clinicalImpression}
              </div>
              <div style={{ fontSize: '13px', color: '#0f172a', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: 1.5 }}>
                {translateText(currentRx.diagnosisSummary, activeLang)}
              </div>
            </div>

            {/* Prescribed Medicines Table (Rx) */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7', fontFamily: 'serif' }}>℞</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#071c42', textTransform: 'uppercase' }}>
                  {t.rxHeader}
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1.5px solid #cbd5e1' }}>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>{t.tableNum}</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>{t.tableMed}</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>{t.tableDosage}</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>{t.tableDuration}</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left' }}>{t.tableInstructions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRx.medicines.map((m, idx) => (
                      <tr key={m.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 700, color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 8px' }}>
                          <strong style={{ color: '#0f172a', fontSize: '13px' }}>{m.name}</strong>
                          <div style={{ color: '#0284c7', fontSize: '11px', fontWeight: 600 }}>{m.strength}</div>
                        </td>
                        <td style={{ padding: '10px 8px', color: '#334155' }}>
                          <div>{translateText(m.dosage, activeLang)}</div>
                          <strong style={{ color: '#0369a1', fontSize: '11px' }}>{translateText(m.frequency, activeLang)}</strong>
                        </td>
                        <td style={{ padding: '10px 8px', fontWeight: 700, color: '#0f172a' }}>
                          {translateText(m.duration, activeLang)}
                        </td>
                        <td style={{ padding: '10px 8px', color: '#475569', fontSize: '12px', lineHeight: 1.4 }}>
                          {translateText(m.instructions, activeLang)}
                        </td>
                      </tr>
                    ))}
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
                    {t.localStockTitle}
                  </strong>
                </div>
                <span style={{ fontSize: '10px', color: '#15803d', fontStyle: 'italic' }}>
                  {t.localStockNote}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '11px' }}>
                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{paracetamolStock.name}</div>
                  <div style={{ color: '#64748b' }}>{paracetamolStock.pharmacyName} ({paracetamolStock.block})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ଷ୍ଟକ୍ ଅଛି' : activeLang === 'हिन्दी' ? 'उपलब्ध है' : paracetamolStock.status}
                    </span>
                    <span style={{ color: '#64748b' }}>
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ସଦ୍ୟ ଅପଡେଟ୍' : activeLang === 'हिन्दी' ? 'ताजा अपडेट' : 'Updated'} {paracetamolStock.lastUpdated}
                    </span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #dcfce7' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{orsStock.name}</div>
                  <div style={{ color: '#64748b' }}>{orsStock.pharmacyName} ({orsStock.block})</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ଷ୍ଟକ୍ ଅଛି' : activeLang === 'हिन्दी' ? 'उपलब्ध है' : orsStock.status}
                    </span>
                    <span style={{ color: '#64748b' }}>
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ସଦ୍ୟ ଅପଡେଟ୍' : activeLang === 'हिन्दी' ? 'ताजा अपडेट' : 'Updated'} {orsStock.lastUpdated}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Diagram Connection: Doctor Consult -> Care Advice & Medicine -> Find Medicine -> Pharmacy Availability (Store A, B, C) */}
            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={15} /> {t.findMedStoreTitle}
                </strong>
                <div style={{ fontSize: '11px', color: '#15803d', marginTop: '2px' }}>
                  {t.findMedStoreSub}
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
                {t.checkPharmacyBtn}
              </button>
            </div>

            {/* Follow-up & Advice */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px', fontSize: '12px' }}>
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#b45309', display: 'block', marginBottom: '4px' }}>
                  {t.adviceTitle}:
                </strong>
                <span style={{ color: '#78350f', lineHeight: 1.4, display: 'block' }}>
                  {translateText(currentRx.notes || clinicalNotes, activeLang)}
                </span>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px' }}>
                <strong style={{ color: '#0369a1', display: 'block', marginBottom: '4px' }}>
                  {t.followUpTitle}:
                </strong>
                <span style={{ color: '#334155', lineHeight: 1.4, display: 'block' }}>
                  {translateText(currentRx.followUp || followUp, activeLang)}
                </span>
              </div>
            </div>

            {/* Digital Signature & Disclaimer */}
            <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ fontSize: '10px', color: '#64748b', maxWidth: '340px', lineHeight: 1.4 }}>
                {t.disclaimer}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#059669', fontSize: '11px', fontWeight: 700 }}>
                  <ShieldCheck size={14} /> {t.signatureText} {currentRx.doctorName}
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
              <Printer size={14} /> {t.printPdf}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleShare}
            >
              <Share2 size={14} /> {t.sharePatient}
            </button>

            {mode === 'create' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                style={{ fontWeight: 800 }}
              >
                {isSaved ? <Check size={14} /> : <FileText size={14} />}
                <span>{isSaved ? t.savedNotice : t.saveBtn}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                {t.closeBtn}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
