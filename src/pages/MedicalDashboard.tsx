import React, { useState, useEffect, useRef } from 'react';
import {
  FlaskConical,
  FileText,
  Upload,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Search,
  Printer,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
  Activity,
  Heart,
  Thermometer,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Share2,
  Sliders,
  Calendar,
  Layers,
  FileCheck,
  ArrowLeft,
  AlertOctagon,
  BarChart3,
  Database,
  Building2,
  X,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import {
  DemoUser,
  Language,
  NetworkQuality,
  DiagnosticDocument,
  DiagnosticTestParameter,
  PhysiologicalVitals,
  LabTestItem,
  LabTestOrder,
  LabOrderStatus,
  LabSample,
  LabSampleStatus
} from '../types';
import { storage } from '../utils/storage';
import { DocumentViewerModal } from '../components/DocumentViewerModal';

interface MedicalDashboardProps {
  user: DemoUser;
  networkQuality: NetworkQuality;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
  onBack?: () => void;
}

type LabTab =
  | 'dashboard'
  | 'orders'
  | 'catalogue'
  | 'submit'
  | 'registry'
  | 'vitals'
  | 'instruments';

const DASH_I18N: Record<string, Record<string, string>> = {
  English: {
    portalBadge: 'District Pathology & Diagnostics Hub',
    centerTitle: 'DHH Central Diagnostic & Pathology Center',
    centerSubtitle: 'District Headquarters Hospital • Bhawanipatna, Kalahandi, Odisha • NABL & ABDM M3 Certified',
    statReportsToday: 'Reports Today',
    statPhysicalSubmitted: 'Physical Scans Added',
    statCriticalAlerts: 'Critical Value Alerts',
    statAbhaSynced: 'ABHA Records Synced',
    tabDashboard: 'Laboratory Dashboard',
    tabOrders: 'Test Requests & Samples',
    tabCatalogue: 'Test Catalogue',
    tabSubmit: 'Enter & Verify Report',
    tabRegistry: 'Reports Registry',
    tabVitals: 'Physical Vitals Intake',
    tabInstruments: 'Lab Instruments & QC',
    patientSectionTitle: '1. Patient Identification',
    selectPreConfig: 'Quick Select Patient:',
    patientIdLabel: 'Patient ID (ABHA / Hospital UID)',
    patientNameLabel: 'Full Patient Name',
    ageGenderLabel: 'Age / Gender',
    villageLabel: 'Village / Block',
    testSectionTitle: '2. Diagnostic Investigation Details',
    testCategoryLabel: 'Test Category',
    reportTitleLabel: 'Report Document Title',
    barcodeLabel: 'Lab Sample Barcode / Physical Ref',
    specimenLabel: 'Specimen / Sample Type',
    collectionDateLabel: 'Sample Collection Date & Time',
    uploadSectionTitle: '3. Physical Paper Document Scan / Upload',
    uploadPrompt: 'Drag & drop scanned report file or click to browse (PNG, JPG, PDF)',
    btnSimulateScan: 'Generate Sample Lab Scan',
    btnCaptureWebcam: 'Capture Camera Scan',
    removeAttachment: 'Remove attachment',
    parametersSectionTitle: '4. Physical Clinical Parameters & Test Findings',
    paramHelp: 'Review and modify the entered numerical results or qualitative findings from the physical lab paper:',
    thParamName: 'Test Parameter',
    thResult: 'Result Value',
    thUnit: 'Unit',
    thRefRange: 'Biological Reference Range',
    thStatus: 'Indicator Status',
    thAction: 'Action',
    btnAddParam: 'Add Test Parameter Row',
    notesSectionTitle: '5. Pathologist Review & Multi-Stage Verification',
    clinicalNotesLabel: 'Pathologist Clinical Remarks & Observations',
    notesPlaceholder: 'e.g. Normocytic normochromic blood picture. No hemoparasites seen. Advised clinical correlation.',
    criticalAlertLabel: 'Mark as CRITICAL VALUE (Triggers urgent clinical alert to doctor)',
    syncAbhaLabel: 'Digitally Link & Sync to Patient ABHA Health Record',
    technicianLabel: 'Lab Technologist Name',
    pathologistLabel: 'Sign-off Pathologist / Medical Officer',
    btnSubmitReport: 'Verify & Release Lab Report',
    submitting: 'Verifying & Submitting...',
    successTitle: 'Lab Report Verified & Released Successfully!',
    successDesc: 'The diagnostic report has been verified, cryptographically signed, and synchronized directly into the patient longitudinal health record and doctor workspace.',
    btnViewDoc: 'View Document in High-Res Viewer',
    btnSubmitAnother: 'Enter Another Report',
    searchPlaceholder: 'Search by patient name, ID, test name, or barcode...',
    filterAll: 'All Categories',
    filterLab: 'Lab Reports',
    filterXray: 'Radiology / X-Ray',
    filterReferral: 'Referral Slips',
    disclaimerNotice: '⚠️ Laboratory results should be interpreted by a qualified healthcare professional.',
    vitalsTitle: 'Pre-Consultation Physical Vitals Intake',
    vitalsDesc: 'Record physical vital signs taken at the diagnostic collection center prior to doctor video consultation.',
    instrumentsTitle: 'Laboratory Instrumentation & Quality Calibration',
    instrumentsDesc: 'Live telemetry and calibration logs of automated analyzers at DHH Kalahandi.',
    instStatusActive: 'Operational & Calibrated',
    instLastCalibrated: 'Last Calibrated:',
    instReagents: 'Reagent Status:'
  },
  'ଓଡ଼ିଆ': {
    portalBadge: 'ଜିଲ୍ଲା ପାଥୋଲୋଜି ଓ ନିଦାନ କେନ୍ଦ୍ର',
    centerTitle: 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ (DHH) କେନ୍ଦ୍ରୀୟ ନିଦାନ ଓ ପାଥୋଲୋଜି କେନ୍ଦ୍ର',
    centerSubtitle: 'ଭବାନୀପାଟଣା, କଳାହାଣ୍ଡି, ଓଡ଼ିଶା • NABL ଏବଂ ABDM M3 ସ୍ୱୀକୃତିପ୍ରାପ୍ତ',
    statReportsToday: 'ଆଜିର ମୋଟ ରିପୋର୍ଟ',
    statPhysicalSubmitted: 'ଶାରୀରିକ ସ୍କାନ୍ ଦାଖଲ',
    statCriticalAlerts: 'ଜରୁରୀ ବିପଦ ଚେତାବନୀ',
    statAbhaSynced: 'ABHA ସହ ସଂଯୁକ୍ତ',
    tabDashboard: 'ପାଥୋଲୋଜି ଡ୍ୟାସବୋର୍ଡ',
    tabOrders: 'ପରୀକ୍ଷା ଅନୁରୋଧ ଓ ନମୁନା',
    tabCatalogue: 'ପରୀକ୍ଷା ତାଲିକା (କାଟାଲଗ୍)',
    tabSubmit: 'ରିପୋର୍ଟ ପ୍ରବେଶ ଓ ଯାଞ୍ଚ',
    tabRegistry: 'ରିପୋର୍ଟ ରେଜିଷ୍ଟ୍ରି',
    tabVitals: 'ଶାରୀରିକ ଭାଇଟାଲ୍ସ ଯାଞ୍ଚ',
    tabInstruments: 'ଯନ୍ତ୍ରପାତି ଓ ଗୁଣବତ୍ତା',
    patientSectionTitle: '୧. ରୋଗୀ ଚିହ୍ନଟ',
    selectPreConfig: 'ରୋଗୀ ଚୟନ କରନ୍ତୁ:',
    patientIdLabel: 'ରୋଗୀ ଆଇଡି (ABHA / UID)',
    patientNameLabel: 'ରୋଗୀଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ନାମ',
    ageGenderLabel: 'ବୟସ / ଲିଙ୍ଗ',
    villageLabel: 'ଗ୍ରାମ / ବ୍ଲକ୍',
    testSectionTitle: '୨. ପରୀକ୍ଷା ଓ ନିଦାନ ବିବରଣୀ',
    testCategoryLabel: 'ପରୀକ୍ଷା ବିଭାଗ',
    reportTitleLabel: 'ରିପୋର୍ଟ ଶୀର୍ଷକ / ନାମ',
    barcodeLabel: 'ଲାବ୍ ନମୁନା ବାରକୋଡ୍ / ରେଫରେନ୍ସ ନଂ',
    specimenLabel: 'ନମୁନା ପ୍ରକାର (Specimen)',
    collectionDateLabel: 'ନମୁନା ସଂଗ୍ରହ ତାରିଖ ଓ ସମୟ',
    uploadSectionTitle: '୩. କାଗଜ ରିପୋର୍ଟ ସ୍କାନ୍ ବା ଫଟୋ ଅପଲୋଡ୍',
    uploadPrompt: 'କାଗଜ ରିପୋର୍ଟ ସ୍କାନ୍ କିମ୍ବା ଫଟୋ ଫାଇଲ୍ ଟାଣି ଆଣନ୍ତୁ (PNG, JPG, PDF)',
    btnSimulateScan: 'ନମୁନା ଲାବ୍ ସ୍କାନ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    btnCaptureWebcam: 'କ୍ୟାମେରାରୁ ସ୍କାନ୍ କରନ୍ତୁ',
    removeAttachment: 'ଫାଇଲ୍ ହଟାନ୍ତୁ',
    parametersSectionTitle: '୪. ଶାରୀରିକ ପରୀକ୍ଷା ମାନ ଓ ଫଳାଫଳ',
    paramHelp: 'ପରୀକ୍ଷାଗାର ଫଳାଫଳର ସଂଖ୍ୟାତ୍ମକ ମାନ ଏବଂ ସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ:',
    thParamName: 'ପରୀକ୍ଷା ପାରାମିଟର',
    thResult: 'ଫଳାଫଳ ମାନ',
    thUnit: 'ଏକକ (Unit)',
    thRefRange: 'ଜୈବିକ ରେଫରେନ୍ସ ସୀମା',
    thStatus: 'ସ୍ଥିତି ସୂଚକ',
    thAction: 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ',
    btnAddParam: 'ନୂତନ ପାରାମିଟର ଯୋଡ଼ନ୍ତୁ',
    notesSectionTitle: '୫. ପାଥୋଲୋଜିଷ୍ଟ ଯାଞ୍ଚ ଓ ଅନ୍ତିମ ପ୍ରମାଣୀକରଣ',
    clinicalNotesLabel: 'ପାଥୋଲୋଜିଷ୍ଟ ମନ୍ତବ୍ୟ ଓ ନିରୀକ୍ଷଣ',
    notesPlaceholder: 'ଉଦା. ସମସ୍ତ ପାରାମିଟର ସ୍ୱାଭାବିକ ସୀମା ମଧ୍ୟରେ ଅଛି। କୌଣସି ପରଜୀବୀ ଦେଖାଯାଇନାହିଁ।',
    criticalAlertLabel: 'ଜରୁରୀ ବିପଦ ମାନ ଚିହ୍ନଟ କରନ୍ତୁ (ଡାକ୍ତରଙ୍କୁ ତୁରନ୍ତ ସତର୍କ ସୂଚନା ଯିବ)',
    syncAbhaLabel: 'ରୋଗୀଙ୍କ ABHA ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ସହିତ ସିଙ୍କ୍ କରନ୍ତୁ',
    technicianLabel: 'ଲାବ୍ ଟେକ୍ନିସିଆନ୍ ନାମ',
    pathologistLabel: 'ସ୍ୱାକ୍ଷରକାରୀ ପାଥୋଲୋଜିଷ୍ଟ / ଡାକ୍ତର',
    btnSubmitReport: 'ରିପୋର୍ଟ ପ୍ରମାଣିତ କରି ରିଲିଜ୍ କରନ୍ତୁ',
    submitting: 'ପ୍ରମାଣିତ ହେଉଛି...',
    successTitle: 'ପାଥୋଲୋଜି ରିପୋର୍ଟ ସଫଳତାର ସହ ରିଲିଜ୍ ହେଲା!',
    successDesc: 'ଏହି ରିପୋର୍ଟ ଡିଜିଟାଲ୍ ଭାବରେ ପ୍ରମାଣିତ ହୋଇ ରୋଗୀ ଓ ଡାକ୍ତରଙ୍କ ମେଡିକାଲ୍ ରେକର୍ଡ ସହିତ ସିଧାସଳଖ ସିଙ୍କ୍ ହୋଇଛି।',
    btnViewDoc: 'ହାଇ-ରିଜୋଲ୍ୟୁସନ୍ ଭ୍ୟୁଅର୍‌ରେ ଦେଖନ୍ତୁ',
    btnSubmitAnother: 'ଅନ୍ୟ ଏକ ରିପୋର୍ଟ ପ୍ରବେଶ କରନ୍ତୁ',
    searchPlaceholder: 'ରୋଗୀଙ୍କ ନାମ, ଆଇଡି ବା ବାରକୋଡ୍ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...',
    filterAll: 'ସମସ୍ତ ବିଭାଗ',
    filterLab: 'ଲାବ୍ ରିପୋର୍ଟ',
    filterXray: 'ରେଡିଓଲୋଜି / ଏକ୍ସ-ରେ',
    filterReferral: 'ରେଫରାଲ୍ ସ୍ଲିପ୍',
    disclaimerNotice: '⚠️ ପରୀକ୍ଷାଗାର ଫଳାଫଳ ଜଣେ ଯୋଗ୍ୟତାପ୍ରାପ୍ତ ଡାକ୍ତରଙ୍କ ଦ୍ୱାରା ହିଁ ନିରୂପଣ କରାଯିବା ଉଚିତ।',
    vitalsTitle: 'ପରାମର୍ଶ ପୂର୍ବ ଭାଇଟାଲ୍ସ ଯାଞ୍ଚ',
    vitalsDesc: 'ଡାକ୍ତରଙ୍କ ଭିଡିଓ ପରାମର୍ଶ ପୂର୍ବରୁ ସଂଗ୍ରହ କେନ୍ଦ୍ରରେ ରୋଗୀଙ୍କ ଶାରୀରିକ ଭାଇଟାଲ୍ସ ରେକର୍ଡ କରନ୍ତୁ।',
    instrumentsTitle: 'ପରୀକ୍ଷାଗାର ଯନ୍ତ୍ରପାତି ଓ ଗୁଣବତ୍ତା',
    instrumentsDesc: 'କଳାହାଣ୍ଡି ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ପାଥୋଲୋଜି ଯନ୍ତ୍ରାଂଶ ସ୍ଥିତି।',
    instStatusActive: 'କାର୍ଯ୍ୟକ୍ଷମ ଓ କାଲିବ୍ରେଟେଡ୍',
    instLastCalibrated: 'ଶେଷ କାଲିବ୍ରେସନ୍:',
    instReagents: 'ରିଏଜେଣ୍ଟ୍ ସ୍ଥିତି:'
  },
  'हिन्दी': {
    portalBadge: 'जिला पैथोलॉजी एवं डायग्नोस्टिक्स केंद्र',
    centerTitle: 'DHH केंद्रीय डायग्नोस्टिक एवं पैथोलॉजी केंद्र',
    centerSubtitle: 'जिला मुख्यालय अस्पताल • भवानीपटना, कालाहांडी, ओडिशा • NABL एवं ABDM M3 प्रमाणित',
    statReportsToday: 'आज की कुल रिपोर्ट',
    statPhysicalSubmitted: 'शारीरिक रिपोर्ट दर्ज',
    statCriticalAlerts: 'गंभीर मान चेतावनी',
    statAbhaSynced: 'ABHA से सिंक',
    tabDashboard: 'पैथोलॉजी डैशबोर्ड',
    tabOrders: 'जांच अनुरोध एवं नमूने',
    tabCatalogue: 'जांच कैटलॉग',
    tabSubmit: 'रिपोर्ट प्रविष्टि एवं सत्यापन',
    tabRegistry: 'रिपोर्ट्स रजिस्ट्री',
    tabVitals: 'शारीरिक वाइटल्स जांच',
    tabInstruments: 'उपकरण एवं गुणवत्ता नियंत्रण',
    patientSectionTitle: '1. मरीज की पहचान',
    selectPreConfig: 'मरीज का त्वरित चयन:',
    patientIdLabel: 'मरीज आईडी (ABHA / UID)',
    patientNameLabel: 'मरीज का पूरा नाम',
    ageGenderLabel: 'आयु / लिंग',
    villageLabel: 'गांव / ब्लॉक',
    testSectionTitle: '2. डायग्नोस्टिक जांच विवरण',
    testCategoryLabel: 'जांच श्रेणी',
    reportTitleLabel: 'रिपोर्ट दस्तावेज का नाम',
    barcodeLabel: 'लैब सैंपल बारकोड / फिजिकल संदर्भ संख्या',
    specimenLabel: 'नमूना प्रकार (Specimen Type)',
    collectionDateLabel: 'नमूना संग्रह दिनांक एवं समय',
    uploadSectionTitle: '3. फिजिकल पेपर रिपोर्ट स्कैन / अपलोड',
    uploadPrompt: 'कागजी रिपोर्ट का स्कैन या फोटो खींचकर अपलोड करें (PNG, JPG, PDF)',
    btnSimulateScan: 'नमूना लैब स्कैन जोड़ें',
    btnCaptureWebcam: 'कैमरा से स्कैन करें',
    removeAttachment: 'अटैचमेंट हटाएं',
    parametersSectionTitle: '4. शारीरिक परीक्षण पैरामीटर एवं परिणाम',
    paramHelp: 'कागजी लैब रिपोर्ट से प्राप्त संख्यात्मक अथवा गुणात्मक मानों की समीक्षा और संपादन करें:',
    thParamName: 'पैरामीटर नाम',
    thResult: 'परिणाम मान',
    thUnit: 'इकाई (Unit)',
    thRefRange: 'जैविक संदर्भ सीमा',
    thStatus: 'स्थिति संकेतक',
    thAction: 'क्रिया',
    btnAddParam: 'नई परीक्षण पंक्ति जोड़ें',
    notesSectionTitle: '5. पैथोलॉजिस्ट समीक्षा एवं अंतिम सत्यापन',
    clinicalNotesLabel: 'पैथोलॉजिस्ट की चिकित्सीय टिप्पणी एवं निष्कर्ष',
    notesPlaceholder: 'उदा. हीमोग्लोबिन एवं प्लेटलेट सामान्य सीमा में हैं। कोई रोगजनक सूक्ष्मजीव नहीं पाए गए।',
    criticalAlertLabel: 'गंभीर चेतावनी के रूप में चिह्नित करें (डॉक्टर को तत्काल अलर्ट भेजा जाएगा)',
    syncAbhaLabel: 'मरीज के ABHA डिजिटल स्वास्थ्य रिकॉर्ड से जोड़ें',
    technicianLabel: 'लैब तकनीशियन का नाम',
    pathologistLabel: 'सत्यापनकर्ता पैथोलॉजिस्ट / चिकित्सा अधिकारी',
    btnSubmitReport: 'रिपोर्ट सत्यापित कर रिलीज करें',
    submitting: 'सत्यापित किया जा रहा है...',
    successTitle: 'लैब रिपोर्ट सफलतापूर्वक रिलीज हो गई!',
    successDesc: 'कागजी रिपोर्ट डिजिटल रूप से सत्यापित होकर मरीज के रिकॉर्ड में जुड़ चुकी है और डॉक्टर कार्यक्षेत्र में भी उपलब्ध है।',
    btnViewDoc: 'हाई-रेज़ोल्यूशन व्यूअर में देखें',
    btnSubmitAnother: 'अन्य रिपोर्ट दर्ज करें',
    searchPlaceholder: 'मरीज के नाम, आईडी या बारकोड से खोजें...',
    filterAll: 'सभी श्रेणियां',
    filterLab: 'लैब रिपोर्ट',
    filterXray: 'रेडियोलॉजी / एक्स-रे',
    filterReferral: 'रेफरल स्लिप',
    disclaimerNotice: '⚠️ प्रयोगशाला परिणामों की व्याख्या किसी योग्य चिकित्सक द्वारा नैदानिक संदर्भ में ही की जानी चाहिए।',
    vitalsTitle: 'परामर्श पूर्व शारीरिक वाइटल्स संग्रह',
    vitalsDesc: 'डॉक्टर से वीडियो कंसल्टेशन से पूर्व केंद्र पर मरीज के शारीरिक वाइटल साइन दर्ज करें।',
    instrumentsTitle: 'प्रयोगशाला उपकरण एवं गुणवत्ता अंशांकन',
    instrumentsDesc: 'कालाहांडी जिला मुख्यालय अस्पताल में स्वचालित एनालाइजर्स की लाइव स्थिति।',
    instStatusActive: 'सक्रिय एवं कैलिब्रेटेड',
    instLastCalibrated: 'अंतिम कैलिब्रेशन:',
    instReagents: 'रीएजेंट स्थिति:'
  }
};

const DEFAULT_TEST_TEMPLATES: Record<string, {
  title: string;
  category: 'Lab Report' | 'X-Ray' | 'Referral';
  specimen: string;
  parameters: DiagnosticTestParameter[];
  defaultNotes: string;
}> = {
  cbc: {
    title: 'Complete Blood Count (CBC) Panel',
    category: 'Lab Report',
    specimen: 'Venous Whole Blood (EDTA)',
    defaultNotes: 'Normocytic normochromic red cells. Platelets adequate on smear. No immature blast cells.',
    parameters: [
      { name: 'Hemoglobin (Hb)', result: '12.8', unit: 'g/dL', refRange: '12.0 - 16.5', isAbnormal: false, status: 'Normal' },
      { name: 'Total Leukocyte Count (TLC)', result: '7,400', unit: '/cumm', refRange: '4,000 - 11,000', isAbnormal: false, status: 'Normal' },
      { name: 'Platelet Count', result: '2.10', unit: 'Lakhs/cumm', refRange: '1.50 - 4.50', isAbnormal: false, status: 'Normal' },
      { name: 'Neutrophils', result: '62', unit: '%', refRange: '40 - 75', isAbnormal: false, status: 'Normal' },
      { name: 'Lymphocytes', result: '30', unit: '%', refRange: '20 - 45', isAbnormal: false, status: 'Normal' },
      { name: 'Eosinophils', result: '04', unit: '%', refRange: '01 - 06', isAbnormal: false, status: 'Normal' },
      { name: 'ESR (Westergren)', result: '14', unit: 'mm/1st hr', refRange: '0 - 20', isAbnormal: false, status: 'Normal' }
    ]
  },
  malaria: {
    title: 'Peripheral Blood Smear for Malaria (MP / Rapid Ag)',
    category: 'Lab Report',
    specimen: 'Capillary / Venous Blood',
    defaultNotes: 'Thick and thin smears stained with Leishman stain. No ring forms or gametocytes of Plasmodium falciparum or vivax detected.',
    parameters: [
      { name: 'Plasmodium falciparum (Antigen)', result: 'Negative', unit: '', refRange: 'Negative', isAbnormal: false, status: 'Normal' },
      { name: 'Plasmodium vivax (Antigen)', result: 'Negative', unit: '', refRange: 'Negative', isAbnormal: false, status: 'Normal' },
      { name: 'Smear Examination for MP', result: 'Not Detected', unit: '', refRange: 'Not Detected', isAbnormal: false, status: 'Normal' },
      { name: 'Parasite Density Index', result: '0', unit: 'parasites/µL', refRange: '0', isAbnormal: false, status: 'Normal' }
    ]
  },
  tb_sputum: {
    title: 'Sputum TrueNat MTB / Acid Fast Bacilli (AFB)',
    category: 'Lab Report',
    specimen: 'Early Morning Deep Cough Sputum',
    defaultNotes: 'Chip-based Real Time Micro PCR (TrueNat). Mycobacterium tuberculosis NOT detected. Rifampicin resistance not applicable.',
    parameters: [
      { name: 'Acid Fast Bacilli (ZN Smear)', result: 'Negative (0 AFB / 100 fields)', unit: '', refRange: 'Negative', isAbnormal: false, status: 'Normal' },
      { name: 'TrueNat MTB DNA', result: 'Not Detected', unit: '', refRange: 'Not Detected', isAbnormal: false, status: 'Normal' },
      { name: 'Rifampicin Resistance Gene', result: 'Not Detected', unit: '', refRange: 'Not Detected', isAbnormal: false, status: 'Normal' }
    ]
  },
  glucose: {
    title: 'Blood Glucose Panel (Fasting & PP)',
    category: 'Lab Report',
    specimen: 'Fluoride Plasma',
    defaultNotes: 'Fasting blood glucose within normal diagnostic baseline.',
    parameters: [
      { name: 'Fasting Blood Sugar (FBS)', result: '92', unit: 'mg/dL', refRange: '70 - 100', isAbnormal: false, status: 'Normal' },
      { name: 'Post-Prandial Glucose (PPBS)', result: '134', unit: 'mg/dL', refRange: '70 - 140', isAbnormal: false, status: 'Normal' },
      { name: 'HbA1c (Glycated Hemoglobin)', result: '5.6', unit: '%', refRange: '4.0 - 5.6', isAbnormal: false, status: 'Normal' }
    ]
  },
  xray_chest: {
    title: 'Digital Chest X-Ray (PA View Scan)',
    category: 'X-Ray',
    specimen: 'Radiological Imaging Film (Digital)',
    defaultNotes: 'Bilateral lung parenchyma clear without active consolidation, cavitation, or pleural effusion. Cardiac size and mediastinal contours normal.',
    parameters: [
      { name: 'Lung Fields', result: 'Clear & Aerated', unit: '', refRange: 'Normal', isAbnormal: false, status: 'Normal' },
      { name: 'Cardiothoracic Ratio (CTR)', result: '0.45 (< 50%)', unit: '', refRange: '< 0.50', isAbnormal: false, status: 'Normal' },
      { name: 'Costophrenic Angles', result: 'Sharp & Normal', unit: '', refRange: 'Sharp', isAbnormal: false, status: 'Normal' },
      { name: 'Bony Cage & Soft Tissues', result: 'Intact', unit: '', refRange: 'Intact', isAbnormal: false, status: 'Normal' }
    ]
  },
  lft: {
    title: 'Liver Function Test (LFT Panel)',
    category: 'Lab Report',
    specimen: 'Serum (SST Gel Tube)',
    defaultNotes: 'Hepatic enzymes and total bilirubin within physiological limits.',
    parameters: [
      { name: 'Total Bilirubin', result: '0.8', unit: 'mg/dL', refRange: '0.2 - 1.2', isAbnormal: false, status: 'Normal' },
      { name: 'Direct Bilirubin', result: '0.2', unit: 'mg/dL', refRange: '0.0 - 0.3', isAbnormal: false, status: 'Normal' },
      { name: 'SGOT / AST', result: '24', unit: 'U/L', refRange: '10 - 40', isAbnormal: false, status: 'Normal' },
      { name: 'SGPT / ALT', result: '28', unit: 'U/L', refRange: '10 - 45', isAbnormal: false, status: 'Normal' },
      { name: 'Alkaline Phosphatase (ALP)', result: '98', unit: 'U/L', refRange: '40 - 130', isAbnormal: false, status: 'Normal' },
      { name: 'Total Protein', result: '7.2', unit: 'g/dL', refRange: '6.0 - 8.3', isAbnormal: false, status: 'Normal' },
      { name: 'Serum Albumin', result: '4.2', unit: 'g/dL', refRange: '3.5 - 5.2', isAbnormal: false, status: 'Normal' }
    ]
  },
  kft: {
    title: 'Kidney Function Test (KFT Profile)',
    category: 'Lab Report',
    specimen: 'Serum (SST Tube)',
    defaultNotes: 'Serum creatinine and blood urea indicate normal renal clearance.',
    parameters: [
      { name: 'Serum Creatinine', result: '0.9', unit: 'mg/dL', refRange: '0.7 - 1.3', isAbnormal: false, status: 'Normal' },
      { name: 'Blood Urea', result: '24', unit: 'mg/dL', refRange: '15 - 40', isAbnormal: false, status: 'Normal' },
      { name: 'Serum Uric Acid', result: '4.8', unit: 'mg/dL', refRange: '3.5 - 7.2', isAbnormal: false, status: 'Normal' },
      { name: 'Serum Electrolytes (Na+)', result: '139', unit: 'mEq/L', refRange: '135 - 145', isAbnormal: false, status: 'Normal' },
      { name: 'Serum Electrolytes (K+)', result: '4.2', unit: 'mEq/L', refRange: '3.5 - 5.0', isAbnormal: false, status: 'Normal' }
    ]
  },
  urine: {
    title: 'Urine Routine & Microscopic Examination (U/R/M)',
    category: 'Lab Report',
    specimen: 'Clean Catch Midstream Urine',
    defaultNotes: 'Urine pale yellow, clear. Microscopic examination reveals no pus cells or abnormal crystals.',
    parameters: [
      { name: 'Color / Appearance', result: 'Pale Yellow / Clear', unit: '', refRange: 'Clear', isAbnormal: false, status: 'Normal' },
      { name: 'Specific Gravity', result: '1.020', unit: '', refRange: '1.005 - 1.030', isAbnormal: false, status: 'Normal' },
      { name: 'pH', result: '6.0', unit: '', refRange: '4.6 - 8.0', isAbnormal: false, status: 'Normal' },
      { name: 'Protein (Albumin)', result: 'Nil', unit: '', refRange: 'Nil', isAbnormal: false, status: 'Normal' },
      { name: 'Sugar (Glucose)', result: 'Nil', unit: '', refRange: 'Nil', isAbnormal: false, status: 'Normal' },
      { name: 'Pus Cells', result: '1 - 2', unit: '/HPF', refRange: '0 - 4', isAbnormal: false, status: 'Normal' },
      { name: 'RBCs', result: 'Nil', unit: '/HPF', refRange: 'Nil', isAbnormal: false, status: 'Normal' }
    ]
  }
};

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({
  user,
  networkQuality,
  lang,
  onSelectLang,
  onBack
}) => {
  const t = DASH_I18N[lang] || DASH_I18N.English;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState<LabTab>('dashboard');
  const [tabHistory, setTabHistory] = useState<LabTab[]>(['dashboard']);

  // Pathology Data State
  const [documents, setDocuments] = useState<DiagnosticDocument[]>(() => storage.getDocuments());
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DiagnosticDocument | null>(null);
  const [labTests, setLabTests] = useState<LabTestItem[]>(() => storage.getLabTests());
  const [labOrders, setLabOrders] = useState<LabTestOrder[]>(() => storage.getLabOrders());
  const [labSamples, setLabSamples] = useState<LabSample[]>(() => storage.getLabSamples());

  // Filter States
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  // Report Submission / Verification Form State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('cbc');
  const [patientId, setPatientId] = useState<string>('RHB-OD-KLH-0941');
  const [patientName, setPatientName] = useState<string>('Keshab Rout');
  const [patientAge, setPatientAge] = useState<string>('45');
  const [patientGender, setPatientGender] = useState<string>('Male');
  const [village, setVillage] = useState<string>('Kalahandi, Odisha');
  const [reportTitle, setReportTitle] = useState<string>(DEFAULT_TEST_TEMPLATES.cbc.title);
  const [category, setCategory] = useState<'Lab Report' | 'X-Ray' | 'Referral'>('Lab Report');
  const [barcode, setBarcode] = useState<string>(`KLH-PATH-2026-0${Math.floor(Math.random() * 800 + 100)}`);
  const [specimen, setSpecimen] = useState<string>(DEFAULT_TEST_TEMPLATES.cbc.specimen);
  const [collectionDateTime, setCollectionDateTime] = useState<string>(
    new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })
  );
  const [scannedFileUrl, setScannedFileUrl] = useState<string>('');
  const [scannedFileName, setScannedFileName] = useState<string>('');
  const [parameters, setParameters] = useState<DiagnosticTestParameter[]>(DEFAULT_TEST_TEMPLATES.cbc.parameters);
  const [clinicalNotes, setClinicalNotes] = useState<string>(DEFAULT_TEST_TEMPLATES.cbc.defaultNotes);
  const [criticalAlert, setCriticalAlert] = useState<boolean>(false);
  const [syncAbha, setSyncAbha] = useState<boolean>(true);
  const [technicianName, setTechnicianName] = useState<string>('Bipin Bihari Das, Sr. MLT');
  const [pathologistName, setPathologistName] = useState<string>('Dr. Saroj K. Sahu, MD (Pathology)');
  const [associatedOrderId, setAssociatedOrderId] = useState<string>('ord-01');

  // Multi-stage verification status
  const [verificationStage, setVerificationStage] = useState<'Draft' | 'Under Review' | 'Verified' | 'Released' | 'Corrected'>('Verified');
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [reportVersion, setReportVersion] = useState<number>(1);

  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<DiagnosticDocument | null>(null);

  // Registry Search & Filters
  const [registrySearch, setRegistrySearch] = useState<string>('');
  const [registryCategoryFilter, setRegistryCategoryFilter] = useState<string>('all');
  const [registryStatusFilter, setRegistryStatusFilter] = useState<string>('all');

  // Vitals State
  const [vitalsPatientId, setVitalsPatientId] = useState<string>('RHB-OD-KLH-0941');
  const [vitalsPatientName, setVitalsPatientName] = useState<string>('Keshab Rout');
  const [vTemp, setVTemp] = useState<string>('98.6');
  const [vBpSys, setVBpSys] = useState<string>('120');
  const [vBpDia, setVBpDia] = useState<string>('80');
  const [vPulse, setVPulse] = useState<string>('76');
  const [vSpO2, setVSpO2] = useState<string>('99');
  const [vGlucose, setVGlucose] = useState<string>('102');
  const [vitalsToast, setVitalsToast] = useState<string>('');

  const navigateToTab = (tab: LabTab) => {
    setTabHistory(prev => (prev[prev.length - 1] === tab ? prev : [...prev, tab]));
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const next = [...tabHistory];
      next.pop();
      const prev = next[next.length - 1];
      setTabHistory(next);
      setActiveTab(prev);
    } else if (onBack) {
      onBack();
    } else {
      setActiveTab('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const refreshAll = () => {
    setDocuments(storage.getDocuments());
    setLabTests(storage.getLabTests());
    setLabOrders(storage.getLabOrders());
    setLabSamples(storage.getLabSamples());
  };

  useEffect(() => {
    refreshAll();
  }, [activeTab]);

  // Handle template change
  const handleTemplateChange = (key: string) => {
    setSelectedTemplateKey(key);
    const tmpl = DEFAULT_TEST_TEMPLATES[key];
    if (tmpl) {
      setReportTitle(tmpl.title);
      setCategory(tmpl.category);
      setSpecimen(tmpl.specimen);
      setParameters([...tmpl.parameters]);
      setClinicalNotes(tmpl.defaultNotes);
      setBarcode(`KLH-PATH-2026-0${Math.floor(Math.random() * 800 + 100)}`);
      setSubmissionSuccess(null);
    }
  };

  // Pre-fill from order
  const handlePreFillFromOrder = (ord: LabTestOrder) => {
    setAssociatedOrderId(ord.id);
    setPatientId(ord.patientId);
    setPatientName(ord.patientName);
    setPatientAge(ord.patientAge.toString());
    setPatientGender(ord.patientGender);
    setVillage(ord.patientVillage || 'Kalahandi, Odisha');
    setReportTitle(ord.testName);

    // Find template matching test
    const matchedKey = Object.keys(DEFAULT_TEST_TEMPLATES).find(k =>
      ord.testName.toLowerCase().includes(k) || DEFAULT_TEST_TEMPLATES[k].title.toLowerCase().includes(ord.testName.toLowerCase())
    ) || 'cbc';

    handleTemplateChange(matchedKey);
    navigateToTab('submit');
  };

  // Parameter table helpers
  const handleParamChange = (index: number, field: keyof DiagnosticTestParameter, val: any) => {
    const updated = [...parameters];
    updated[index] = { ...updated[index], [field]: val };

    // Auto-compute status if numerical
    if (field === 'result' && updated[index].refRange && updated[index].refRange.includes('-')) {
      const parts = updated[index].refRange.split('-').map(s => parseFloat(s.trim()));
      const numVal = parseFloat(val);
      if (!isNaN(numVal) && parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        if (numVal < parts[0]) {
          updated[index].status = 'Low';
          updated[index].isAbnormal = true;
        } else if (numVal > parts[1]) {
          updated[index].status = 'High';
          updated[index].isAbnormal = true;
        } else {
          updated[index].status = 'Normal';
          updated[index].isAbnormal = false;
        }
      }
    }

    setParameters(updated);
  };

  const handleAddParamRow = () => {
    setParameters([
      ...parameters,
      { name: 'New Parameter', result: '', unit: '', refRange: 'Normal', isAbnormal: false, status: 'Normal' }
    ]);
  };

  const handleRemoveParamRow = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  // Generate Sample Scan simulation canvas
  const handleGenerateSampleScan = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 680;
    canvas.height = 860;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fdfdfb';
      ctx.fillRect(0, 0, 680, 860);

      // Hospital Header
      ctx.fillStyle = '#0f3a69';
      ctx.fillRect(20, 20, 640, 75);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('DISTRICT HEADQUARTERS HOSPITAL (DHH) BHAWANIPATNA', 40, 50);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#99ccff';
      ctx.fillText('Central Pathology & Diagnostic Wing • Kalahandi, Odisha - 766001 • NABL Certified', 40, 72);

      // Barcode simulation
      ctx.fillStyle = '#1e293b';
      for (let i = 0; i < 48; i++) {
        const w = (i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1);
        ctx.fillRect(520 + (i * 2.6), 32, w, 24);
      }
      ctx.font = '10px monospace';
      ctx.fillText(barcode, 530, 68);

      // Patient metadata box
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(20, 110, 640, 85);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(20, 110, 640, 85);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(`PATIENT: ${patientName.toUpperCase()} (${patientId})`, 36, 134);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = '#475569';
      ctx.fillText(`Age/Gender: ${patientAge} Y / ${patientGender}   •   Location: ${village}`, 36, 155);
      ctx.fillText(`Sample Type: ${specimen}   •   Collection: ${collectionDateTime}`, 36, 175);

      // Table Header
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(20, 210, 640, 30);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('INVESTIGATION PARAMETER', 36, 230);
      ctx.fillText('RESULT', 320, 230);
      ctx.fillText('UNIT', 420, 230);
      ctx.fillText('BIOLOGICAL REF RANGE', 500, 230);

      // Table Rows
      ctx.font = '11px sans-serif';
      parameters.slice(0, 12).forEach((p, idx) => {
        const y = 265 + (idx * 26);
        ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        ctx.fillRect(20, y - 18, 640, 26);

        ctx.fillStyle = p.isAbnormal ? '#b42318' : '#1e293b';
        ctx.fillText(p.name, 36, y);
        ctx.font = p.isAbnormal ? 'bold 11px sans-serif' : '11px sans-serif';
        ctx.fillText(p.result + (p.status === 'High' ? ' 🔺 (HIGH)' : p.status === 'Low' ? ' 🔻 (LOW)' : ' ✓'), 320, y);
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(p.unit || '', 420, y);
        ctx.fillText(p.refRange || '', 500, y);
      });

      // Clinical notes
      const notesY = 265 + (Math.min(parameters.length, 12) * 26) + 20;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(20, notesY, 640, 60);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(20, notesY, 640, 60);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('PATHOLOGIST OBSERVATION / CLINICAL REMARKS:', 36, notesY + 22);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(clinicalNotes.slice(0, 110), 36, notesY + 42);

      // Sign-off
      const stampY = 740;
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, stampY, 160, 65);
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('NABL / ABDM SEAL', 55, stampY + 25);
      ctx.fillText('DHH CENTRAL LAB', 55, stampY + 42);
      ctx.font = '9px monospace';
      ctx.fillText('AUTHENTICATED REPORT', 50, stampY + 56);

      ctx.fillStyle = '#1e293b';
      ctx.font = '11px sans-serif';
      ctx.fillText('Lab Technologist:', 260, stampY + 30);
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(technicianName, 260, stampY + 48);

      ctx.font = '11px sans-serif';
      ctx.fillText('Authorized Verifier:', 440, stampY + 30);
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(pathologistName, 440, stampY + 48);

      const generatedUrl = canvas.toDataURL('image/png');
      setScannedFileUrl(generatedUrl);
      setScannedFileName(`PHYSICAL_SCAN_${barcode}.png`);
    }
  };

  // Submit and Release Report Handler
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newDoc: DiagnosticDocument = {
        id: `doc-${Date.now()}`,
        title: reportTitle,
        category,
        date: new Date().toLocaleDateString('en-GB'),
        provider: 'DHH Bhawanipatna Central Pathology Lab',
        patientId,
        patientName,
        status: criticalAlert ? 'Critical Flag' : 'Ready',
        fileUrl: scannedFileUrl || undefined,
        sampleType: specimen,
        labName: 'DHH Bhawanipatna Central Pathology Lab',
        technicianName,
        doctorInCharge: pathologistName,
        criticalAlert,
        notes: clinicalNotes,
        parameters,
        syncedAbha: syncAbha,
        verificationStatus: 'Released',
        authorizedVerifier: pathologistName,
        version: reportVersion,
        orderId: associatedOrderId,
        sampleBarcode: barcode,
        releasedAt: new Date().toISOString()
      };

      // Call storage release method which updates order status, saves doc, records audit, and syncs to patient health record!
      const releasedDoc = storage.releaseLabReport(newDoc);

      refreshAll();
      setIsSubmitting(false);
      setSubmissionSuccess(releasedDoc);
    }, 600);
  };

  // Vitals save
  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const vitalsObj: PhysiologicalVitals = {
      temperatureF: parseFloat(vTemp) || 98.6,
      bpSystolic: parseInt(vBpSys) || 120,
      bpDiastolic: parseInt(vBpDia) || 80,
      pulseBpm: parseInt(vPulse) || 76,
      spO2Percent: parseInt(vSpO2) || 99,
      enteredBy: 'DHH Pathology Intake Station',
      recordedAt: `Today, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    };

    storage.saveVitals(vitalsObj);
    storage.addNotification({
      title: 'Physical Vitals Updated',
      body: `Pre-consultation physical vitals for ${vitalsPatientName} recorded at DHH Diagnostic Center.`,
      type: 'doctor'
    });
    storage.addAuditLog(`Physical vitals recorded for ${vitalsPatientName}`, technicianName);
    setVitalsToast(t.vitalsSuccess);
    setTimeout(() => setVitalsToast(''), 3500);
  };

  // Filtered orders
  const filteredOrders = labOrders.filter(o => {
    const matchesStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const matchesSearch = !orderSearchQuery ||
      o.patientName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.testName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate KPI metrics
  const pendingRequestsCount = labOrders.filter(o => o.status === 'Requested').length;
  const samplesAwaitingCollectionCount = labSamples.filter(s => s.status === 'Awaiting Collection').length;
  const samplesReceivedCount = labSamples.filter(s => s.status === 'Received').length;
  const testsInProgressCount = labOrders.filter(o => o.status === 'Processing').length;
  const reportsAwaitingVerificationCount = labOrders.filter(o => o.status === 'Report Verified' || o.status === 'Processing').length;
  const completedReportsCount = documents.filter(d => d.verificationStatus === 'Released' || d.status === 'Ready').length;
  const urgentReportsCount = labOrders.filter(o => o.urgency === 'Urgent' || o.urgency === 'Emergency').length;
  const rejectedSamplesCount = labSamples.filter(s => s.status === 'Rejected').length;

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Top Header & Navigation Bar */}
      <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <button
          type="button"
          onClick={handleGoBack}
          className="btn btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 14px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
          aria-label="Navigate back"
        >
          <ArrowLeft size={16} />
          <span>{lang === 'ଓଡ଼ିଆ' ? 'ପଛକୁ ଫେରନ୍ତୁ' : lang === 'हिन्दी' ? 'पीछे जाएं' : 'Back / Dashboard'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onSelectLang && (
            <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', border: '1px solid #cbd5e1' }}>
              {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onSelectLang(l)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '11px',
                    fontWeight: lang === l ? 700 : 500,
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: lang === l ? '#7c3aed' : 'transparent',
                    color: lang === l ? '#ffffff' : '#475569'
                  }}
                >
                  {l === 'English' ? 'EN' : l === 'ଓଡ଼ିଆ' ? 'ଓଡ଼ିଆ' : 'हिन्दी'}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            className="btn btn-secondary"
            onClick={refreshAll}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <RefreshCw size={13} /> Refresh Hub
          </button>
        </div>
      </div>

      {/* Lab Center Header Card */}
      <div className="card" style={{ padding: '20px', borderRadius: '16px', marginBottom: '16px', background: 'linear-gradient(135deg, #f5f3ff, #faf5ff)', border: '1px solid #ddd6fe' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: '#7c3aed',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px'
              }}
            >
              <FlaskConical size={28} />
            </div>
            <div>
              <span className="badge badge-purple" style={{ background: '#ede9fe', color: '#6d28d9', fontWeight: 800 }}>
                {t.portalBadge}
              </span>
              <h1 style={{ margin: '4px 0 2px', fontSize: '20px', color: '#0f172a', fontWeight: 800 }}>
                {user?.name || t.centerTitle}
              </h1>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                {user?.location || t.centerSubtitle} • Reg: {user?.registrationNumber || 'NABL-MED-KLH-0941'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, border: '1px solid #a7f3d0' }}>
              NABL ACCREDITED
            </span>
            <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1e40af', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, border: '1px solid #bfdbfe' }}>
              ABDM MILESTONE 3 SYNC
            </span>
            <span style={{ fontSize: '11px', background: '#f8fafc', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontWeight: 700, border: '1px solid #cbd5e1' }}>
              NODE: DHH BHAWANIPATNA
            </span>
          </div>
        </div>
      </div>

      {/* Universal Diagnostic Disclaimer */}
      <div
        style={{
          background: '#fffbeb',
          border: '1.5px solid #fde68a',
          color: '#92400e',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <AlertTriangle size={16} style={{ flexShrink: 0 }} />
        <span>{t.disclaimerNotice}</span>
      </div>

      {/* Navigation Tabs */}
      <nav className="tabs-scroll-wrap" aria-label="Pathology Navigation" style={{ marginBottom: '20px' }}>
        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigateToTab('dashboard')}
        >
          📊 {t.tabDashboard}
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => navigateToTab('orders')}
        >
          🧪 {t.tabOrders} ({labOrders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'catalogue' ? 'active' : ''}`}
          onClick={() => navigateToTab('catalogue')}
        >
          📖 {t.tabCatalogue} ({labTests.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
          onClick={() => navigateToTab('submit')}
        >
          ✍️ {t.tabSubmit}
        </button>
        <button
          className={`tab-btn ${activeTab === 'registry' ? 'active' : ''}`}
          onClick={() => navigateToTab('registry')}
        >
          📁 {t.tabRegistry} ({documents.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => navigateToTab('vitals')}
        >
          💓 {t.tabVitals}
        </button>
        <button
          className={`tab-btn ${activeTab === 'instruments' ? 'active' : ''}`}
          onClick={() => navigateToTab('instruments')}
        >
          ⚙️ {t.tabInstruments}
        </button>
      </nav>

      {/* ======================================================== */}
      {/* TAB 1: LABORATORY DASHBOARD (Section 14) */}
      {/* ======================================================== */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', color: '#0f172a', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800 }}>
              LABORATORY OPERATIONAL QUEUE & SAMPLE TELEMETRY
            </h3>

            <div className="kpis-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              <div className="kpi-card" style={{ borderLeft: '4px solid #0284c7' }}>
                <span className="kpi-label">Pending Test Requests</span>
                <div className="kpi-val" style={{ color: '#0284c7' }}>{pendingRequestsCount}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Awaiting clinic acceptance</span>
              </div>

              <div className="kpi-card" style={{ borderLeft: '4px solid #d97706' }}>
                <span className="kpi-label">Samples Awaiting Collection</span>
                <div className="kpi-val" style={{ color: '#d97706' }}>{samplesAwaitingCollectionCount}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Phlebotomy station queue</span>
              </div>

              <div className="kpi-card" style={{ borderLeft: '4px solid #059669' }}>
                <span className="kpi-label">Samples Received</span>
                <div className="kpi-val" style={{ color: '#059669' }}>{samplesReceivedCount}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Barcoded & logged in LIMS</span>
              </div>

              <div className="kpi-card" style={{ borderLeft: '4px solid #7c3aed' }}>
                <span className="kpi-label">Tests in Progress</span>
                <div className="kpi-val" style={{ color: '#7c3aed' }}>{testsInProgressCount}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Automated analyzer runs</span>
              </div>

              <div className="kpi-card" style={{ borderLeft: '4px solid #0891b2' }}>
                <span className="kpi-label">Reports Awaiting Verification</span>
                <div className="kpi-val" style={{ color: '#0891b2' }}>{reportsAwaitingVerificationCount}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Pathologist review stage</span>
              </div>

              <div className="kpi-card" style={{ borderLeft: '4px solid #16a34a' }}>
                <span className="kpi-label">Completed & Released Reports</span>
                <div className="kpi-val" style={{ color: '#16a34a' }}>{completedReportsCount}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Synced to patient ABHA</span>
              </div>

              <div className="kpi-card" style={{ borderLeft: '4px solid #dc2626' }}>
                <span className="kpi-label">Urgent / Emergency Tests</span>
                <div className="kpi-val" style={{ color: '#dc2626' }}>{urgentReportsCount}</div>
                <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 700 }}>Priority TAT &lt; 1 hour</span>
              </div>

              <div className="kpi-card" style={{ borderLeft: '4px solid #64748b' }}>
                <span className="kpi-label">Rejected Samples</span>
                <div className="kpi-val" style={{ color: '#64748b' }}>{rejectedSamplesCount}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Recollection required</span>
              </div>
            </div>
          </div>

          {/* Quick Workflow Jump Buttons */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '12px', color: '#0f172a' }}>
              Diagnostic Center Operations
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigateToTab('orders')}
                style={{ justifyContent: 'flex-start', padding: '12px', borderRadius: '10px' }}
              >
                <Layers size={16} style={{ color: '#0284c7' }} />
                <span>Process Sample Collection & Tracking</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigateToTab('submit')}
                style={{ justifyContent: 'flex-start', padding: '12px', borderRadius: '10px' }}
              >
                <FileCheck size={16} style={{ color: '#059669' }} />
                <span>Digitize Scan & Authorize Report</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigateToTab('catalogue')}
                style={{ justifyContent: 'flex-start', padding: '12px', borderRadius: '10px' }}
              >
                <BookOpen size={16} style={{ color: '#7c3aed' }} />
                <span>View Standard Diagnostic Catalogue</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigateToTab('instruments')}
                style={{ justifyContent: 'flex-start', padding: '12px', borderRadius: '10px' }}
              >
                <Sliders size={16} style={{ color: '#d97706' }} />
                <span>Analyzer Telemetry & QC Calibration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: TEST REQUESTS & SAMPLE WORKFLOW (Sections 16 & 17) */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '18px' }}>Test Requests & Specimen Sample Workflow</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                End-to-end tracking: Requested ➔ Sample Collected ➔ Sample Received ➔ Processing ➔ Released.
              </p>
            </div>
            <span className="badge badge-purple">
              {filteredOrders.length} Test Orders
            </span>
          </div>

          {/* Search and Status Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
            <div style={{ flex: '1 1 220px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search orders by patient, test name, or order ID..."
                value={orderSearchQuery}
                onChange={e => setOrderSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['ALL', 'Requested', 'Accepted', 'Sample Collected', 'Sample Received', 'Processing', 'Released'] as string[]).map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setOrderStatusFilter(st)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    border: orderStatusFilter === st ? '1.5px solid #7c3aed' : '1px solid #cbd5e1',
                    background: orderStatusFilter === st ? '#7c3aed' : '#ffffff',
                    color: orderStatusFilter === st ? '#ffffff' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="data-list">
            {filteredOrders.map(ord => {
              const sampleMatch = labSamples.find(s => s.orderId === ord.id);

              return (
                <div key={ord.id} className="data-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '16px', color: '#0f172a' }}>{ord.testName}</strong>
                        <span className="badge badge-purple">{ord.category}</span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: ord.urgency === 'Emergency' ? '#fee2e2' : ord.urgency === 'Urgent' ? '#fef3c7' : '#e0f2fe',
                            color: ord.urgency === 'Emergency' ? '#991b1b' : ord.urgency === 'Urgent' ? '#92400e' : '#0284c7',
                            border: '1px solid currentColor'
                          }}
                        >
                          {ord.urgency.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>
                        Patient: <strong>{ord.patientName}</strong> ({ord.patientAge}y • {ord.patientGender}) • ID: <code>{ord.patientId}</code>
                        {ord.patientVillage && <span> • Village: {ord.patientVillage}</span>}
                      </div>

                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                        Prescribing Clinician: <strong>{ord.doctorName || 'Dr. Ananya Mishra'}</strong> • Order Date: <strong>{ord.orderDate}</strong>
                      </div>

                      {sampleMatch && (
                        <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '4px', background: '#f0f9ff', padding: '6px 10px', borderRadius: '6px' }}>
                          Specimen Barcode: <strong>{sampleMatch.sampleBarcode}</strong> • Sample Type: <strong>{sampleMatch.sampleType}</strong> • Status: <strong>{sampleMatch.status}</strong>
                          {sampleMatch.collectedAt && <span> • Collected: {sampleMatch.collectedAt}</span>}
                          {sampleMatch.receivedAt && <span> • Received: {sampleMatch.receivedAt}</span>}
                          {sampleMatch.rejectionReason && <span style={{ color: '#b91c1c' }}> • Rejected: {sampleMatch.rejectionReason}</span>}
                        </div>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: ord.status === 'Released' ? '#dcfce7' : ord.status === 'Processing' ? '#fef3c7' : '#ede9fe',
                          color: ord.status === 'Released' ? '#166534' : ord.status === 'Processing' ? '#92400e' : '#6d28d9',
                          border: '1px solid currentColor',
                          display: 'inline-block'
                        }}
                      >
                        Status: {ord.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Workflow Progression Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Workflow Action:</span>

                      {ord.status === 'Requested' && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            storage.updateLabOrderStatus(ord.id, 'Accepted');
                            refreshAll();
                          }}
                          style={{ fontSize: '11px', padding: '4px 8px', color: '#047857' }}
                        >
                          <Check size={12} /> Accept Request
                        </button>
                      )}

                      {(ord.status === 'Accepted' || ord.status === 'Requested') && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            storage.updateLabOrderStatus(ord.id, 'Sample Collected');
                            refreshAll();
                          }}
                          style={{ fontSize: '11px', padding: '4px 8px', color: '#0284c7' }}
                        >
                          Mark Sample Collected
                        </button>
                      )}

                      {ord.status === 'Sample Collected' && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            storage.updateLabOrderStatus(ord.id, 'Sample Received');
                            refreshAll();
                          }}
                          style={{ fontSize: '11px', padding: '4px 8px', color: '#7c3aed' }}
                        >
                          Confirm Sample Received
                        </button>
                      )}

                      {(ord.status === 'Sample Received' || ord.status === 'Accepted') && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            storage.updateLabOrderStatus(ord.id, 'Processing');
                            refreshAll();
                          }}
                          style={{ fontSize: '11px', padding: '4px 8px', color: '#d97706' }}
                        >
                          Start Analyzer Processing
                        </button>
                      )}

                      {/* Log Sample Rejection */}
                      {sampleMatch && sampleMatch.status !== 'Rejected' && ord.status !== 'Released' && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            const reason = prompt('Enter sample rejection reason (e.g. Hemolysis, Insufficient volume, Clotted):', 'Hemolyzed specimen');
                            if (reason) {
                              storage.updateLabSampleStatus(sampleMatch.id, 'Rejected', reason);
                              refreshAll();
                            }
                          }}
                          style={{ fontSize: '11px', padding: '4px 8px', color: '#b91c1c' }}
                        >
                          Reject Sample
                        </button>
                      )}
                    </div>

                    <div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handlePreFillFromOrder(ord)}
                        style={{ fontSize: '12px', padding: '5px 12px', background: '#7c3aed', borderColor: '#7c3aed' }}
                      >
                        Enter Results & Verify Report ➔
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: TEST CATALOGUE MANAGEMENT (Section 15) */}
      {/* ======================================================== */}
      {activeTab === 'catalogue' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '18px' }}>Standard Diagnostic Investigation Catalogue</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                Validated tests supported at DHH Kalahandi with biological reference ranges, sample types, and turnaround times.
              </p>
            </div>
            <span className="badge badge-purple">{labTests.length} Validated Tests</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Investigation Name</th>
                  <th style={{ padding: '10px' }}>Category</th>
                  <th style={{ padding: '10px' }}>Sample Type</th>
                  <th style={{ padding: '10px' }}>Preparation / Fasting</th>
                  <th style={{ padding: '10px' }}>Turnaround Time</th>
                  <th style={{ padding: '10px' }}>Fee / Scheme</th>
                  <th style={{ padding: '10px' }}>Validated Reference Ranges</th>
                </tr>
              </thead>
              <tbody>
                {labTests.map(tst => (
                  <tr key={tst.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px' }}>
                      <strong style={{ color: '#0f172a' }}>{tst.name}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{tst.description}</div>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span className="badge badge-blue">{tst.category}</span>
                    </td>
                    <td style={{ padding: '10px', color: '#334155' }}>{tst.sampleType}</td>
                    <td style={{ padding: '10px', color: '#475569' }}>{tst.preparation}</td>
                    <td style={{ padding: '10px', fontWeight: 600, color: '#0284c7' }}>{tst.turnaroundTime}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        {tst.priceRupees === 0 ? 'FREE (Biju Swasthya)' : `₹ ${tst.priceRupees}`}
                      </span>
                    </td>
                    <td style={{ padding: '10px', fontSize: '11px', color: '#475569' }}>
                      {tst.referenceRanges.map((r, ri) => (
                        <div key={ri}>
                          <strong>{r.parameter}:</strong> {r.range} {r.unit}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: LAB REPORT ENTRY & MULTI-STAGE VERIFICATION (Sections 18 & 19) */}
      {/* ======================================================== */}
      {activeTab === 'submit' && (
        <div>
          {submissionSuccess && (
            <div
              className="card"
              style={{
                marginBottom: '20px',
                background: '#f0fdf4',
                borderColor: '#86efac',
                padding: '24px',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#166534', fontSize: '18px' }}>
                {t.successTitle}
              </h3>
              <p style={{ margin: '0 auto 16px', maxWidth: '580px', fontSize: '13px', color: '#14532d' }}>
                {t.successDesc}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSelectedDocForViewer(submissionSuccess)}
                  style={{ fontSize: '13px' }}
                >
                  <Eye size={15} /> {t.btnViewDoc}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setBarcode(`KLH-PATH-2026-0${Math.floor(Math.random() * 800 + 100)}`);
                  }}
                  style={{ fontSize: '13px' }}
                >
                  {t.btnSubmitAnother}
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitReport}>
            {/* 1. Patient Metadata Card */}
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{t.patientSectionTitle}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{t.selectPreConfig}</span>
                  <select
                    onChange={e => {
                      const selOrd = labOrders.find(o => o.patientId === e.target.value);
                      if (selOrd) handlePreFillFromOrder(selOrd);
                    }}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#ffffff' }}
                  >
                    <option value="RHB-OD-KLH-0941">Keshab Rout (RHB-OD-KLH-0941)</option>
                    <option value="RHB-OD-KLH-1802">Bimal Majhi (RHB-OD-KLH-1802)</option>
                    <option value="RHB-OD-KLH-2109">Rupa Sabar (RHB-OD-KLH-2109)</option>
                    <option value="RHB-OD-KLH-0744">Saraswati Naik (RHB-OD-KLH-0744)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label className="form-label">{t.patientIdLabel}</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={e => setPatientId(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label className="form-label">{t.patientNameLabel}</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={e => setPatientName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label className="form-label">{t.ageGenderLabel}</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="number"
                      value={patientAge}
                      onChange={e => setPatientAge(e.target.value)}
                      style={{ width: '70px', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                    <select
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value)}
                      style={{ flex: 1, padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff' }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">{t.villageLabel}</label>
                  <input
                    type="text"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Investigation Details Card */}
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>{t.testSectionTitle}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Select Template:</span>
                  <select
                    value={selectedTemplateKey}
                    onChange={e => handleTemplateChange(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', background: '#ffffff' }}
                  >
                    <option value="cbc">Complete Blood Count (CBC Panel)</option>
                    <option value="malaria">Peripheral Smear for Malaria (MP)</option>
                    <option value="tb_sputum">Sputum TrueNat MTB / AFB</option>
                    <option value="glucose">Blood Glucose (F & PP)</option>
                    <option value="lft">Liver Function Test (LFT Panel)</option>
                    <option value="kft">Kidney Function Test (KFT Profile)</option>
                    <option value="xray_chest">Digital Chest X-Ray (PA View)</option>
                    <option value="urine">Urine Routine & Microscopic (U/R/M)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label className="form-label">{t.reportTitleLabel}</label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={e => setReportTitle(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label className="form-label">{t.testCategoryLabel}</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff' }}
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="X-Ray">Radiology / X-Ray</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">{t.barcodeLabel}</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={e => setBarcode(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}
                  />
                </div>
                <div>
                  <label className="form-label">{t.specimenLabel}</label>
                  <input
                    type="text"
                    value={specimen}
                    onChange={e => setSpecimen(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Physical Scan Generation / Upload Card */}
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ margin: '0 0 12px', fontSize: '16px', color: '#0f172a' }}>{t.uploadSectionTitle}</h3>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGenerateSampleScan}
                  style={{ fontSize: '13px' }}
                >
                  <FileText size={15} /> {t.btnSimulateScan}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ fontSize: '13px' }}
                >
                  <Upload size={15} /> Browse Local File (PNG / PDF)
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setScannedFileName(file.name);
                      const reader = new FileReader();
                      reader.onload = () => setScannedFileUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </div>

              {scannedFileUrl && (
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={scannedFileUrl}
                      alt="Scan thumbnail"
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0f172a' }}>{scannedFileName || 'Generated Lab Scan'}</strong>
                      <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>✓ Attached to diagnostic document</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setScannedFileUrl('');
                      setScannedFileName('');
                    }}
                    style={{ background: 'none', border: 'none', color: '#b91c1c', cursor: 'pointer', fontSize: '12px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Clinical Parameter Entry Table (Non-color-only indicators: LOW 🔻, NORMAL ✓, HIGH 🔺) */}
            <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: '0 0 2px', fontSize: '16px', color: '#0f172a' }}>{t.parametersSectionTitle}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{t.paramHelp}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddParamRow}
                  style={{ fontSize: '12px', padding: '5px 12px' }}
                >
                  <Plus size={14} /> {t.btnAddParam}
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px' }}>{t.thParamName}</th>
                      <th style={{ padding: '8px 10px' }}>{t.thResult}</th>
                      <th style={{ padding: '8px 10px' }}>{t.thUnit}</th>
                      <th style={{ padding: '8px 10px' }}>{t.thRefRange}</th>
                      <th style={{ padding: '8px 10px' }}>{t.thStatus}</th>
                      <th style={{ padding: '8px 10px', width: '50px' }}>{t.thAction}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parameters.map((p, idx) => {
                      const isHigh = p.status === 'High';
                      const isLow = p.status === 'Low';

                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '6px 8px' }}>
                            <input
                              type="text"
                              value={p.name}
                              onChange={e => handleParamChange(idx, 'name', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            <input
                              type="text"
                              value={p.result}
                              onChange={e => handleParamChange(idx, 'result', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: isHigh || isLow ? '1.5px solid #dc2626' : '1px solid #cbd5e1',
                                fontWeight: 700
                              }}
                            />
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            <input
                              type="text"
                              value={p.unit}
                              onChange={e => handleParamChange(idx, 'unit', e.target.value)}
                              style={{ width: '90px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            <input
                              type="text"
                              value={p.refRange}
                              onChange={e => handleParamChange(idx, 'refRange', e.target.value)}
                              style={{ width: '120px', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                            />
                          </td>
                          <td style={{ padding: '6px 8px' }}>
                            <select
                              value={p.status || (p.isAbnormal ? 'High' : 'Normal')}
                              onChange={e => {
                                const st = e.target.value as any;
                                handleParamChange(idx, 'status', st);
                                handleParamChange(idx, 'isAbnormal', st !== 'Normal');
                              }}
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                fontSize: '12px',
                                fontWeight: 700,
                                background: isHigh ? '#fee2e2' : isLow ? '#fef3c7' : '#ecfdf5',
                                color: isHigh ? '#991b1b' : isLow ? '#92400e' : '#047857'
                              }}
                            >
                              <option value="Normal">✓ NORMAL</option>
                              <option value="High">🔺 HIGH</option>
                              <option value="Low">🔻 LOW</option>
                            </select>
                          </td>
                          <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveParamRow(idx)}
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Pathologist Sign-off & Verification Workflow Card */}
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#0f172a' }}>{t.notesSectionTitle}</h3>

              <div style={{ marginBottom: '14px' }}>
                <label className="form-label">{t.clinicalNotesLabel}</label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label className="form-label">{t.technicianLabel}</label>
                  <input
                    type="text"
                    value={technicianName}
                    onChange={e => setTechnicianName(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label className="form-label">{t.pathologistLabel}</label>
                  <input
                    type="text"
                    value={pathologistName}
                    onChange={e => setPathologistName(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label className="form-label">Verification Stage</label>
                  <select
                    value={verificationStage}
                    onChange={e => setVerificationStage(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontWeight: 700 }}
                  >
                    <option value="Draft">Draft (Preliminary Entry)</option>
                    <option value="Under Review">Under Review (Senior MLT Checked)</option>
                    <option value="Verified">Verified (Ready for Release)</option>
                    <option value="Released">Released (Available to Doctor & Patient)</option>
                    <option value="Corrected">Corrected (Re-issued with Version History)</option>
                  </select>
                </div>
              </div>

              {verificationStage === 'Corrected' && (
                <div style={{ marginBottom: '14px', background: '#fffbeb', padding: '12px', borderRadius: '8px', border: '1px solid #fde68a' }}>
                  <label className="form-label" style={{ color: '#92400e' }}>Correction Reason (Mandatory Audit Trail):</label>
                  <input
                    type="text"
                    placeholder="e.g. Revised platelet count upon manual smear re-check."
                    value={correctionReason}
                    onChange={e => setCorrectionReason(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#b91c1c', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={criticalAlert}
                    onChange={e => setCriticalAlert(e.target.checked)}
                  />
                  <span>{t.criticalAlertLabel}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: '#047857', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={syncAbha}
                    onChange={e => setSyncAbha(e.target.checked)}
                  />
                  <span>{t.syncAbhaLabel}</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 800, background: '#7c3aed', borderColor: '#7c3aed' }}
                >
                  <FileCheck size={16} />
                  {isSubmitting ? t.submitting : t.btnSubmitReport}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: REPORTS REGISTRY & ABDM SYNC */}
      {/* ======================================================== */}
      {activeTab === 'registry' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: '18px' }}>Diagnostic Reports Archive & ABHA Sync</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                Verified laboratory investigation records available to authorized patients and clinicians.
              </p>
            </div>
            <span className="badge badge-purple">{documents.length} Released Reports</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={registrySearch}
                onChange={e => setRegistrySearch(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>
          </div>

          <div className="data-list">
            {documents
              .filter(d => {
                const q = registrySearch.toLowerCase();
                return !q || d.title.toLowerCase().includes(q) || (d.patientName || '').toLowerCase().includes(q) || (d.patientId || '').toLowerCase().includes(q);
              })
              .map(doc => (
                <div key={doc.id} className="data-item">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>{doc.title}</strong>
                      <span className="badge badge-purple">{doc.category}</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: doc.status === 'Critical Flag' ? '#fee2e2' : '#dcfce7',
                          color: doc.status === 'Critical Flag' ? '#991b1b' : '#166534',
                          border: '1px solid currentColor'
                        }}
                      >
                        {doc.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#334155', marginTop: '4px' }}>
                      Patient: <strong>{doc.patientName}</strong> ({doc.patientId}) • Date: <strong>{doc.date}</strong>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Lab: {doc.labName || 'DHH Bhawanipatna'} • Verifier: <strong>{doc.authorizedVerifier || doc.doctorInCharge || 'Pathologist'}</strong>
                    </div>

                    {doc.notes && (
                      <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                        Remarks: {doc.notes}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setSelectedDocForViewer(doc)}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <Eye size={13} /> View Report
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => window.print()}
                      style={{ fontSize: '12px', padding: '6px 10px' }}
                      title="Print Official Lab Slip"
                    >
                      <Printer size={13} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: PRE-CONSULTATION PHYSICAL VITALS INTAKE */}
      {/* ======================================================== */}
      {activeTab === 'vitals' && (
        <div className="card">
          <h2 style={{ margin: '0 0 4px', fontSize: '18px' }}>{t.vitalsTitle}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>{t.vitalsDesc}</p>

          {vitalsToast && (
            <div className="alert ok" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={16} /> {vitalsToast}
            </div>
          )}

          <form onSubmit={handleSaveVitals}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">{t.patientNameLabel}</label>
                <input
                  type="text"
                  value={vitalsPatientName}
                  onChange={e => setVitalsPatientName(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label className="form-label">{t.patientIdLabel}</label>
                <input
                  type="text"
                  value={vitalsPatientId}
                  onChange={e => setVitalsPatientId(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label className="form-label">Body Temperature (°F)</label>
                <input
                  type="text"
                  value={vTemp}
                  onChange={e => setVTemp(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label className="form-label">BP Systolic / Diastolic (mmHg)</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={vBpSys}
                    onChange={e => setVBpSys(e.target.value)}
                    style={{ width: '50%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                  <input
                    type="text"
                    value={vBpDia}
                    onChange={e => setVBpDia(e.target.value)}
                    style={{ width: '50%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Pulse Rate (BPM)</label>
                <input
                  type="text"
                  value={vPulse}
                  onChange={e => setVPulse(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label className="form-label">Oxygen SpO2 (%)</label>
                <input
                  type="text"
                  value={vSpO2}
                  onChange={e => setVSpO2(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label className="form-label">Random Blood Glucose (mg/dL)</label>
                <input
                  type="text"
                  value={vGlucose}
                  onChange={e => setVGlucose(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '8px 20px', background: '#7c3aed', borderColor: '#7c3aed' }}
            >
              <Heart size={15} /> Save & Broadcast Vitals to Doctor
            </button>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: INSTRUMENT QC & ANALYZER CALIBRATION */}
      {/* ======================================================== */}
      {activeTab === 'instruments' && (
        <div>
          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', color: '#0f172a' }}>{t.instrumentsTitle}</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{t.instrumentsDesc}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              {
                name: 'Mindray BC-5000 5-Part Hematology Analyzer',
                category: 'Automated CBC / Differential',
                status: t.instStatusActive,
                calibrated: 'Today, 06:30 AM',
                reagent: 'Diluent 82%, Lyse 74%, Clean 90%',
                qcPass: '100% Pass'
              },
              {
                name: 'Roche Cobas c111 Clinical Chemistry Analyzer',
                category: 'Biochemistry / LFT / KFT',
                status: t.instStatusActive,
                calibrated: 'Today, 07:15 AM',
                reagent: 'Glucose 88%, Urea 64%, Creatinine 78%',
                qcPass: '99.8% Pass'
              },
              {
                name: 'Molbio TrueNat Quattro TB Molecular System',
                category: 'Micro PCR / MTB & Rifampicin',
                status: t.instStatusActive,
                calibrated: 'Yesterday, 05:00 PM',
                reagent: 'MTB Chips: 48 units available',
                qcPass: '100% Pass'
              },
              {
                name: 'Allengers HF 49R High-Frequency Digital X-Ray',
                category: 'Radiology / Flat Panel Detector',
                status: t.instStatusActive,
                calibrated: '28 Sep 2026',
                reagent: 'AEC Sensor Normal • Dose Area Product OK',
                qcPass: 'AERB Compliant'
              }
            ].map((inst, i) => (
              <div key={i} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <strong style={{ fontSize: '15px', color: '#0f172a' }}>{inst.name}</strong>
                  <span style={{ fontSize: '11px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                    {inst.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600, marginBottom: '10px' }}>
                  {inst.category}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>{t.instLastCalibrated} <strong>{inst.calibrated}</strong></div>
                  <div>{t.instReagents} <strong>{inst.reagent}</strong></div>
                  <div>Quality Control: <strong style={{ color: '#059669' }}>{inst.qcPass}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={!!selectedDocForViewer}
        onClose={() => setSelectedDocForViewer(null)}
        document={selectedDocForViewer}
        lang={lang}
      />
    </div>
  );
};

export default MedicalDashboard;
