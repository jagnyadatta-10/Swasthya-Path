import React, { useState } from 'react';
import {
  Users,
  Stethoscope,
  Activity,
  AlertTriangle,
  Pill,
  MapPin,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building2,
  FileText,
  BarChart3,
  Calendar,
  CheckCircle2,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { DemoUser, Language, NetworkQuality } from '../types';
import { storage } from '../utils/storage';

interface AdminPortalProps {
  user: DemoUser;
  networkQuality: NetworkQuality;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
  onBack?: () => void;
}

const enAdmin = {
  cdmoDirectorate: 'Chief District Medical Officer (CDMO) Directorate • Kalahandi, Odisha',
  districtAdminBadge: 'District Program Administrator • Swasthya Path Hub',
  syncTelemetryBtn: 'Sync District Telemetry',
  syncSuccess: 'Synchronized district telemetry with Kalahandi Health Command Center.',
  tabOverview: 'District Program Dashboard',
  tabImpact: 'Rural Health Impact Dashboard',
  tabFacilities: 'Facility & Block Oversight',
  tabAudit: 'District Audit Trail',
  heroTitle: 'Kalahandi District Health Administration',
  heroDesc: 'Real-time oversight of rural tele-triage queues, hospital referrals, essential medicine stock levels, and offline patient synchronization across Kalahandi blocks.',
  activeNode: 'Active Node: DHH Bhawanipatna Hub',
  blocksConnected: '5 Blocks Connected (Junagarh, Dharamgarh, Kesinga, Narla, Bhawanipatna)',
  telemetryTitle: 'DISTRICT TELEHEALTH TELEMETRY (TODAY)',
  demoNote: '*Illustrative demo data • Prototype simulation',
  kpiPatients: 'Registered Patients',
  kpiPatientsSub: 'Across 12 Kalahandi blocks',
  kpiDoctors: 'Active Doctors on Duty',
  kpiDoctorsSub: 'DHH & CHC Tele-OPD Hubs',
  kpiConsults: "Today's Consultations",
  kpiConsultsSub: 'Completed sessions',
  kpiUrgent: 'Priority Red-Flag Cases',
  kpiUrgentSub: 'Immediate CHC escalations',
  kpiReferrals: 'Specialist Referrals',
  kpiReferralsSub: 'Doctor-to-Doctor escalations',
  kpiPharmacy: 'Pharmacy Stock Syncs',
  kpiPharmacySub: 'Jan Aushadhi real-time updates',
  kpiOffline: 'Offline Sessions',
  kpiOfflineSub: 'Accessed in 2G dead-zones',
  kpiSyncQueue: 'Pending Sync Queue',
  kpiSyncQueueSub: 'Awaiting signal recovery',
  impactTitle: 'Rural Healthcare Measurable Impact Dashboard',
  impactDesc: 'Quantified healthcare savings for daily-wage workers and smallholder farmers in Kalahandi, Odisha',
  prototypeSimulation: 'Prototype Simulation • Verified Methodology',
  impactTravelAvoided: 'Unnecessary Travel Avoided',
  impactTravelAvoidedSub: 'Prevented costly 20–40 km bus journeys to district hospital',
  impactWagesSaved: 'Patient Travel & Wages Saved',
  impactWagesSavedSub: 'Avg ₹400 saved per patient (bus fare + daily labor wage)',
  impactWaitReduced: 'Avg OPD Wait Reduction',
  impactWaitReducedSub: 'Reduced from 3.5 hrs physical queue to ~12 min tele-queue',
  impactPharmacyTrips: 'Futile Pharmacy Trips Prevented',
  impactPharmacyTripsSub: 'Stock checked locally before traveling to town',
  impactOfflineAccess: 'Offline Record Accesses',
  impactOfflineAccessSub: 'Medical records available in zero-connectivity village pockets',
  impactEmergencyEscalated: 'Priority Emergencies Escalated',
  impactEmergencyEscalatedSub: 'High-acuity red flags routed straight to 108 ambulance',
  facilitiesTitle: 'Kalahandi District Facility Network',
  facilitiesDesc: 'District Hospitals, CHCs, PHCs, and Jan Aushadhi pharmacies participating in the Swasthya Path network',
  contact: 'Contact',
  services: 'Services',
  auditTitle: 'District Audit Log & Governance Trail',
  auditDesc: 'Immutable activity history recording clinical decisions, prescription generation, queue entries, and consent updates',
  authorizedActor: 'Authorized Actor',
  verifiedEvent: 'Verified Event'
};

const orAdmin = {
  cdmoDirectorate: 'ମୁଖ୍ୟ ଜିଲ୍ଲା ଚିକିତ୍ସାଧିକାରୀ (CDMO) ନିର୍ଦ୍ଦେଶାଳୟ • କଳାହାଣ୍ଡି, ଓଡ଼ିଶା',
  districtAdminBadge: 'ଜିଲ୍ଲା କାର୍ଯ୍ୟକ୍ରମ ପ୍ରଶାସକ • ସ୍ୱାସ୍ଥ୍ୟ ପଥ କେନ୍ଦ୍ର',
  syncTelemetryBtn: 'ଜିଲ୍ଲା ଟେଲିମେଟ୍ରି ସିଙ୍କ୍ କରନ୍ତୁ',
  syncSuccess: 'କଳାହାଣ୍ଡି ସ୍ୱାସ୍ଥ୍ୟ କମାଣ୍ଡ ସେଣ୍ଟର୍ ସହିତ ଜିଲ୍ଲା ଟେଲିମେଟ୍ରି ସିଙ୍କ୍ ହୋଇଛି।',
  tabOverview: 'ଜିଲ୍ଲା କାର୍ଯ୍ୟକ୍ରମ ଡ୍ୟାସବୋର୍ଡ',
  tabImpact: 'ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଭାବ',
  tabFacilities: 'ସ୍ୱାସ୍ଥ୍ୟକେନ୍ଦ୍ର ଓ ବ୍ଲକ୍ ତଦାରଖ',
  tabAudit: 'ଜିଲ୍ଲା ଅଡିଟ୍ ଟ୍ରେଲ୍',
  heroTitle: 'କଳାହାଣ୍ଡି ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶାସନ',
  heroDesc: 'କଳାହାଣ୍ଡି ବ୍ଲକ୍‌ଗୁଡ଼ିକରେ ଟେଲି-ଟ୍ରିଏଜ୍ କ୍ୟୁ, ଡାକ୍ତରଖାନା ରେଫରାଲ୍, ଜରୁରୀ ଔଷଧ ଷ୍ଟକ୍ ଏବଂ ଅଫଲାଇନ୍ ରୋଗୀ ସିଙ୍କ୍‌ର ଲାଇଭ୍ ତଦାରଖ।',
  activeNode: 'ସକ୍ରିୟ ନୋଡ୍: DHH ଭବାନୀପାଟଣା କେନ୍ଦ୍ର',
  blocksConnected: '୫ଟି ବ୍ଲକ୍ ସଂଯୁକ୍ତ (ଜୁନାଗଡ଼, ଧର୍ମଗଡ଼, କେସିଙ୍ଗା, ନର୍ଲା, ଭବାନୀପାଟଣା)',
  telemetryTitle: 'ଜିଲ୍ଲା ଟେଲିହେଲ୍ଥ ତଥ୍ୟ (ଆଜି)',
  demoNote: '*ଉଦାହରଣମୂଳକ ଡେମୋ ତଥ୍ୟ • ପ୍ରୋଟୋଟାଇପ୍ ସିମୁଲେସନ୍',
  kpiPatients: 'ପଞ୍ଜୀକୃତ ରୋଗୀ',
  kpiPatientsSub: '୧୨ଟି କଳାହାଣ୍ଡି ବ୍ଲକ୍ରେ',
  kpiDoctors: 'ଡ୍ୟୁଟିରେ ଥିବା ଡାକ୍ତର',
  kpiDoctorsSub: 'DHH ଏବଂ CHC ଟେଲି-OPD କେନ୍ଦ୍ର',
  kpiConsults: 'ଆଜିର ପରାମର୍ଶ',
  kpiConsultsSub: 'ସମ୍ପନ୍ନ ସେସନ୍',
  kpiUrgent: 'ଜରୁରୀ ରେଡ୍-ଫ୍ଲାଗ୍ ମାମଲା',
  kpiUrgentSub: 'ତୁରନ୍ତ CHC ସ୍ଥାନାନ୍ତର',
  kpiReferrals: 'ବିଶେଷଜ୍ଞ ରେଫରାଲ୍',
  kpiReferralsSub: 'ଡାକ୍ତର-ଠାରୁ-ଡାକ୍ତର ପରାମର୍ଶ',
  kpiPharmacy: 'ଔଷଧ ଷ୍ଟକ୍ ସିଙ୍କ୍',
  kpiPharmacySub: 'ଜନ ଔଷଧି ଲାଇଭ୍ ଅପଡେଟ୍',
  kpiOffline: 'ଅଫଲାଇନ୍ ସେସନ୍',
  kpiOfflineSub: '୨G ନେଟୱାର୍କ ବିହୀନ ଅଞ୍ଚଳରେ',
  kpiSyncQueue: 'ବାକି ଥିବା ସିଙ୍କ୍ କ୍ୟୁ',
  kpiSyncQueueSub: 'ସିଗ୍ନାଲ୍ ପ୍ରତୀକ୍ଷାରେ',
  impactTitle: 'ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟସେବା ମାପଯୋଗ୍ୟ ପ୍ରଭାବ ଡ୍ୟାସବୋର୍ଡ',
  impactDesc: 'କଳାହାଣ୍ଡି, ଓଡ଼ିଶାର ଦିନମଜୁରିଆ ଏବଂ କ୍ଷୁଦ୍ର ଚାଷୀଙ୍କ ପାଇଁ ସ୍ୱାସ୍ଥ୍ୟ ଖର୍ଚ୍ଚ ଓ ସମୟ ସଞ୍ଚୟର ହିସାବ',
  prototypeSimulation: 'ପ୍ରୋଟୋଟାଇପ୍ ସିମୁଲେସନ୍ • ପ୍ରମାଣିତ ପଦ୍ଧତି',
  impactTravelAvoided: 'ଅନାବଶ୍ୟକ ଯାତ୍ରା ନିବାରଣ',
  impactTravelAvoidedSub: 'ଜିଲ୍ଲା ଡାକ୍ତରଖାନାକୁ ୨୦-୪୦ କିମି ବସ୍ ଯାତ୍ରା ରୋକାଗଲା',
  impactWagesSaved: 'ରୋଗୀଙ୍କ ଯାତ୍ରା ଓ ମଜୁରୀ ସଞ୍ଚୟ',
  impactWagesSavedSub: 'ହାରାହାରି ରୋଗୀ ପିଛା ₹୪୦୦ ସଞ୍ଚୟ (ବସ୍ ଭଡ଼ା + ଦୈନିକ ମଜୁରୀ)',
  impactWaitReduced: 'ହାରାହାରି OPD ଅପେକ୍ଷା ହ୍ରାସ',
  impactWaitReducedSub: '୩.୫ ଘଣ୍ଟା ଲାଇନ୍ ଅପେକ୍ଷାରୁ ~୧୨ ମିନିଟ୍ ଟେଲି-କ୍ୟୁ',
  impactPharmacyTrips: 'ବୃଥା ଔଷଧ ଦୋକାନ ଯାତ୍ରା ରୋକାଗଲା',
  impactPharmacyTripsSub: 'ସହରକୁ ଯିବା ପୂର୍ବରୁ ଗାଁରେ ଷ୍ଟକ୍ ଯାଞ୍ଚ ହେଲା',
  impactOfflineAccess: 'ଅଫଲାଇନ୍ ରେକର୍ଡ ଦେଖାଗଲା',
  impactOfflineAccessSub: 'ଶୂନ୍ୟ ନେଟୱାର୍କ ଥିବା ଗାଁରେ ମେଡିକାଲ୍ ରେକର୍ଡ ଉପଲବ୍ଧ',
  impactEmergencyEscalated: 'ଜରୁରୀକାଳୀନ ସ୍ଥିତି ତ୍ୱରାନ୍ୱିତ',
  impactEmergencyEscalatedSub: 'ଗୁରୁତର ରେଡ୍-ଫ୍ଲାଗ୍ ସିଧାସଳଖ ୧୦୮ ଆମ୍ବୁଲାନ୍ସକୁ ପଠାଗଲା',
  facilitiesTitle: 'କଳାହାଣ୍ଡି ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟକେନ୍ଦ୍ର ନେଟୱାର୍କ',
  facilitiesDesc: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ ନେଟୱାର୍କରେ ଅଂଶଗ୍ରହଣ କରୁଥିବା ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, CHC, PHC ଏବଂ ଜନ ଔଷଧି କେନ୍ଦ୍ରଗୁଡ଼ିକ',
  contact: 'ଯୋଗାଯୋଗ',
  services: 'ସେବାଗୁଡ଼ିକ',
  auditTitle: 'ଜିଲ୍ଲା ଅଡିଟ୍ ଲଗ୍ ଓ ନିରୀକ୍ଷଣ ଟ୍ରେଲ୍',
  auditDesc: 'ଚିକିତ୍ସା ନିଷ୍ପତ୍ତି, ପ୍ରେସକ୍ରିପସନ୍ ତିଆରି, କ୍ୟୁ ପ୍ରବେଶ ଏବଂ ସମ୍ମତି ରେକର୍ଡ',
  authorizedActor: 'ଅଧିକୃତ କର୍ମଚାରୀ',
  verifiedEvent: 'ପ୍ରମାଣିତ ଇଭେଣ୍ଟ'
};

const hiAdmin = {
  cdmoDirectorate: 'मुख्य जिला चिकित्सा अधिकारी (CDMO) निदेशालय • कालाहांडी, ओडिशा',
  districtAdminBadge: 'जिला कार्यक्रम प्रशासक • स्वास्थ्य पथ हब',
  syncTelemetryBtn: 'ज़िला टेलीमेट्री सिंक करें',
  syncSuccess: 'कालाहांडी स्वास्थ्य कमांड सेंटर के साथ जिला टेलीमेट्री सिंक हुई।',
  tabOverview: 'ज़िला कार्यक्रम डैशबोर्ड',
  tabImpact: 'ग्रामीण स्वास्थ्य प्रभाव',
  tabFacilities: 'सुविधा एवं ब्लॉक निगरानी',
  tabAudit: 'ज़िला ऑडिट ट्रेल',
  heroTitle: 'कालाहांडी ज़िला स्वास्थ्य प्रशासन',
  heroDesc: 'कालाहांडी ब्लॉकों में टेली-ट्राएज कतारों, अस्पताल रेफरल, आवश्यक दवा स्टॉक और ऑफ़लाइन मरीज़ सिंकिंग की रीयल-टाइम निगरानी।',
  activeNode: 'सक्रिय नोड: DHH भवानीपटना हब',
  blocksConnected: '5 ब्लॉक जुड़े (जूनागढ़, धर्मगढ़, केसिंगा, नरला, भवानीपटना)',
  telemetryTitle: 'ज़िला टेलीहेल्थ टेलीमेट्री (आज)',
  demoNote: '*उदाहरणात्मक डेमो डेटा • प्रोटोटाइप सिमुलेशन',
  kpiPatients: 'पंजीकृत मरीज़',
  kpiPatientsSub: '12 कालाहांडी ब्लॉकों में',
  kpiDoctors: 'ड्यूटी पर सक्रिय डॉक्टर',
  kpiDoctorsSub: 'DHH एवं CHC टेली-OPD हब',
  kpiConsults: 'आज के परामर्श',
  kpiConsultsSub: 'पूर्ण सत्र',
  kpiUrgent: 'प्राथमिकता रेड-फ्लैग मामले',
  kpiUrgentSub: 'तत्काल CHC अग्रेषण',
  kpiReferrals: 'विशेषज्ञ रेफरल',
  kpiReferralsSub: 'डॉक्टर-से-डॉक्टर अग्रेषण',
  kpiPharmacy: 'फार्मेसी स्टॉक सिंक',
  kpiPharmacySub: 'जन औषधि लाइव अपडेट',
  kpiOffline: 'ऑफ़लाइन सत्र',
  kpiOfflineSub: '2G नो-सिग्नल ज़ोन में एक्सेस',
  kpiSyncQueue: 'लंबित सिंक कतार',
  kpiSyncQueueSub: 'सिग्नल पुनर्प्राप्ति की प्रतीक्षा',
  impactTitle: 'ग्रामीण स्वास्थ्य सेवा मापने योग्य प्रभाव डैशबोर्ड',
  impactDesc: 'कालाहांडी, ओडिशा में दिहाड़ी मजदूरों और छोटे किसानों के लिए स्वास्थ्य बचत की गणना',
  prototypeSimulation: 'प्रोटोटाइप सिमुलेशन • सत्यापित पद्धति',
  impactTravelAvoided: 'अनावश्यक यात्रा की रोकथाम',
  impactTravelAvoidedSub: 'जिला अस्पताल तक 20-40 किमी बस यात्रा से बचाव',
  impactWagesSaved: 'मरीज़ यात्रा एवं मजदूरी बचत',
  impactWagesSavedSub: 'औसत ₹400 प्रति मरीज़ बचत (बस किराया + दैनिक मजदूरी)',
  impactWaitReduced: 'औसत ओपीडी प्रतीक्षा में कमी',
  impactWaitReducedSub: '3.5 घंटे भौतिक कतार से घटकर ~12 मिनट टेली-कतार',
  impactPharmacyTrips: 'व्यर्थ फार्मेसी यात्रा रोकी गई',
  impactPharmacyTripsSub: 'शहर जाने से पहले गाँव में स्टॉक की जाँच हुई',
  impactOfflineAccess: 'ऑफ़लाइन रिकॉर्ड एक्सेस',
  impactOfflineAccessSub: 'शून्य कनेक्टिविटी वाले गाँवों में मेडिकल रिकॉर्ड उपलब्ध',
  impactEmergencyEscalated: 'प्राथमिकता आपात स्थिति अग्रेषित',
  impactEmergencyEscalatedSub: 'गंभीर रेड-फ्लैग सीधे 108 एम्बुलेंस को भेजे गए',
  facilitiesTitle: 'कालाहांडी ज़िला स्वास्थ्य सुविधा नेटवर्क',
  facilitiesDesc: 'स्वास्थ्य पथ नेटवर्क में भाग लेने वाले जिला अस्पताल, CHC, PHC और जन औषधि केंद्र',
  contact: 'संपर्क',
  services: 'सेवाएं',
  auditTitle: 'ज़िला ऑडिट लॉग एवं गवर्नेंस ट्रेल',
  auditDesc: 'नैदानिक निर्णय, पर्ची निर्माण, कतार प्रविष्टि एवं सहमति का अपरिवर्तनीय इतिहास',
  authorizedActor: 'अधिकृत कर्मी',
  verifiedEvent: 'सत्यापित इवेंट'
};

const ADMIN_I18N: Record<string, any> = {
  English: enAdmin,
  'ଓଡ଼ିଆ': orAdmin,
  'हिन्दी': hiAdmin,
  en: enAdmin,
  or: orAdmin,
  hi: hiAdmin
};

export const AdminPortal: React.FC<AdminPortalProps> = ({ user, networkQuality, lang, onSelectLang, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'impact' | 'facilities' | 'audit'>('overview');
  const [syncedAlert, setSyncedAlert] = useState('');

  const t = ADMIN_I18N[lang] || ADMIN_I18N.English || ADMIN_I18N.en;
  const metrics = storage.getMetrics();
  const queue = storage.getTriageQueue();
  const appointments = storage.getAppointments();
  const medicines = storage.getMedicines();
  const facilities = storage.getFacilities();
  const auditLog = storage.getAuditLog();
  const specialistRequests = storage.getSpecialistRequests();

  const handleSimulateSync = () => {
    setSyncedAlert(t.syncSuccess);
    storage.addAuditLog('District health telemetry synchronized', user.name);
    setTimeout(() => setSyncedAlert(''), 3000);
  };

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* Admin Profile Bar */}
      <div className="user-bar" style={{ borderRadius: '14px', marginBottom: '18px' }}>
        <div className="user-profile">
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#047857',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 800
            }}
          >
            HA
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {t.cdmoDirectorate}
            </div>
            <span className="user-badge" style={{ background: '#ecfdf5', color: '#047857' }}>
              {t.districtAdminBadge}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {onSelectLang && (
            <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '8px', padding: '2px', border: '1px solid #cbd5e1' }}>
              {(['English', 'ଓଡ଼ିଆ', 'हिन्दी'] as Language[]).map((l) => (
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
                    background: lang === l ? '#047857' : 'transparent',
                    color: lang === l ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease'
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
            onClick={handleSimulateSync}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <RefreshCw size={13} /> {t.syncTelemetryBtn}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <nav className="tabs-scroll-wrap" aria-label="Admin navigation">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          {t.tabOverview}
        </button>
        <button
          className={`tab-btn ${activeTab === 'impact' ? 'active' : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          {t.tabImpact}
        </button>
        <button
          className={`tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
          onClick={() => setActiveTab('facilities')}
        >
          {t.tabFacilities} ({facilities.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          {t.tabAudit} ({auditLog.length})
        </button>
      </nav>

      {/* Universal Back Navigation for Admin Tabs */}
      {activeTab !== 'overview' && (
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
            onClick={() => setActiveTab('overview')}
            className="btn btn-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '13px',
              color: '#047857',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              padding: '7px 14px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>
              {lang === 'ଓଡ଼ିଆ' ? '← ଜିଲ୍ଲା ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ' : lang === 'हिन्दी' ? '← मुख्य ज़िला डैशबोर्ड पर वापस जाएं' : '← Back to District Dashboard'}
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

      {syncedAlert && (
        <div className="alert ok" style={{ marginBottom: '16px' }}>
          <CheckCircle2 size={16} /> {syncedAlert}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: DISTRICT OVERVIEW (Prompt Section 35) */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div>
          <div className="hero-card" style={{ borderRadius: '16px', marginBottom: '20px' }}>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroDesc}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                {t.activeNode}
              </span>
              <span className="badge badge-blue" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                {t.blocksConnected}
              </span>
            </div>
          </div>

          {/* Section 35 KPI Grid */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', color: 'var(--navy-mid)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                {t.telemetryTitle}
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                {t.demoNote}
              </span>
            </div>

            <div className="kpis-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              <div className="kpi-card">
                <span className="kpi-label">{t.kpiPatients}</span>
                <div className="kpi-val" style={{ color: '#0284c7' }}>1,420</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.kpiPatientsSub}</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiDoctors}</span>
                <div className="kpi-val" style={{ color: '#059669' }}>18</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.kpiDoctorsSub}</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiConsults}</span>
                <div className="kpi-val" style={{ color: '#0d70d4' }}>42</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.kpiConsultsSub}</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiUrgent}</span>
                <div className="kpi-val" style={{ color: '#b42318' }}>{queue.filter(q => q.urgency === 'urgent').length + 6}</div>
                <span style={{ fontSize: '12px', color: '#b42318' }}>{t.kpiUrgentSub}</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiReferrals}</span>
                <div className="kpi-val" style={{ color: '#7c3aed' }}>{specialistRequests.length + 13}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.kpiReferralsSub}</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiPharmacy}</span>
                <div className="kpi-val" style={{ color: '#d97706' }}>36</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.kpiPharmacySub}</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiOffline}</span>
                <div className="kpi-val" style={{ color: '#64748b' }}>84</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.kpiOfflineSub}</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiSyncQueue}</span>
                <div className="kpi-val" style={{ color: '#0284c7' }}>3</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.kpiSyncQueueSub}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: RURAL HEALTH IMPACT DASHBOARD (Prompt Section 36) */}
      {/* ======================================================== */}
      {activeTab === 'impact' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2>{t.impactTitle}</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                {t.impactDesc}
              </p>
            </div>
            <span className="badge badge-green" style={{ fontSize: '11px' }}>
              {t.prototypeSimulation}
            </span>
          </div>

          <div className="kpis-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '20px' }}>
            <div className="kpi-card" style={{ borderLeft: '4px solid #059669' }}>
              <span className="kpi-label">{t.impactTravelAvoided}</span>
              <div className="kpi-val" style={{ color: '#059669' }}>128 Cases</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {t.impactTravelAvoidedSub}
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #0284c7' }}>
              <span className="kpi-label">{t.impactWagesSaved}</span>
              <div className="kpi-val" style={{ color: '#0284c7' }}>₹ 51,200</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {t.impactWagesSavedSub}
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #d97706' }}>
              <span className="kpi-label">{t.impactWaitReduced}</span>
              <div className="kpi-val" style={{ color: '#d97706' }}>44.5% Less</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {t.impactWaitReducedSub}
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #7c3aed' }}>
              <span className="kpi-label">{t.impactPharmacyTrips}</span>
              <div className="kpi-val" style={{ color: '#7c3aed' }}>210 Checks</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {t.impactPharmacyTripsSub}
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #0891b2' }}>
              <span className="kpi-label">{t.impactOfflineAccess}</span>
              <div className="kpi-val" style={{ color: '#0891b2' }}>164 Times</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {t.impactOfflineAccessSub}
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #dc2626' }}>
              <span className="kpi-label">{t.impactEmergencyEscalated}</span>
              <div className="kpi-val" style={{ color: '#dc2626' }}>12 Cases</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {t.impactEmergencyEscalatedSub}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FACILITY & BLOCK OVERSIGHT */}
      {/* ======================================================== */}
      {activeTab === 'facilities' && (
        <div className="card">
          <h2>{t.facilitiesTitle}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
            {t.facilitiesDesc}
          </p>

          <div className="data-list">
            {facilities.map((fac) => (
              <div key={fac.id} className="data-item">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px' }}>{fac.name}</strong>
                    <span className="badge badge-blue">{fac.type}</span>
                    <span className="badge badge-green">{fac.block} Block</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {fac.address} • {t.contact}: <strong>{fac.phone}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>
                    {t.services}: {fac.services.join(' • ')}
                  </div>
                </div>

                <div>
                  <span className="badge badge-green">{fac.referralStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: AUDIT TRAIL */}
      {/* ======================================================== */}
      {activeTab === 'audit' && (
        <div className="card">
          <h2>{t.auditTitle}</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
            {t.auditDesc}
          </p>

          <div className="data-list">
            {auditLog.map((log) => (
              <div key={log.id} className="data-item" style={{ fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#0284c7', fontFamily: 'monospace', fontWeight: 700 }}>
                    {log.time}
                  </span>
                  <div>
                    <strong style={{ color: '#0f172a' }}>{log.action}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.authorizedActor}: {log.actor}</div>
                  </div>
                </div>

                <span className="badge badge-gray">{t.verifiedEvent}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
