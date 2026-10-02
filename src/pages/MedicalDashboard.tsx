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
  ArrowLeft
} from 'lucide-react';
import { DemoUser, Language, NetworkQuality, DiagnosticDocument, DiagnosticTestParameter, PhysiologicalVitals } from '../types';
import { storage } from '../utils/storage';
import { DocumentViewerModal } from '../components/DocumentViewerModal';

interface MedicalDashboardProps {
  user: DemoUser;
  networkQuality: NetworkQuality;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
  onBack?: () => void;
}

const DASH_I18N = {
  English: {
    portalBadge: 'District Pathology & Diagnostics Hub',
    centerTitle: 'DHH Central Diagnostic & Pathology Center',
    centerSubtitle: 'District Headquarters Hospital • Bhawanipatna, Kalahandi, Odisha • NABL & ABDM M3 Certified',
    statReportsToday: 'Reports Today',
    statPhysicalSubmitted: 'Physical Scans Added',
    statCriticalAlerts: 'Critical Value Alerts',
    statAbhaSynced: 'ABHA Records Synced',
    tabSubmit: 'Submit Physical Report',
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
    thAbnormal: 'Flag as Abnormal',
    thAction: 'Action',
    btnAddParam: 'Add Test Parameter Row',
    notesSectionTitle: '5. Pathologist Review & Final Authorization',
    clinicalNotesLabel: 'Pathologist Clinical Remarks & Observations',
    notesPlaceholder: 'e.g. Normocytic normochromic blood picture. No hemoparasites seen. Advised clinical correlation.',
    criticalAlertLabel: 'Mark as CRITICAL VALUE (Triggers urgent clinical alert to doctor)',
    syncAbhaLabel: 'Digitally Link & Sync to Patient ABHA Health Record',
    technicianLabel: 'Lab Technologist Name',
    pathologistLabel: 'Sign-off Pathologist / Medical Officer',
    btnSubmitReport: 'Authorize & Submit Physical Report',
    submitting: 'Verifying & Submitting...',
    successTitle: 'Physical Report Submitted Successfully!',
    successDesc: 'The physical report has been digitized, cryptographically linked to the patient record, and is now immediately viewable in both the Patient Health Portal and Doctor Workspace.',
    btnViewDoc: 'View Document in High-Res Viewer',
    btnSubmitAnother: 'Submit Another Physical Report',
    searchPlaceholder: 'Search by patient name, ID, test name, or barcode...',
    filterAll: 'All Categories',
    filterLab: 'Lab Reports',
    filterXray: 'Radiology / X-Ray',
    filterReferral: 'Referral Slips',
    thDocId: 'Report ID',
    thPatient: 'Patient Details',
    thTest: 'Investigation',
    thDate: 'Date & Provider',
    thStatus: 'Validation Status',
    thActions: 'Actions',
    btnView: 'View Report',
    btnPrint: 'Print Slip',
    btnSyncAbha: 'Sync ABHA',
    vitalsTitle: 'Pre-Consultation Physical Vitals Intake',
    vitalsDesc: 'Record physical vital signs taken at the diagnostic collection center prior to doctor video consultation.',
    tempLabel: 'Body Temperature (°F)',
    bpSysLabel: 'BP Systolic (mmHg)',
    bpDiaLabel: 'BP Diastolic (mmHg)',
    pulseLabel: 'Pulse Rate (BPM)',
    spo2Label: 'Oxygen Saturation SpO2 (%)',
    glucoseLabel: 'Random Blood Glucose (mg/dL)',
    btnSaveVitals: 'Save & Broadcast Physical Vitals',
    vitalsSuccess: 'Physical vitals successfully saved to Patient & Doctor workspaces!',
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
    tabSubmit: 'ଶାରୀରିକ ରିପୋର୍ଟ ଦାଖଲ',
    tabRegistry: 'ରିପୋର୍ଟ ତାଲିକା (ରେଜିଷ୍ଟ୍ରି)',
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
    uploadPrompt: 'କାଗଜ ରିପୋର୍ଟ ସ୍କାନ୍ କିମ୍ବା ଫଟୋ ଫାଇଲ୍ ଟାଣି ଆଣନ୍ତୁ କିମ୍ବା ଚୟନ କରନ୍ତୁ (PNG, JPG, PDF)',
    btnSimulateScan: 'ନମୁନା ଲାବ୍ ସ୍କାନ୍ ଯୋଡ଼ନ୍ତୁ',
    btnCaptureWebcam: 'କ୍ୟାମେରା ସ୍କାନ୍ ନିଅନ୍ତୁ',
    removeAttachment: 'ଫାଇଲ୍ ହଟାନ୍ତୁ',
    parametersSectionTitle: '୪. ପରୀକ୍ଷା ମାନଦଣ୍ଡ ଓ ଫଳାଫଳ',
    paramHelp: 'କାଗଜ ରିପୋର୍ଟରୁ ପରୀକ୍ଷା ଫଳାଫଳ ଏଠାରେ ଯାଞ୍ଚ ଓ ଆବଶ୍ୟକ ହେଲେ ସଂଶୋଧନ କରନ୍ତୁ:',
    thParamName: 'ପରୀକ୍ଷା ନାମ',
    thResult: 'ଫଳାଫଳ',
    thUnit: 'ଏକକ (Unit)',
    thRefRange: 'ସ୍ୱାଭାବିକ ସୀମା',
    thAbnormal: 'ଅସ୍ୱାଭାବିକ ଚିହ୍ନଟ',
    thAction: 'କାର୍ଯ୍ୟ',
    btnAddParam: 'ନୂଆ ପରୀକ୍ଷା ଧାଡ଼ି ଯୋଡ଼ନ୍ତୁ',
    notesSectionTitle: '୫. ପାଥୋଲୋଜିଷ୍ଟ୍ ମତାମତ ଓ ଅନୁମୋଦନ',
    clinicalNotesLabel: 'ଡାକ୍ତରୀ ମତାମତ ଓ ନିରୀକ୍ଷଣ',
    notesPlaceholder: 'ଉଦାହରଣ: ହିମୋଗ୍ଲୋବିନ୍ ଏବଂ ରକ୍ତକଣିକା ସ୍ୱାଭାବିକ ରହିଛି। କୌଣସି ଜୀବାଣୁ ଦେଖାଯାଇନାହିଁ।',
    criticalAlertLabel: 'ଜରୁରୀ ଚିକିତ୍ସା ସତର୍କତା (ଡାକ୍ତରଙ୍କୁ ତୁରନ୍ତ ସୂଚନା ଦିଆଯିବ)',
    syncAbhaLabel: 'ରୋଗୀଙ୍କ ABHA ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ସହ ଯୋଡ଼ନ୍ତୁ',
    technicianLabel: 'ଲାବୋରେଟୋରୀ ଟେକ୍ନିସିଆନ୍ ନାମ',
    pathologistLabel: 'ଅନୁମୋଦନକାରୀ ପାଥୋଲୋଜିଷ୍ଟ୍ / ଡାକ୍ତର',
    btnSubmitReport: 'ଶାରୀରିକ ରିପୋର୍ଟ ଅନୁମୋଦନ ଓ ଦାଖଲ କରନ୍ତୁ',
    submitting: 'ଯାଞ୍ଚ ଓ ଦାଖଲ ହେଉଛି...',
    successTitle: 'ଶାରୀରିକ ରିପୋର୍ଟ ସଫଳତାର ସହ ଦାଖଲ ହେଲା!',
    successDesc: 'ରିପୋର୍ଟଟି ଡିଜିଟାଲ୍ ଭାବେ ସଂରକ୍ଷିତ ହୋଇଛି ଏବଂ ରୋଗୀ ଓ ଡାକ୍ତରଙ୍କ ପୋର୍ଟାଲରେ ତୁରନ୍ତ ଉପଲବ୍ଧ ହୋଇଛି।',
    btnViewDoc: 'ରିପୋର୍ଟ ସମ୍ପୂର୍ଣ୍ଣ ଦେଖନ୍ତୁ',
    btnSubmitAnother: 'ଅନ୍ୟ ଏକ ରିପୋର୍ଟ ଦାଖଲ କରନ୍ତୁ',
    searchPlaceholder: 'ରୋଗୀଙ୍କ ନାମ, ଆଇଡି, କିମ୍ବା ବାରକୋଡ୍ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...',
    filterAll: 'ସମସ୍ତ ବିଭାଗ',
    filterLab: 'ଲାବ୍ ରିପୋର୍ଟ',
    filterXray: 'ଏକ୍ସ-ରେ / ରେଡିଓଲୋଜି',
    filterReferral: 'ରେଫରାଲ୍ ସ୍ଲିପ୍',
    thDocId: 'ରିପୋର୍ଟ ଆଇଡି',
    thPatient: 'ରୋଗୀ ବିବରଣୀ',
    thTest: 'ପରୀକ୍ଷା',
    thDate: 'ତାରିଖ ଓ କେନ୍ଦ୍ର',
    thStatus: 'ସ୍ଥିତି',
    thActions: 'କାର୍ଯ୍ୟ',
    btnView: 'ଦେଖନ୍ତୁ',
    btnPrint: 'ପ୍ରିଣ୍ଟ୍',
    btnSyncAbha: 'ABHA ସିଙ୍କ୍',
    vitalsTitle: 'ପରାମର୍ଶ ପୂର୍ବ ଶାରୀରିକ ଭାଇଟାଲ୍ସ ସଂଗ୍ରହ',
    vitalsDesc: 'ଡାକ୍ତରୀ ଭିଡିଓ ପରାମର୍ଶ ପୂର୍ବରୁ କ୍ଲିନିକରେ ରୋଗୀଙ୍କ ଶାରୀରିକ ଭାଇଟାଲ୍ସ ଲିପିବଦ୍ଧ କରନ୍ତୁ।',
    tempLabel: 'ଶରୀର ତାପମାତ୍ରା (°F)',
    bpSysLabel: 'ରକ୍ତଚାପ Systolic (mmHg)',
    bpDiaLabel: 'ରକ୍ତଚାପ Diastolic (mmHg)',
    pulseLabel: 'ନାଡ଼ି ସ୍ପନ୍ଦନ (BPM)',
    spo2Label: 'ଅମ୍ଳଜାନ ସ୍ତର SpO2 (%)',
    glucoseLabel: 'ରକ୍ତ ଶର୍କରା Glucose (mg/dL)',
    btnSaveVitals: 'ଭାଇଟାଲ୍ସ ସେଭ୍ କରନ୍ତୁ',
    vitalsSuccess: 'ଶାରୀରିକ ଭାଇଟାଲ୍ସ ସଫଳତାର ସହ ସେଭ୍ ହେଲା ଏବଂ ଡାକ୍ତରଙ୍କ ପାଖକୁ ପଠାଗଲା!',
    instrumentsTitle: 'ପରୀକ୍ଷାଗାର ଯନ୍ତ୍ରପାତି ଓ ଗୁଣବତ୍ତା ନିୟନ୍ତ୍ରଣ',
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
    tabSubmit: 'शारीरिक रिपोर्ट जमा करें',
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
    thAbnormal: 'असामान्य चिह्नित करें',
    thAction: 'क्रिया',
    btnAddParam: 'नई परीक्षण पंक्ति जोड़ें',
    notesSectionTitle: '5. पैथोलॉजिस्ट समीक्षा एवं अंतिम सत्यापन',
    clinicalNotesLabel: 'पैथोलॉजिस्ट की चिकित्सीय टिप्पणी एवं निष्कर्ष',
    notesPlaceholder: 'उदा. हीमोग्लोबिन एवं प्लेटलेट सामान्य सीमा में हैं। कोई रोगजनक सूक्ष्मजीव नहीं पाए गए।',
    criticalAlertLabel: 'गंभीर चेतावनी के रूप में चिह्नित करें (डॉक्टर को तत्काल अलर्ट भेजा जाएगा)',
    syncAbhaLabel: 'मरीज के ABHA डिजिटल स्वास्थ्य रिकॉर्ड से जोड़ें',
    technicianLabel: 'लैब तकनीशियन का नाम',
    pathologistLabel: 'सत्यापनकर्ता पैथोलॉजिस्ट / चिकित्सा अधिकारी',
    btnSubmitReport: 'शारीरिक रिपोर्ट सत्यापित कर जमा करें',
    submitting: 'सत्यापित और जमा किया जा रहा है...',
    successTitle: 'शारीरिक रिपोर्ट सफलतापूर्वक जमा हो गई!',
    successDesc: 'कागजी रिपोर्ट डिजिटल रूप से मरीज के रिकॉर्ड में जुड़ चुकी है और मरीज व डॉक्टर दोनों के पोर्टल में तुरंत उपलब्ध है।',
    btnViewDoc: 'हाई-रेज़ोल्यूशन व्यूअर में देखें',
    btnSubmitAnother: 'अन्य शारीरिक रिपोर्ट दर्ज करें',
    searchPlaceholder: 'मरीज के नाम, आईडी, जांच या बारकोड से खोजें...',
    filterAll: 'सभी श्रेणियां',
    filterLab: 'लैब रिपोर्ट',
    filterXray: 'रेडियोलॉजी / एक्स-रे',
    filterReferral: 'रेफरल पर्ची',
    thDocId: 'रिपोर्ट आईडी',
    thPatient: 'मरीज विवरण',
    thTest: 'जांच नाम',
    thDate: 'दिनांक एवं केंद्र',
    thStatus: 'सत्यापन स्थिति',
    thActions: 'कार्रवाई',
    btnView: 'देखें',
    btnPrint: 'प्रिंट',
    btnSyncAbha: 'ABHA सिंक',
    vitalsTitle: 'परामर्श पूर्व शारीरिक वाइटल्स संग्रह',
    vitalsDesc: 'डॉक्टर से वीडियो कंसल्टेशन से पूर्व केंद्र पर मरीज के शारीरिक वाइटल साइन दर्ज करें।',
    tempLabel: 'शरीर का तापमान (°F)',
    bpSysLabel: 'रक्तचाप Systolic (mmHg)',
    bpDiaLabel: 'रक्तचाप Diastolic (mmHg)',
    pulseLabel: 'नाड़ी दर (BPM)',
    spo2Label: 'ऑक्सीजन संतृप्ति SpO2 (%)',
    glucoseLabel: 'रैंडम ब्लड ग्लूकोज (mg/dL)',
    btnSaveVitals: 'शारीरिक वाइटल्स सुरक्षित करें',
    vitalsSuccess: 'शारीरिक वाइटल्स सफलतापूर्वक सुरक्षित किए गए और डॉक्टर कार्यक्षेत्र में भेज दिए गए!',
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
      { name: 'Hemoglobin (Hb)', result: '12.8', unit: 'g/dL', refRange: '12.0 - 16.5', isAbnormal: false },
      { name: 'Total Leukocyte Count (TLC)', result: '7,400', unit: '/cumm', refRange: '4,000 - 11,000', isAbnormal: false },
      { name: 'Platelet Count', result: '2.10', unit: 'Lakhs/cumm', refRange: '1.50 - 4.50', isAbnormal: false },
      { name: 'Neutrophils', result: '62', unit: '%', refRange: '40 - 75', isAbnormal: false },
      { name: 'Lymphocytes', result: '30', unit: '%', refRange: '20 - 45', isAbnormal: false },
      { name: 'Eosinophils', result: '04', unit: '%', refRange: '01 - 06', isAbnormal: false },
      { name: 'ESR (Westergren)', result: '14', unit: 'mm/1st hr', refRange: '0 - 20', isAbnormal: false }
    ]
  },
  malaria: {
    title: 'Peripheral Blood Smear for Malaria (MP / Rapid Ag)',
    category: 'Lab Report',
    specimen: 'Capillary / Venous Blood',
    defaultNotes: 'Thick and thin smears stained with Leishman stain. No ring forms or gametocytes of Plasmodium falciparum or vivax detected.',
    parameters: [
      { name: 'Plasmodium falciparum (Antigen)', result: 'Negative', unit: '', refRange: 'Negative', isAbnormal: false },
      { name: 'Plasmodium vivax (Antigen)', result: 'Negative', unit: '', refRange: 'Negative', isAbnormal: false },
      { name: 'Smear Examination for MP', result: 'Not Detected', unit: '', refRange: 'Not Detected', isAbnormal: false },
      { name: 'Parasite Density Index', result: '0', unit: 'parasites/µL', refRange: '0', isAbnormal: false }
    ]
  },
  tb_sputum: {
    title: 'Sputum TrueNat MTB / Acid Fast Bacilli (AFB)',
    category: 'Lab Report',
    specimen: 'Early Morning Deep Cough Sputum',
    defaultNotes: 'Chip-based Real Time Micro PCR (TrueNat). Mycobacterium tuberculosis NOT detected. Rifampicin resistance not applicable.',
    parameters: [
      { name: 'Acid Fast Bacilli (ZN Smear)', result: 'Negative (0 AFB / 100 fields)', unit: '', refRange: 'Negative', isAbnormal: false },
      { name: 'TrueNat MTB DNA', result: 'Not Detected', unit: '', refRange: 'Not Detected', isAbnormal: false },
      { name: 'Rifampicin Resistance Gene', result: 'Not Detected', unit: '', refRange: 'Not Detected', isAbnormal: false }
    ]
  },
  xray_chest: {
    title: 'Digital Chest X-Ray (PA View Scan)',
    category: 'X-Ray',
    specimen: 'Radiological Imaging Film (Digital)',
    defaultNotes: 'Bilateral lung parenchyma clear without active consolidation, cavitation, or pleural effusion. Cardiac size and mediastinal contours normal.',
    parameters: [
      { name: 'Lung Fields', result: 'Clear & Aerated', unit: '', refRange: 'Normal', isAbnormal: false },
      { name: 'Cardiothoracic Ratio (CTR)', result: '0.45 (< 50%)', unit: '', refRange: '< 0.50', isAbnormal: false },
      { name: 'Costophrenic Angles', result: 'Sharp & Normal', unit: '', refRange: 'Sharp', isAbnormal: false },
      { name: 'Bony Cage & Soft Tissues', result: 'Intact', unit: '', refRange: 'Intact', isAbnormal: false }
    ]
  },
  dengue: {
    title: 'Dengue Serology Panel (NS1 Antigen & IgM/IgG)',
    category: 'Lab Report',
    specimen: 'Serum (Plain Tube)',
    defaultNotes: 'Dengue NS1 Antigen negative. Platelet count monitored above 1.5 Lakhs.',
    parameters: [
      { name: 'Dengue NS1 Antigen', result: 'Non-Reactive', unit: '', refRange: 'Non-Reactive', isAbnormal: false },
      { name: 'Dengue IgM Antibodies', result: 'Non-Reactive', unit: '', refRange: 'Non-Reactive', isAbnormal: false },
      { name: 'Dengue IgG Antibodies', result: 'Non-Reactive', unit: '', refRange: 'Non-Reactive', isAbnormal: false },
      { name: 'Hematocrit (PCV)', result: '42.0', unit: '%', refRange: '38.0 - 48.0', isAbnormal: false }
    ]
  },
  biochem: {
    title: 'Serum Biochemistry Panel (Sugar, LFT, KFT)',
    category: 'Lab Report',
    specimen: 'Serum (SST Gel Tube)',
    defaultNotes: 'Renal and hepatic markers are within established physiological reference values.',
    parameters: [
      { name: 'Fasting Blood Sugar (FBS)', result: '94', unit: 'mg/dL', refRange: '70 - 100', isAbnormal: false },
      { name: 'Serum Creatinine', result: '0.9', unit: 'mg/dL', refRange: '0.7 - 1.3', isAbnormal: false },
      { name: 'Blood Urea', result: '22', unit: 'mg/dL', refRange: '15 - 40', isAbnormal: false },
      { name: 'Total Bilirubin', result: '0.7', unit: 'mg/dL', refRange: '0.2 - 1.2', isAbnormal: false },
      { name: 'SGPT / ALT', result: '26', unit: 'U/L', refRange: '0 - 45', isAbnormal: false },
      { name: 'SGOT / AST', result: '24', unit: 'U/L', refRange: '0 - 40', isAbnormal: false }
    ]
  },
  ecg: {
    title: '12-Lead Electrocardiogram (ECG) Physical Strip',
    category: 'Lab Report',
    specimen: 'Physical ECG Thermal Paper Strip',
    defaultNotes: 'Normal sinus rhythm at 78 bpm. Normal axis, PR interval 150ms. No ischemic ST-T wave abnormalities.',
    parameters: [
      { name: 'Ventricular Rate', result: '78', unit: 'bpm', refRange: '60 - 100', isAbnormal: false },
      { name: 'Rhythm', result: 'Sinus Rhythm', unit: '', refRange: 'Sinus', isAbnormal: false },
      { name: 'PR Interval', result: '152', unit: 'ms', refRange: '120 - 200', isAbnormal: false },
      { name: 'QRS Duration', result: '88', unit: 'ms', refRange: '80 - 120', isAbnormal: false },
      { name: 'ST-T Wave Changes', result: 'None / Normal', unit: '', refRange: 'Normal', isAbnormal: false }
    ]
  },
  urine: {
    title: 'Urine Routine & Microscopic Examination (U/R/M)',
    category: 'Lab Report',
    specimen: 'Clean Catch Midstream Urine',
    defaultNotes: 'Urine pale yellow, clear. Microscopic examination reveals no pus cells or abnormal crystals.',
    parameters: [
      { name: 'Color / Appearance', result: 'Pale Yellow / Clear', unit: '', refRange: 'Clear', isAbnormal: false },
      { name: 'Specific Gravity', result: '1.020', unit: '', refRange: '1.005 - 1.030', isAbnormal: false },
      { name: 'pH', result: '6.0', unit: '', refRange: '4.6 - 8.0', isAbnormal: false },
      { name: 'Protein (Albumin)', result: 'Nil', unit: '', refRange: 'Nil', isAbnormal: false },
      { name: 'Sugar (Glucose)', result: 'Nil', unit: '', refRange: 'Nil', isAbnormal: false },
      { name: 'Pus Cells', result: '1 - 2', unit: '/HPF', refRange: '0 - 4', isAbnormal: false },
      { name: 'RBCs', result: 'Nil', unit: '/HPF', refRange: 'Nil', isAbnormal: false }
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

  // Tab State
  const [activeTab, setActiveTab] = useState<'submit' | 'registry' | 'vitals' | 'instruments'>('submit');

  // Documents State
  const [documents, setDocuments] = useState<DiagnosticDocument[]>([]);
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<DiagnosticDocument | null>(null);

  // Form State
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('cbc');
  const [patientId, setPatientId] = useState<string>('RHB-OD-KLH-0941');
  const [patientName, setPatientName] = useState<string>('Keshab Rout');
  const [patientAge, setPatientAge] = useState<string>('26');
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
  const [pathologistName, setPathologistName] = useState<string>('Dr. M. K. Rath (MD Pathology)');

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
  const [vTemp, setVTemp] = useState<string>('99.8');
  const [vBpSys, setVBpSys] = useState<string>('118');
  const [vBpDia, setVBpDia] = useState<string>('78');
  const [vPulse, setVPulse] = useState<string>('82');
  const [vSpO2, setVSpO2] = useState<string>('98');
  const [vGlucose, setVGlucose] = useState<string>('104');
  const [vitalsToast, setVitalsToast] = useState<string>('');

  // Load documents on mount
  useEffect(() => {
    refreshDocs();
  }, []);

  const refreshDocs = () => {
    setDocuments(storage.getDocuments());
  };

  // Change test template
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

  // Preset Patient Switcher
  const handleSelectPresetPatient = (pid: string) => {
    if (pid === 'RHB-OD-KLH-0941') {
      setPatientId('RHB-OD-KLH-0941');
      setPatientName('Keshab Rout');
      setPatientAge('26');
      setPatientGender('Male');
      setVillage('Bhawanipatna, Kalahandi');
    } else if (pid === 'RHB-OD-KLH-0812') {
      setPatientId('RHB-OD-KLH-0812');
      setPatientName('Demo Patient 02');
      setPatientAge('58');
      setPatientGender('Male');
      setVillage('Junagarh Block, Kalahandi');
    } else if (pid === 'RHB-OD-KLH-0744') {
      setPatientId('RHB-OD-KLH-0744');
      setPatientName('Saraswati Naik');
      setPatientAge('44');
      setPatientGender('Female');
      setVillage('Dharamgarh, Kalahandi');
    }
  };

  // Parameter table helpers
  const handleParamChange = (index: number, field: keyof DiagnosticTestParameter, val: any) => {
    const updated = [...parameters];
    updated[index] = { ...updated[index], [field]: val };
    setParameters(updated);
  };

  const handleAddParamRow = () => {
    setParameters([
      ...parameters,
      { name: 'New Parameter', result: '', unit: '', refRange: 'Normal', isAbnormal: false }
    ]);
  };

  const handleRemoveParamRow = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  // File Upload Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScannedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setScannedFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate Scanned Paper Document Generator
  const handleGenerateSampleScan = () => {
    // Generates a rich SVG-based realistic physical lab test sheet
    const canvas = document.createElement('canvas');
    canvas.width = 680;
    canvas.height = 860;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Paper background
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
      ctx.fillText(`PATIENT: ${patientName} (${patientAge} Y / ${patientGender})`, 36, 135);
      ctx.font = '12px sans-serif';
      ctx.fillText(`UID / ABHA ID: ${patientId}`, 36, 155);
      ctx.fillText(`SAMPLE DATE: ${collectionDateTime} • SPECIMEN: ${specimen}`, 36, 175);
      ctx.fillText(`REF NO: ${barcode}`, 430, 135);
      ctx.fillText(`CENTER: DHH Central Lab`, 430, 155);

      // Report Title
      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(reportTitle.toUpperCase(), 36, 225);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(36, 235);
      ctx.lineTo(644, 235);
      ctx.stroke();

      // Parameter rows
      ctx.fillStyle = '#334155';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('TEST PARAMETER', 40, 260);
      ctx.fillText('RESULT', 320, 260);
      ctx.fillText('BIOLOGICAL REF RANGE', 470, 260);

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(36, 270);
      ctx.lineTo(644, 270);
      ctx.stroke();

      ctx.font = '12px sans-serif';
      parameters.slice(0, 8).forEach((p, idx) => {
        const y = 295 + (idx * 30);
        ctx.fillStyle = p.isAbnormal ? '#b91c1c' : '#1e293b';
        ctx.fillText(p.name, 40, y);
        ctx.font = p.isAbnormal ? 'bold 12px sans-serif' : '12px sans-serif';
        ctx.fillText(`${p.result} ${p.unit || ''}`, 320, y);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(p.refRange, 470, y);
        ctx.beginPath();
        ctx.moveTo(36, y + 8);
        ctx.lineTo(644, y + 8);
        ctx.stroke();
      });

      // Clinical notes
      const notesY = 295 + (Math.min(parameters.length, 8) * 30) + 30;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(20, notesY, 640, 60);
      ctx.strokeRect(20, notesY, 640, 60);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('CLINICAL IMPRESSION / PATHOLOGIST REMARKS:', 36, notesY + 22);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText(clinicalNotes.slice(0, 100), 36, notesY + 42);

      // Official Stamp & Signatures
      const stampY = 740;
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, stampY, 150, 65);
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('AUTHENTICATED', 55, stampY + 25);
      ctx.fillText('DHH LAB SEAL', 65, stampY + 42);
      ctx.font = '9px monospace';
      ctx.fillText('GOVT OF ODISHA', 60, stampY + 56);

      ctx.fillStyle = '#1e293b';
      ctx.font = '11px sans-serif';
      ctx.fillText('Verified By:', 260, stampY + 30);
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(technicianName, 260, stampY + 48);

      ctx.font = '11px sans-serif';
      ctx.fillText('Authorized Pathologist:', 440, stampY + 30);
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(pathologistName, 440, stampY + 48);

      const generatedUrl = canvas.toDataURL('image/png');
      setScannedFileUrl(generatedUrl);
      setScannedFileName(`PHYSICAL_SCAN_${barcode}.png`);
    }
  };

  // Submit Physical Report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Add Diagnostic Document
      const newDoc: Omit<DiagnosticDocument, 'id'> = {
        title: reportTitle,
        category,
        date: new Date().toLocaleDateString('en-GB'),
        provider: 'DHH Bhawanipatna Central Pathology Lab',
        patientId,
        patientName,
        status: criticalAlert ? 'Critical Flag' : 'Verified',
        fileUrl: scannedFileUrl || undefined,
        sampleType: specimen,
        labName: 'DHH Bhawanipatna Central Pathology Lab',
        technicianName,
        doctorInCharge: pathologistName,
        criticalAlert,
        notes: clinicalNotes,
        parameters,
        syncedAbha: syncAbha
      };

      const savedDoc = storage.addDocument(newDoc);

      // 2. Save Clinical Health Record for Timeline
      storage.saveRecord({
        patientId,
        type: 'lab',
        doctorName: pathologistName,
        notes: `${reportTitle}: ${clinicalNotes} (Ref: ${barcode})`,
        pathway: 'clinician consultation',
        urgency: criticalAlert ? 'urgent' : 'routine',
        synced: syncAbha
      });

      // 3. Dispatch High-Priority In-App Notification
      storage.addNotification({
        title: criticalAlert ? '🚨 CRITICAL LAB REPORT SUBMITTED' : 'New Lab Report Available',
        body: `Physical report ${reportTitle} for ${patientName} (${patientId}) submitted by ${user.name}.`,
        type: 'doctor'
      });

      // 4. Clinical Audit Trail Log
      storage.addAuditLog(
        `Physical diagnostic report ${reportTitle} (${barcode}) uploaded and authorized for ${patientName}`,
        technicianName
      );

      // 5. Update Local Document List and state
      refreshDocs();
      setIsSubmitting(false);
      setSubmissionSuccess(savedDoc);
    }, 800);
  };

  // Vitals Submit
  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const vitalsObj: PhysiologicalVitals = {
      temperatureF: parseFloat(vTemp) || 98.6,
      bpSystolic: parseInt(vBpSys) || 120,
      bpDiastolic: parseInt(vBpDia) || 80,
      pulseBpm: parseInt(vPulse) || 72,
      spO2Percent: parseInt(vSpO2) || 98,
      enteredBy: 'Connected Device',
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
    setTimeout(() => setVitalsToast(''), 4000);
  };

  // Filter Registry Documents
  const filteredDocs = documents.filter((doc) => {
    const q = registrySearch.toLowerCase();
    const matchesSearch =
      (doc.title && doc.title.toLowerCase().includes(q)) ||
      (doc.patientName && doc.patientName.toLowerCase().includes(q)) ||
      (doc.patientId && doc.patientId.toLowerCase().includes(q)) ||
      (doc.id && doc.id.toLowerCase().includes(q));

    const matchesCategory =
      registryCategoryFilter === 'all' || doc.category === registryCategoryFilter;

    const matchesStatus =
      registryStatusFilter === 'all' || doc.status === registryStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="medical-dashboard" style={{ paddingBottom: '80px', fontFamily: "'Inter', sans-serif" }}>
      {/* 1. HERO FACILITY HEADER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #091e42 0%, #0d3875 50%, #064e3b 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '20px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(25, 211, 255, 0.2)',
                  color: '#38bdf8',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  letterSpacing: '0.04em'
                }}
              >
                <FlaskConical size={14} />
                <span>{t.portalBadge}</span>
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                UID: <strong>OR-KLH-LAB-01</strong>
              </span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
              {t.centerTitle}
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', maxWidth: '680px' }}>
              {t.centerSubtitle}
            </p>

            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', color: '#93c5fd', flexWrap: 'wrap' }}>
              <span>Technician: <strong>{technicianName}</strong></span>
              <span>•</span>
              <span>Chief Pathologist: <strong>{pathologistName}</strong></span>
              <span>•</span>
              <span>Network: <strong style={{ color: '#86efac' }}>{networkQuality.toUpperCase()}</strong></span>
            </div>
          </div>

          {/* Language Switcher Bar */}
          {onSelectLang && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', padding: '4px 8px', borderRadius: '24px' }}>
              {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => onSelectLang(l)}
                  style={{
                    background: lang === l ? '#38bdf8' : 'transparent',
                    color: lang === l ? '#071c42' : '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    fontWeight: lang === l ? 800 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Diagnostic KPI Counter Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{t.statReportsToday}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>{documents.length + 18}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{t.statPhysicalSubmitted}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>{documents.length}</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{t.statCriticalAlerts}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#f87171' }}>
              {documents.filter(d => d.status === 'Critical Flag' || d.criticalAlert).length}
            </div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{t.statAbhaSynced}</div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#86efac' }}>100%</div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          type="button"
          className="btn"
          onClick={() => setActiveTab('submit')}
          style={{
            background: activeTab === 'submit' ? '#0284c7' : '#ffffff',
            color: activeTab === 'submit' ? '#ffffff' : '#334155',
            border: activeTab === 'submit' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '10px 18px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'submit' ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
          }}
        >
          <Upload size={16} />
          <span>{t.tabSubmit}</span>
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => setActiveTab('registry')}
          style={{
            background: activeTab === 'registry' ? '#0284c7' : '#ffffff',
            color: activeTab === 'registry' ? '#ffffff' : '#334155',
            border: activeTab === 'registry' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '10px 18px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'registry' ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
          }}
        >
          <FileText size={16} />
          <span>{t.tabRegistry}</span>
          <span style={{
            background: activeTab === 'registry' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
            color: activeTab === 'registry' ? '#ffffff' : '#475569',
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: '999px'
          }}>
            {documents.length}
          </span>
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => setActiveTab('vitals')}
          style={{
            background: activeTab === 'vitals' ? '#0284c7' : '#ffffff',
            color: activeTab === 'vitals' ? '#ffffff' : '#334155',
            border: activeTab === 'vitals' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '10px 18px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'vitals' ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
          }}
        >
          <Activity size={16} />
          <span>{t.tabVitals}</span>
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => setActiveTab('instruments')}
          style={{
            background: activeTab === 'instruments' ? '#0284c7' : '#ffffff',
            color: activeTab === 'instruments' ? '#ffffff' : '#334155',
            border: activeTab === 'instruments' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '10px 18px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'instruments' ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
          }}
        >
          <Sliders size={16} />
          <span>{t.tabInstruments}</span>
        </button>
      </div>

      {/* Universal Back Navigation for Medical Dashboard Tabs */}
      {activeTab !== 'submit' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '18px',
          padding: '10px 16px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className="btn btn-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '13px',
              color: '#0284c7',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '7px 14px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>
              {lang === 'ଓଡ଼ିଆ' ? '← ରିପୋର୍ଟ ଦାଖଲ ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ' : lang === 'हिन्दी' ? '← मुख्य रिपोर्ट डैशबोर्ड पर वापस जाएं' : '← Back to Report Submission'}
            </span>
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="btn btn-ghost"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#64748b',
                padding: '6px 12px'
              }}
            >
              <span>{lang === 'ଓଡ଼ିଆ' ? 'ଭୂମିକା ଚୟନ / ପ୍ରସ୍ଥାନ' : lang === 'हिन्दी' ? 'भूमिका चयन / बाहर निकलें' : 'Switch Role / Exit'}</span>
            </button>
          )}
        </div>
      )}

      {/* 3. TAB 1: SUBMIT PHYSICAL PATIENT REPORT */}
      {activeTab === 'submit' && (
        <div>
          {submissionSuccess ? (
            /* Success Feedback Banner */
            <div className="card" style={{ padding: '32px', textAlign: 'center', marginBottom: '24px', border: '2px solid #86efac', background: '#f0fdf4' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ color: '#166534', margin: '0 0 8px' }}>{t.successTitle}</h2>
              <p style={{ color: '#374151', maxWidth: '600px', margin: '0 auto 20px', fontSize: '14px' }}>
                {t.successDesc}
              </p>
              <div style={{ display: 'inline-flex', gap: '8px', background: '#ffffff', padding: '12px 20px', borderRadius: '10px', border: '1px solid #bbf7d0', marginBottom: '24px', fontSize: '13px' }}>
                <span>Report ID: <strong>{submissionSuccess.id}</strong></span>
                <span>•</span>
                <span>Patient: <strong>{submissionSuccess.patientName} ({submissionSuccess.patientId})</strong></span>
                <span>•</span>
                <span>Status: <strong style={{ color: '#16a34a' }}>{submissionSuccess.status}</strong></span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSelectedDocForViewer(submissionSuccess)}
                  style={{ padding: '10px 20px' }}
                >
                  <Eye size={16} />
                  <span>{t.btnViewDoc}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setBarcode(`KLH-PATH-2026-0${Math.floor(Math.random() * 800 + 100)}`);
                    setScannedFileUrl('');
                    setScannedFileName('');
                  }}
                  style={{ padding: '10px 20px' }}
                >
                  <Plus size={16} />
                  <span>{t.btnSubmitAnother}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReport}>
              {/* Patient Quick Selector & Fields */}
              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} style={{ color: '#0284c7' }} />
                  <span>{t.patientSectionTitle}</span>
                </h3>

                {/* Preset Patient Buttons */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                    {t.selectPreConfig}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => handleSelectPresetPatient('RHB-OD-KLH-0941')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: patientId === 'RHB-OD-KLH-0941' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                        background: patientId === 'RHB-OD-KLH-0941' ? '#e0f2fe' : '#ffffff',
                        color: patientId === 'RHB-OD-KLH-0941' ? '#0369a1' : '#334155',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      👤 Keshab Rout (RHB-OD-KLH-0941) • 26 Y / M
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPresetPatient('RHB-OD-KLH-0812')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: patientId === 'RHB-OD-KLH-0812' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                        background: patientId === 'RHB-OD-KLH-0812' ? '#e0f2fe' : '#ffffff',
                        color: patientId === 'RHB-OD-KLH-0812' ? '#0369a1' : '#334155',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      👤 Demo Patient 02 (RHB-OD-KLH-0812) • 58 Y / M
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPresetPatient('RHB-OD-KLH-0744')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: patientId === 'RHB-OD-KLH-0744' ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                        background: patientId === 'RHB-OD-KLH-0744' ? '#e0f2fe' : '#ffffff',
                        color: patientId === 'RHB-OD-KLH-0744' ? '#0369a1' : '#334155',
                        fontWeight: 600,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      👤 Saraswati Naik (RHB-OD-KLH-0744) • 44 Y / F
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                  <div className="field">
                    <label>{t.patientIdLabel}</label>
                    <input
                      type="text"
                      required
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.patientNameLabel}</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.ageGenderLabel}</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input
                        type="text"
                        style={{ width: '80px' }}
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="Age"
                      />
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label>{t.villageLabel}</label>
                    <input
                      type="text"
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Investigation Details & Preset Template */}
              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FlaskConical size={18} style={{ color: '#0284c7' }} />
                  <span>{t.testSectionTitle}</span>
                </h3>

                {/* Test category buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {Object.entries({
                    cbc: '🩸 Complete Blood Count (CBC)',
                    malaria: '🦟 Malaria Smear & Rapid Ag',
                    tb_sputum: '🫁 Sputum TrueNat / TB',
                    xray_chest: '🩻 Chest X-Ray PA View',
                    dengue: '🧬 Dengue NS1 & Serology',
                    biochem: '🧪 Blood Sugar & LFT/KFT',
                    ecg: '📈 12-Lead ECG Strip',
                    urine: '🧪 Urine Routine & Microscopy'
                  }).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTemplateChange(key)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: selectedTemplateKey === key ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                        background: selectedTemplateKey === key ? '#0284c7' : '#f8fafc',
                        color: selectedTemplateKey === key ? '#ffffff' : '#334155',
                        fontSize: '12px',
                        fontWeight: selectedTemplateKey === key ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  <div className="field">
                    <label>{t.reportTitleLabel}</label>
                    <input
                      type="text"
                      required
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.barcodeLabel}</label>
                    <input
                      type="text"
                      required
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.specimenLabel}</label>
                    <input
                      type="text"
                      value={specimen}
                      onChange={(e) => setSpecimen(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.collectionDateLabel}</label>
                    <input
                      type="text"
                      value={collectionDateTime}
                      onChange={(e) => setCollectionDateTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Physical Scan / File Upload */}
              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Upload size={18} style={{ color: '#0284c7' }} />
                    <span>{t.uploadSectionTitle}</span>
                  </h3>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleGenerateSampleScan}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <Sparkles size={14} style={{ color: '#0284c7' }} />
                      <span>{t.btnSimulateScan}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <Camera size={14} />
                      <span>{t.btnCaptureWebcam}</span>
                    </button>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                />

                {scannedFileUrl ? (
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img
                        src={scannedFileUrl}
                        alt="Preview"
                        style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff' }}
                      />
                      <div>
                        <strong style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>{scannedFileName || 'physical_lab_report_scan.png'}</strong>
                        <span style={{ fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                          <CheckCircle2 size={14} />
                          <span>Scanned Document Attached & Ready for Telehealth Inspection</span>
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setSelectedDocForViewer({
                          id: barcode,
                          title: reportTitle,
                          category,
                          date: collectionDateTime,
                          provider: 'DHH Central Pathology',
                          patientId,
                          patientName,
                          fileUrl: scannedFileUrl,
                          parameters,
                          notes: clinicalNotes
                        })}
                        style={{ fontSize: '12px', padding: '6px 12px' }}
                      >
                        <Eye size={14} />
                        <span>Preview Scan</span>
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => {
                          setScannedFileUrl('');
                          setScannedFileName('');
                        }}
                        style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '6px 12px', fontSize: '12px', borderRadius: '8px' }}
                      >
                        <Trash2 size={14} />
                        <span>{t.removeAttachment}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '12px',
                      padding: '36px 20px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <Upload size={32} style={{ color: '#0284c7', margin: '0 auto 10px' }} />
                    <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#334155', fontSize: '14px' }}>
                      {t.uploadPrompt}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                      Supports direct photo capture from Android/iOS smartphones, tablet camera, or lab flatbed scanner
                    </p>
                  </div>
                )}
              </div>

              {/* Dynamic Parameter Entry Grid */}
              <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileCheck size={18} style={{ color: '#0284c7' }} />
                      <span>{t.parametersSectionTitle}</span>
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                      {t.paramHelp}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddParamRow}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    <Plus size={14} />
                    <span>{t.btnAddParam}</span>
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', color: '#334155' }}>
                        <th style={{ padding: '8px 10px', textAlign: 'left' }}>{t.thParamName}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', width: '140px' }}>{t.thResult}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', width: '120px' }}>{t.thUnit}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'left', width: '160px' }}>{t.thRefRange}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', width: '110px' }}>{t.thAbnormal}</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center', width: '60px' }}>{t.thAction}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parameters.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', background: p.isAbnormal ? '#fef2f2' : '#ffffff' }}>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => handleParamChange(idx, 'name', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', fontSize: '12px' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="text"
                              value={p.result}
                              onChange={(e) => handleParamChange(idx, 'result', e.target.value)}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: p.isAbnormal ? '#b91c1c' : '#0f172a'
                              }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="text"
                              value={p.unit || ''}
                              onChange={(e) => handleParamChange(idx, 'unit', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', fontSize: '12px' }}
                              placeholder="e.g. g/dL"
                            />
                          </td>
                          <td style={{ padding: '6px 10px' }}>
                            <input
                              type="text"
                              value={p.refRange}
                              onChange={(e) => handleParamChange(idx, 'refRange', e.target.value)}
                              style={{ width: '100%', padding: '6px 8px', fontSize: '12px', color: '#64748b' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              checked={!!p.isAbnormal}
                              onChange={(e) => handleParamChange(idx, 'isAbnormal', e.target.checked)}
                              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ padding: '6px 10px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleRemoveParamRow(idx)}
                              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                              title="Delete row"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pathologist Review & Final Authorization */}
              <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} style={{ color: '#0284c7' }} />
                  <span>{t.notesSectionTitle}</span>
                </h3>

                <div className="field" style={{ marginBottom: '16px' }}>
                  <label>{t.clinicalNotesLabel}</label>
                  <textarea
                    rows={3}
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder={t.notesPlaceholder}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div className="field">
                    <label>{t.technicianLabel}</label>
                    <input
                      type="text"
                      required
                      value={technicianName}
                      onChange={(e) => setTechnicianName(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{t.pathologistLabel}</label>
                    <input
                      type="text"
                      required
                      value={pathologistName}
                      onChange={(e) => setPathologistName(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, color: criticalAlert ? '#b91c1c' : '#334155' }}>
                    <input
                      type="checkbox"
                      checked={criticalAlert}
                      onChange={(e) => setCriticalAlert(e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <AlertTriangle size={18} style={{ color: criticalAlert ? '#dc2626' : '#94a3b8' }} />
                    <span>{t.criticalAlertLabel}</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, color: '#0369a1' }}>
                    <input
                      type="checkbox"
                      checked={syncAbha}
                      onChange={(e) => setSyncAbha(e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                    />
                    <Share2 size={16} />
                    <span>{t.syncAbhaLabel}</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: criticalAlert
                      ? 'linear-gradient(135deg, #dc2626, #ea580c)'
                      : 'linear-gradient(135deg, #0284c7, #0d9488)'
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>{isSubmitting ? t.submitting : t.btnSubmitReport}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 4. TAB 2: SUBMITTED REPORTS REGISTRY */}
      {activeTab === 'registry' && (
        <div>
          {/* Search & Filter Bar */}
          <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={registrySearch}
                  onChange={(e) => setRegistrySearch(e.target.value)}
                  style={{ paddingLeft: '36px', width: '100%', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  value={registryCategoryFilter}
                  onChange={(e) => setRegistryCategoryFilter(e.target.value)}
                  style={{ fontSize: '12px', padding: '8px 12px', borderRadius: '8px' }}
                >
                  <option value="all">{t.filterAll}</option>
                  <option value="Lab Report">{t.filterLab}</option>
                  <option value="X-Ray">{t.filterXray}</option>
                  <option value="Referral">{t.filterReferral}</option>
                </select>

                <select
                  value={registryStatusFilter}
                  onChange={(e) => setRegistryStatusFilter(e.target.value)}
                  style={{ fontSize: '12px', padding: '8px 12px', borderRadius: '8px' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Critical Flag">Critical Alerts Only</option>
                </select>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={refreshDocs}
                  title="Refresh registry"
                  style={{ padding: '8px 12px' }}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Registry Table */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '12px' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>{t.thDocId}</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>{t.thPatient}</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>{t.thTest}</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>{t.thDate}</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>{t.thStatus}</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>{t.thActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                        No diagnostic reports match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map((doc) => {
                      const isCritical = doc.status === 'Critical Flag' || doc.criticalAlert;
                      return (
                        <tr
                          key={doc.id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            background: isCritical ? '#fff5f5' : '#ffffff'
                          }}
                        >
                          <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#0369a1' }}>
                            {doc.id}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <strong style={{ color: '#0f172a' }}>{doc.patientName || 'Keshab Rout'}</strong>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {doc.patientId || 'RHB-OD-KLH-0941'}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <strong style={{ color: '#334155' }}>{doc.title}</strong>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>
                              {doc.category} {doc.sampleType ? `• ${doc.sampleType}` : ''}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div>{doc.date}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{doc.provider}</div>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: isCritical ? '#fee2e2' : '#dcfce7',
                                color: isCritical ? '#b91c1c' : '#15803d'
                              }}
                            >
                              {isCritical ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                              <span>{doc.status || 'Verified'}</span>
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => setSelectedDocForViewer(doc)}
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                              >
                                <Eye size={13} />
                                <span>{t.btnView}</span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => alert(`Printing official barcoded report slip for ${doc.title} (${doc.id})...`)}
                                style={{ padding: '6px 10px', fontSize: '12px' }}
                                title="Print Lab Slip"
                              >
                                <Printer size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: PHYSICAL VITALS INTAKE */}
      {activeTab === 'vitals' && (
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                <Activity size={26} />
              </div>
              <h2 style={{ margin: '0 0 6px', color: '#0f172a' }}>{t.vitalsTitle}</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                {t.vitalsDesc}
              </p>
            </div>

            {vitalsToast && (
              <div style={{ background: '#dcfce7', color: '#166534', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '13px' }}>
                <CheckCircle2 size={16} />
                <span>{vitalsToast}</span>
              </div>
            )}

            <form onSubmit={handleSaveVitals}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div className="field">
                    <label>Patient ID</label>
                    <input
                      type="text"
                      value={vitalsPatientId}
                      onChange={(e) => setVitalsPatientId(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>Patient Full Name</label>
                    <input
                      type="text"
                      value={vitalsPatientName}
                      onChange={(e) => setVitalsPatientName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Thermometer size={14} style={{ color: '#dc2626' }} />
                    <span>{t.tempLabel}</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={vTemp}
                    onChange={(e) => setVTemp(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Heart size={14} style={{ color: '#0284c7' }} />
                    <span>{t.bpSysLabel}</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={vBpSys}
                    onChange={(e) => setVBpSys(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>{t.bpDiaLabel}</label>
                  <input
                    type="number"
                    required
                    value={vBpDia}
                    onChange={(e) => setVBpDia(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>{t.pulseLabel}</label>
                  <input
                    type="number"
                    required
                    value={vPulse}
                    onChange={(e) => setVPulse(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>{t.spo2Label}</label>
                  <input
                    type="number"
                    required
                    value={vSpO2}
                    onChange={(e) => setVSpO2(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>{t.glucoseLabel}</label>
                  <input
                    type="number"
                    required
                    value={vGlucose}
                    onChange={(e) => setVGlucose(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px', fontSize: '15px' }}
              >
                <Activity size={18} />
                <span>{t.btnSaveVitals}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. TAB 4: LAB INSTRUMENTS & QUALITY CONTROL */}
      {activeTab === 'instruments' && (
        <div>
          <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '16px', color: '#0f172a' }}>{t.instrumentsTitle}</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
              {t.instrumentsDesc}
            </p>
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

      {/* 7. DOCUMENT VIEWER MODAL */}
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
