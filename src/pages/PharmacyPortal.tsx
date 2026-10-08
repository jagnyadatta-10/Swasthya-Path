import React, { useState, useEffect } from 'react';
import { Pill, CheckCircle2, AlertTriangle, Clock, RefreshCw, Plus, Minus, Check, ShieldCheck, ClipboardList, User, Package, Bell, MapPin, ArrowLeft, Search, Calendar, AlertOctagon } from 'lucide-react';
import { DemoUser, Language, MedicineItem, PharmacyRequest, NetworkQuality, PharmacyStoreStatus } from '../types';
import { storage } from '../utils/storage';
import { getTranslation } from '../utils/translations';

interface PharmacyPortalProps {
  user: DemoUser;
  networkQuality: NetworkQuality;
  lang: Language;
  onSelectLang?: (lang: Language) => void;
}

const enPharmacy = {
  partnerPharmacy: 'Jan Aushadhi Partner Pharmacy',
  chemistLicense: 'Licensed Chemist • Drug Lic: KLH-2024-8192',
  broadcastingLive: 'Broadcasting Real-Time Stock',
  offlineQueued: 'Offline: Changes Queued',
  tabHome: 'Dashboard',
  tabStock: 'Medicine Inventory',
  tabRequests: 'Patient Requests',
  tabProfile: 'Pharmacy Profile',
  heroTitle: 'Pharmacy Partner Portal',
  heroDesc: 'Publish real-time essential medicine inventory for Kalahandi district so rural villagers and daily-wage workers can verify availability before traveling 15–30km to town.',
  manageStockBtn: 'Manage Stock Inventory',
  viewRequestsBtn: 'View Patient Hold Requests',
  liveSectionTitle: 'Live Inventory & Patient Requests',
  kpiAvailable: 'Available Medicines',
  kpiAvailableSub: 'In stock ready for dispensing',
  kpiLimited: 'Low Stock',
  kpiLimitedSub: 'Replenishment recommended',
  kpiOutOfStock: 'Out of Stock',
  kpiOutOfStockSub: 'Prevents futile patient travel',
  kpiRequests: 'Patient Hold Requests',
  kpiRequestsSub: 'Awaiting chemist confirmation',
  partnerNoticeTitle: 'Partner Participation Notice',
  partnerNoticeDesc: 'Stock information depends on partner updates and may change. When updated, availability updates broadcast directly to patients across Kalahandi blocks in real time.',
  stockMgmtTitle: 'Medicine Stock Management',
  stockMgmtDesc: 'Update medicine status instantly. Changes are broadcast to the Patient portal in real time.',
  category: 'Category',
  price: 'Price',
  block: 'Block',
  availableUnits: 'Available Units',
  lastUpdated: 'Last updated',
  markAvailable: 'Mark Available',
  markLimited: 'Mark Limited',
  markOutOfStock: 'Mark Out of Stock',
  patientRequestsTitle: 'Patient Medicine Availability Requests',
  patientRequestsDesc: 'Rural patients requesting medicine reservation before traveling from their village (Prompt Section 30)',
  pending: 'Pending',
  requestedMedicine: 'Requested Medicine',
  timeReceived: 'Time Received',
  preferred: 'Preferred',
  confirmAvailable: 'Confirm Available',
  confirmedAvailable: 'Confirmed Available',
  profileTitle: 'Pharmacy Profile & Partner Credentials',
  profileSubtitle: 'Registered Government Jan Aushadhi & District Health Society Retailer',
  pharmacyName: 'Pharmacy Name',
  drugLicense: 'Drug License Number',
  addressBlock: 'Address & Block',
  operatingHours: 'Operating Hours',
  operatingHoursVal: '8:00 AM – 9:30 PM (Daily)',
  addressVal: 'College Road, Bhawanipatna, Kalahandi, Odisha',
  navHome: 'Dashboard',
  navStock: 'Stock',
  navRequests: 'Requests',
  navProfile: 'Profile'
};

const orPharmacy = {
  partnerPharmacy: 'ଜନ ଔଷଧି ପାର୍ଟନର ଔଷଧାଳୟ',
  chemistLicense: 'ଲାଇସେନ୍ସପ୍ରାପ୍ତ କେମିଷ୍ଟ • ଡ୍ରଗ୍ ଲାଇସେନ୍ସ: KLH-2024-8192',
  broadcastingLive: 'ଲାଇଭ୍ ଔଷଧ ଷ୍ଟକ୍ ପ୍ରସାରିତ ହେଉଛି',
  offlineQueued: 'ଅଫଲାଇନ୍: ପରିବର୍ତ୍ତନ କ୍ୟୁରେ ରହିଛି',
  tabHome: 'ଡ୍ୟାସବୋର୍ଡ',
  tabStock: 'ଔଷଧ ତାଲିକା',
  tabRequests: 'ରୋଗୀଙ୍କ ଅନୁରୋଧ',
  tabProfile: 'ଫାର୍ମାସୀ ପ୍ରୋଫାଇଲ୍',
  heroTitle: 'ଔଷଧ ଭଣ୍ଡାର ପାର୍ଟନର ପୋର୍ଟାଲ',
  heroDesc: 'କଳାହାଣ୍ଡି ଜିଲ୍ଲାର ଗ୍ରାମୀଣ ଲୋକ ଓ ଦିନମଜୁରିଆଙ୍କ ପାଇଁ ଲାଇଭ୍ ଜରୁରୀ ଔଷଧ ଉପଲବ୍ଧତା ପ୍ରକାଶ କରନ୍ତୁ, ଯାହାଦ୍ୱାରା ସେମାନେ ୧୫-୩୦ କିମି ସହରକୁ ଆସିବା ପୂର୍ବରୁ ଯାଞ୍ଚ କରିପାରିବେ।',
  manageStockBtn: 'ଔଷଧ ଷ୍ଟକ୍ ପରିଚାଳନା',
  viewRequestsBtn: 'ରୋଗୀ ଅନୁରୋଧ ଦେଖନ୍ତୁ',
  liveSectionTitle: 'ଲାଇଭ୍ ଇନଭେଣ୍ଟୋରୀ ଏବଂ ରୋଗୀ ଅନୁରୋଧ',
  kpiAvailable: 'ଉପଲବ୍ଧ ଔଷଧ',
  kpiAvailableSub: 'ବଣ୍ଟନ ପାଇଁ ଷ୍ଟକ୍ରେ ଉପଲବ୍ଧ',
  kpiLimited: 'ସୀମିତ ଷ୍ଟକ୍',
  kpiLimitedSub: 'ପୁନଃପୂରଣ ସୁପାରିଶ କରାଯାଇଛି',
  kpiOutOfStock: 'ଷ୍ଟକ୍ ଶେଷ',
  kpiOutOfStockSub: 'ବୃଥା ଯାତ୍ରାକୁ ରୋକିଥାଏ',
  kpiRequests: 'ରୋଗୀ ଔଷଧ ଅନୁରୋଧ',
  kpiRequestsSub: 'କେମିଷ୍ଟ ନିଶ୍ଚିତକରଣକୁ ଅପେକ୍ଷା',
  partnerNoticeTitle: 'ପାର୍ଟନର ସହଭାଗିତା ସୂଚନା',
  partnerNoticeDesc: 'ଷ୍ଟକ୍ ସୂଚନା ପାର୍ଟନର ଅପଡେଟ୍ ଉପରେ ନିର୍ଭର କରେ। ଅପଡେଟ୍ ହେବା ମାତ୍ରେ କଳାହାଣ୍ଡି ବ୍ଲକ୍‌ର ରୋଗୀଙ୍କ ନିକଟକୁ ସିଧାସଳଖ ପହଞ୍ଚିଥାଏ।',
  stockMgmtTitle: 'ଔଷଧ ଷ୍ଟକ୍ ପରିଚାଳନା',
  stockMgmtDesc: 'ତୁରନ୍ତ ଔଷଧର ସ୍ଥିତି ଅପଡେଟ୍ କରନ୍ତୁ। ପରିବର୍ତ୍ତନ ରୋଗୀ ପୋର୍ଟାଲରେ ତୁରନ୍ତ ଦେଖାଯିବ।',
  category: 'ବିଭାଗ',
  price: 'ମୂଲ୍ୟ',
  block: 'ବ୍ଲକ୍',
  availableUnits: 'ଉପଲବ୍ଧ ୟୁନିଟ୍',
  lastUpdated: 'ଶେଷ ଅପଡେଟ୍',
  markAvailable: 'ଉପଲବ୍ଧ କରନ୍ତୁ',
  markLimited: 'ସୀମିତ କରନ୍ତୁ',
  markOutOfStock: 'ଶେଷ କରନ୍ତୁ',
  patientRequestsTitle: 'ରୋଗୀ ଔଷଧ ଉପଲବ୍ଧତା ଅନୁରୋଧ',
  patientRequestsDesc: 'ଗାଁରୁ ବାହାରିବା ପୂର୍ବରୁ ଔଷଧ ସଂରକ୍ଷଣ ପାଇଁ ଗ୍ରାମୀଣ ରୋଗୀଙ୍କ ଅନୁରୋଧ',
  pending: 'ବାକି ଅଛି',
  requestedMedicine: 'ଅନୁରୋଧିତ ଔଷଧ',
  timeReceived: 'ପ୍ରାପ୍ତ ସମୟ',
  preferred: 'ପସନ୍ଦିତ କେନ୍ଦ୍ର',
  confirmAvailable: 'ଉପଲବ୍ଧ ନିଶ୍ଚିତ କରନ୍ତୁ',
  confirmedAvailable: 'ଉପଲବ୍ଧ ନିଶ୍ଚିତ ହୋଇଛି',
  profileTitle: 'ଫାର୍ମାସୀ ପ୍ରୋଫାଇଲ୍ ଏବଂ ପାର୍ଟନର ପ୍ରମାଣପତ୍ର',
  profileSubtitle: 'ପଞ୍ଜୀକୃତ ସରକାରୀ ଜନ ଔଷଧି ଏବଂ ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ସମିତି ବିକ୍ରେତା',
  pharmacyName: 'ଫାର୍ମାସୀ ନାମ',
  drugLicense: 'ଡ୍ରଗ୍ ଲାଇସେନ୍ସ ନମ୍ବର',
  addressBlock: 'ଠିକଣା ଓ ବ୍ଲକ୍',
  operatingHours: 'ଖୋଲିବା ସମୟ',
  operatingHoursVal: 'ସକାଳ ୮:୦୦ – ରାତି ୯:୩୦ (ପ୍ରତିଦିନ)',
  addressVal: 'କଲେଜ ରୋଡ୍, ଭବାନୀପାଟଣା, କଳାହାଣ୍ଡି, ଓଡ଼ିଶା',
  navHome: 'ଡ୍ୟାସବୋର୍ଡ',
  navStock: 'ଷ୍ଟକ୍',
  navRequests: 'ଅନୁରୋଧ',
  navProfile: 'ପ୍ରୋଫାଇଲ୍'
};

const hiPharmacy = {
  partnerPharmacy: 'जन औषधि पार्टनर फार्मेसी',
  chemistLicense: 'लाइसेंस प्राप्त केमिस्ट • ड्रग लाइसेंस: KLH-2024-8192',
  broadcastingLive: 'लाइव स्टॉक प्रसारित हो रहा है',
  offlineQueued: 'ऑफ़लाइन: परिवर्तन कतारबद्ध हैं',
  tabHome: 'डैशबोर्ड',
  tabStock: 'दवा सूची',
  tabRequests: 'मरीज़ अनुरोध',
  tabProfile: 'फार्मेसी प्रोफाइल',
  heroTitle: 'फार्मेसी पार्टनर पोर्टल',
  heroDesc: 'कालाहांडी जिले के लिए आवश्यक दवाओं का लाइव स्टॉक प्रकाशित करें ताकि ग्रामीण और दिहाड़ी मजदूर 15-30 किमी दूर आने से पहले उपलब्धता जांच सकें।',
  manageStockBtn: 'दवा स्टॉक प्रबंधित करें',
  viewRequestsBtn: 'मरीज़ अनुरोध देखें',
  liveSectionTitle: 'लाइव इन्वेंटरी एवं मरीज़ अनुरोध',
  kpiAvailable: 'उपलब्ध दवाएं',
  kpiAvailableSub: 'वितरण हेतु स्टॉक में उपलब्ध',
  kpiLimited: 'सीमित स्टॉक',
  kpiLimitedSub: 'पुनर्प्राप्ति अनुशंसित',
  kpiOutOfStock: 'स्टॉक समाप्त',
  kpiOutOfStockSub: 'व्यर्थ यात्रा से बचाव',
  kpiRequests: 'मरीज़ होल्ड अनुरोध',
  kpiRequestsSub: 'केमिस्ट पुष्टि की प्रतीक्षा',
  partnerNoticeTitle: 'पार्टनर भागीदारी सूचना',
  partnerNoticeDesc: 'स्टॉक जानकारी पार्टनर अपडेट पर निर्भर करती है। अपडेट होने पर कालाहांडी के सभी ब्लॉक्स में मरीजों को तुरंत जानकारी प्रसारित होती है।',
  stockMgmtTitle: 'दवा स्टॉक प्रबंधन',
  stockMgmtDesc: 'दवा की स्थिति तुरंत अपडेट करें। परिवर्तन मरीज़ पोर्टल पर तुरंत दिखाई देते हैं।',
  category: 'श्रेणी',
  price: 'मूल्य',
  block: 'ब्लॉक',
  availableUnits: 'उपलब्ध इकाइयां',
  lastUpdated: 'अंतिम अपडेट',
  markAvailable: 'उपलब्ध करें',
  markLimited: 'सीमित करें',
  markOutOfStock: 'समाप्त करें',
  patientRequestsTitle: 'मरीज़ दवा उपलब्धता अनुरोध',
  patientRequestsDesc: 'गाँव से निकलने से पहले दवा आरक्षण हेतु ग्रामीण मरीजों के अनुरोध',
  pending: 'लंबित',
  requestedMedicine: 'अनुरोधित दवा',
  timeReceived: 'प्राप्त समय',
  preferred: 'पसंदीदा केंद्र',
  confirmAvailable: 'उपलब्धता की पुष्टि करें',
  confirmedAvailable: 'उपलब्धता की पुष्टि हुई',
  profileTitle: 'फार्मेसी प्रोफाइल एवं पार्टनर क्रेडेंशियल',
  profileSubtitle: 'पंजीकृत सरकारी जन औषधि एवं जिला स्वास्थ्य समिति विक्रेता',
  pharmacyName: 'फार्मेसी का नाम',
  drugLicense: 'ड्रग लाइसेंस संख्या',
  addressBlock: 'पता एवं ब्लॉक',
  operatingHours: 'खुलने का समय',
  operatingHoursVal: 'सुबह 8:00 – रात 9:30 (प्रतिदिन)',
  addressVal: 'कॉलेज रोड, भवानीपटना, कालाहांडी, ओडिशा',
  navHome: 'डैशबोर्ड',
  navStock: 'स्टॉक',
  navRequests: 'अनुरोध',
  navProfile: 'प्रोफाइल'
};

const PHARMACY_I18N: Record<string, any> = {
  English: enPharmacy,
  'ଓଡ଼ିଆ': orPharmacy,
  'हिन्दी': hiPharmacy,
  en: enPharmacy,
  or: orPharmacy,
  hi: hiPharmacy
};

export const PharmacyPortal: React.FC<PharmacyPortalProps> = ({ user, networkQuality, lang, onSelectLang }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'stock' | 'requests' | 'profile'>('home');
  const [tabHistory, setTabHistory] = useState<('home' | 'stock' | 'requests' | 'profile')[]>(['home']);

  const navigateToTab = (tab: 'home' | 'stock' | 'requests' | 'profile') => {
    setTabHistory(prev => (prev[prev.length - 1] === tab ? prev : [...prev, tab]));
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const nextHist = [...tabHistory];
      nextHist.pop();
      const prev = nextHist[nextHist.length - 1];
      setTabHistory(nextHist);
      setActiveTab(prev);
    } else {
      setActiveTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderBackButton = (customLabel?: string) => (
    <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
      <button
        type="button"
        onClick={handleGoBack}
        className="btn btn-secondary"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '10px',
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          color: '#0f172a',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}
        title="Go back to previous page"
      >
        <ArrowLeft size={16} />
        <span>
          {customLabel || (
            lang === 'ଓଡ଼ିଆ'
              ? '← ପଛକୁ ଫେରନ୍ତୁ (ପୂର୍ବ ପୃଷ୍ଠା)'
              : lang === 'हिन्दी'
              ? '← वापस जाएं (पिछला पृष्ठ)'
              : '← Back to Previous Page'
          )}
        </span>
      </button>

      {activeTab !== 'home' && (
        <button
          type="button"
          onClick={() => navigateToTab('home')}
          className="btn btn-ghost-light"
          style={{
            fontSize: '12px',
            color: '#b42318',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>{lang === 'ଓଡ଼ିଆ' ? 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ' : lang === 'हिन्दी' ? 'डैशबोर्ड पर जाएं' : 'Back to Dashboard'}</span>
        </button>
      )}
    </div>
  );

  const [updateNotice, setUpdateNotice] = useState('');
  const [medicines, setMedicines] = useState<MedicineItem[]>(storage.getMedicines());
  const [requests, setRequests] = useState<PharmacyRequest[]>(storage.getRequests());
  const [pharmacyStatus, setPharmacyStatus] = useState<PharmacyStoreStatus>(storage.getPharmacyStatus());
  const [customHolidayNotice, setCustomHolidayNotice] = useState('');
  const [medSearchQuery, setMedSearchQuery] = useState('');
  const [medCategoryFilter, setMedCategoryFilter] = useState('ALL');
  const [quickLookupQuery, setQuickLookupQuery] = useState('');

  const t = PHARMACY_I18N[lang] || PHARMACY_I18N.English || PHARMACY_I18N.en;
  const isConnected = networkQuality !== 'offline';

  useEffect(() => {
    setMedicines(storage.getMedicines());
    setRequests(storage.getRequests());
    setPharmacyStatus(storage.getPharmacyStatus());
  }, [activeTab]);

  const handleUpdateStoreStatus = (newStatus: 'OPEN & DISPENSING' | 'CLOSED' | 'HOLIDAY SCHEDULE' | 'EMERGENCY CLOSURE') => {
    const isOpen = newStatus === 'OPEN & DISPENSING';
    const isHoliday = newStatus === 'HOLIDAY SCHEDULE';
    const isEmergencyClosure = newStatus === 'EMERGENCY CLOSURE';
    const notice = customHolidayNotice || (
      isHoliday ? 'Closed for festive/local holiday.' :
      isEmergencyClosure ? 'Temporarily closed for emergency restocking/maintenance.' :
      !isOpen ? 'Store is currently closed for dispensing.' : 'Open and dispensing prescribed medicines.'
    );

    const updated = storage.updatePharmacyStatus({
      status: newStatus,
      isOpen,
      isHoliday,
      isEmergencyClosure,
      holidayNotice: notice
    });

    setPharmacyStatus(updated);
    storage.addNotification({
      title: 'Pharmacy Operating Status Changed',
      body: `${user.name} status updated to: ${newStatus}.`,
      type: 'pharmacy'
    });
    setUpdateNotice(
      lang === 'ଓଡ଼ିଆ'
        ? `ଔଷଧାଳୟ ସ୍ଥିତି "${newStatus}" କୁ ପରିବର୍ତ୍ତିତ ହେଲା! ରୋଗୀ ମାନଙ୍କୁ ସିଧାସଳଖ ଜଣାଇଦିଆଗଲା।`
        : lang === 'हिन्दी'
        ? `फार्मेसी स्थिति "${newStatus}" में अपडेट की गई! रोगियों को सीधे सूचित किया गया।`
        : `Pharmacy status updated to "${newStatus}". Live broadcast synced to patient portal!`
    );
    setTimeout(() => setUpdateNotice(''), 3500);
  };

  const handleStatusChange = (id: string, newStatus: MedicineItem['status'], quantity?: number) => {
    const updated = storage.updateMedicineStatus(id, newStatus, quantity);
    setMedicines([...updated]);

    const item = updated.find((m) => m.id === id);
    storage.saveRecord({
      type: 'stock-update',
      notes: `Stock updated at ${user.name}: ${item?.name} is now '${newStatus}'.`,
      synced: isConnected
    });

    storage.addNotification({
      title: 'Pharmacy Stock Updated',
      body: `Demo notification: ${item?.name} status changed to ${newStatus} at ${user.name}.`,
      type: 'pharmacy'
    });

    storage.addAuditLog(`Stock status updated for ${item?.name} -> ${newStatus}`, user.name);

    setUpdateNotice(`Stock for ${item?.name} updated to ${newStatus}. Live patient availability synced!`);
    setTimeout(() => setUpdateNotice(''), 3000);
  };

  const handleQuantityAdjust = (id: string, delta: number) => {
    const currentMed = medicines.find(m => m.id === id);
    if (!currentMed) return;
    const newQty = Math.max(0, currentMed.quantity + delta);
    const newStatus: MedicineItem['status'] = newQty === 0 ? 'OUT OF STOCK' : newQty <= 10 ? 'LIMITED STOCK' : 'AVAILABLE';
    handleStatusChange(id, newStatus, newQty);
  };

  const handleConfirmRequest = (reqId: string) => {
    const updated = storage.updateRequestStatus(reqId, 'Confirmed Available');
    setRequests([...updated]);

    const req = updated.find(r => r.id === reqId);
    storage.addNotification({
      title: 'Medicine Hold Confirmed',
      body: `Demo notification: Your request for ${req?.medicines} is confirmed at ${user.name}.`,
      type: 'pharmacy'
    });

    storage.addAuditLog(`Pharmacy confirmed medicine request for ${req?.patientName}`, user.name);

    setUpdateNotice('Medicine hold confirmed! In-app notification sent to patient.');
    setTimeout(() => setUpdateNotice(''), 3000);
  };

  const availableCount = medicines.filter(m => m.status === 'AVAILABLE').length;
  const limitedCount = medicines.filter(m => m.status === 'LIMITED STOCK').length;
  const outOfStockCount = medicines.filter(m => m.status === 'OUT OF STOCK').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* Pharmacy Bar */}
      <div className="user-bar" style={{ borderRadius: '14px', marginBottom: '18px' }}>
        <div className="user-profile">
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#b42318',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 800
            }}
          >
            {user.name.split(' ').map((n: string) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() || 'PH'}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {user.location || 'Bhawanipatna Main Market'} • {t.partnerPharmacy}
            </div>
            <span className="user-badge" style={{ background: '#fef3f2', color: '#b42318' }}>
              {user.registrationNumber ? `DL: ${user.registrationNumber}` : t.chemistLicense}
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
                    background: lang === l ? '#b42318' : 'transparent',
                    color: lang === l ? '#ffffff' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {l === 'English' ? 'EN' : l === 'ଓଡ଼ିଆ' ? 'ଓଡ଼ିଆ' : 'हिन्दी'}
                </button>
              ))}
            </div>
          )}
          <span
            className="status-pill"
            style={{
              background: isConnected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isConnected ? '#059669' : '#dc2626'
            }}
          >
            <span className="status-dot"></span>
            <span>{isConnected ? t.broadcastingLive : t.offlineQueued}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <nav className="tabs-scroll-wrap" aria-label="Pharmacy navigation">
        <button
          className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          {t.tabHome}
        </button>
        <button
          className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          {t.tabStock} ({medicines.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          {t.tabRequests} ({pendingRequests} {t.pending})
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          {t.tabProfile}
        </button>
      </nav>

      {updateNotice && (
        <div className="alert ok" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <CheckCircle2 size={16} />
          <span>{updateNotice}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: PHARMACY DASHBOARD (Section 29) */}
      {/* ======================================================== */}
      {activeTab === 'home' && (
        <div>
          <div className="hero-card" style={{ borderRadius: '16px', marginBottom: '20px' }}>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroDesc}</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => setActiveTab('stock')}
              >
                <Pill size={16} />
                <span>{t.manageStockBtn}</span>
              </button>
              <button
                className="btn btn-ghost-light"
                onClick={() => setActiveTab('requests')}
              >
                <Clock size={16} />
                <span>{t.viewRequestsBtn}</span>
              </button>
            </div>
          </div>

          {/* Today's Pharmacy Operating Status Control Panel (Section 16 & 29) */}
          <div className="card" style={{ marginBottom: '20px', border: '1.5px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '17px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏪</span>
                  <span>
                    {lang === 'ଓଡ଼ିଆ'
                      ? 'ଆଜିର ଔଷଧାଳୟ ଖୋଲା/ବନ୍ଦ ସ୍ଥିତି'
                      : lang === 'हिन्दी'
                      ? 'आज की फार्मेसी संचालन स्थिति'
                      : "Today's Pharmacy Operating Status"}
                  </span>
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
                  {lang === 'ଓଡ଼ିଆ'
                    ? 'ଲାଇଭ୍ ସ୍ଥିତି ରୋଗୀ ପୋର୍ଟାଲରେ ତୁରନ୍ତ ପ୍ରଦର୍ଶିତ ହୁଏ, ଯାହାଦ୍ୱାରା ଗ୍ରାମୀଣ ଲୋକ ବୃଥା ଯାତ୍ରା କରନ୍ତି ନାହିଁ।'
                    : lang === 'हिन्दी'
                    ? 'लाइव स्थिति रोगी पोर्टल पर तुरंत प्रदर्शित होती है, जिससे ग्रामीण लोग व्यर्थ यात्रा से बचते हैं।'
                    : 'Changes immediately broadcast live to all rural patients across Kalahandi to prevent futile travel.'}
                </p>
              </div>

              {/* Status Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontWeight: 800,
                    fontSize: '12px',
                    background: pharmacyStatus.isOpen ? '#dcfce7' : pharmacyStatus.isEmergencyClosure ? '#fee2e2' : pharmacyStatus.isHoliday ? '#fef3c7' : '#f1f5f9',
                    color: pharmacyStatus.isOpen ? '#166534' : pharmacyStatus.isEmergencyClosure ? '#991b1b' : pharmacyStatus.isHoliday ? '#92400e' : '#334155',
                    border: `1.5px solid ${pharmacyStatus.isOpen ? '#86efac' : pharmacyStatus.isEmergencyClosure ? '#fca5a5' : pharmacyStatus.isHoliday ? '#fcd34d' : '#cbd5e1'}`
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: pharmacyStatus.isOpen ? '#16a34a' : pharmacyStatus.isEmergencyClosure ? '#dc2626' : pharmacyStatus.isHoliday ? '#d97706' : '#64748b' }}></span>
                  <span>
                    {pharmacyStatus.isOpen
                      ? (lang === 'ଓଡ଼ିଆ' ? '🟢 ଖୋଲା ଅଛି (ବଣ୍ଟନ ଚାଲୁ)' : lang === 'हिन्दी' ? '🟢 खुला है (दवा वितरण चालू)' : '🟢 OPEN & DISPENSING')
                      : pharmacyStatus.isEmergencyClosure
                      ? (lang === 'ଓଡ଼ିଆ' ? '⚠️ ଜରୁରୀକାଳୀନ ବନ୍ଦ' : lang === 'हिन्दी' ? '⚠️ आपातकालीन बंदी' : '⚠️ EMERGENCY CLOSURE')
                      : pharmacyStatus.isHoliday
                      ? (lang === 'ଓଡ଼ିଆ' ? '🟡 ଛୁଟି ସୂଚୀ' : lang === 'हिन्दी' ? '🟡 अवकाश अनुसूची' : '🟡 HOLIDAY SCHEDULE')
                      : (lang === 'ଓଡ଼ିଆ' ? '🔴 ବନ୍ଦ ଅଛି' : lang === 'हिन्दी' ? '🔴 बंद है' : '🔴 CLOSED')}
                  </span>
                </span>
              </div>
            </div>

            {/* Quick Status Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => handleUpdateStoreStatus('OPEN & DISPENSING')}
                className="btn"
                style={{
                  background: pharmacyStatus.isOpen ? '#16a34a' : '#f8fafc',
                  color: pharmacyStatus.isOpen ? '#ffffff' : '#166534',
                  borderColor: '#86efac',
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>✓</span>
                <span>Open & Dispensing</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStoreStatus('CLOSED')}
                className="btn"
                style={{
                  background: !pharmacyStatus.isOpen && !pharmacyStatus.isHoliday && !pharmacyStatus.isEmergencyClosure ? '#475569' : '#f8fafc',
                  color: !pharmacyStatus.isOpen && !pharmacyStatus.isHoliday && !pharmacyStatus.isEmergencyClosure ? '#ffffff' : '#334155',
                  borderColor: '#cbd5e1',
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>🌙</span>
                <span>Closed (Normal)</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStoreStatus('HOLIDAY SCHEDULE')}
                className="btn"
                style={{
                  background: pharmacyStatus.isHoliday ? '#d97706' : '#f8fafc',
                  color: pharmacyStatus.isHoliday ? '#ffffff' : '#92400e',
                  borderColor: '#fcd34d',
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>🏖️</span>
                <span>Holiday Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStoreStatus('EMERGENCY CLOSURE')}
                className="btn"
                style={{
                  background: pharmacyStatus.isEmergencyClosure ? '#dc2626' : '#f8fafc',
                  color: pharmacyStatus.isEmergencyClosure ? '#ffffff' : '#991b1b',
                  borderColor: '#fca5a5',
                  fontWeight: 700,
                  fontSize: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>⚠️</span>
                <span>Emergency Closure</span>
              </button>
            </div>

            {/* Optional Custom Notice Input */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={customHolidayNotice}
                onChange={(e) => setCustomHolidayNotice(e.target.value)}
                placeholder="Optional notice for patients (e.g. Reopening at 2:00 PM, New stock arriving...)"
                style={{
                  flex: 1,
                  minWidth: '240px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px'
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (customHolidayNotice) {
                    storage.updatePharmacyStatus({ holidayNotice: customHolidayNotice });
                    setPharmacyStatus(storage.getPharmacyStatus());
                    setUpdateNotice('Patient notice updated successfully!');
                    setTimeout(() => setUpdateNotice(''), 3000);
                  }
                }}
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '8px 14px', fontWeight: 600 }}
              >
                Save Notice
              </button>
            </div>

            {pharmacyStatus.holidayNotice && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                Active Patient Notice: "{pharmacyStatus.holidayNotice}"
              </div>
            )}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--navy-mid)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
              {t.liveSectionTitle}
            </h3>
            <div className="kpis-grid">
              <div className="kpi-card">
                <span className="kpi-label">{t.kpiAvailable}</span>
                <div className="kpi-val" style={{ color: '#027a48' }}>{availableCount}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {t.kpiAvailableSub}
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiLimited}</span>
                <div className="kpi-val" style={{ color: '#b54708' }}>{limitedCount}</div>
                <span style={{ fontSize: '12px', color: '#b54708' }}>
                  {t.kpiLimitedSub}
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiOutOfStock}</span>
                <div className="kpi-val" style={{ color: '#b42318' }}>{outOfStockCount}</div>
                <span style={{ fontSize: '12px', color: '#b42318' }}>
                  {t.kpiOutOfStockSub}
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">{t.kpiRequests}</span>
                <div className="kpi-val" style={{ color: '#0d70d4' }}>{pendingRequests}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  {t.kpiRequestsSub}
                </span>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={20} style={{ color: '#0284c7' }} />
              <h3>{t.partnerNoticeTitle}</h3>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
              {t.partnerNoticeDesc}
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MEDICINE INVENTORY (Section 29 Actions) */}
      {/* ======================================================== */}
      {activeTab === 'stock' && (
        <div>
          {renderBackButton()}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h2>{t.stockMgmtTitle}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                  {t.stockMgmtDesc}
                </p>
              </div>
              <span
                className="status-pill"
                style={{
                  background: isConnected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: isConnected ? '#059669' : '#dc2626'
                }}
              >
                <span className="status-dot"></span>
                {isConnected ? t.broadcastingLive : t.offlineQueued}
              </span>
            </div>

            {/* Quick Patient Medicine Availability Lookup Box */}
            <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '12px', border: '1.5px solid #bae6fd', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Search size={18} color="#0284c7" />
                <strong style={{ fontSize: '14px', color: '#0369a1' }}>
                  {lang === 'ଓଡ଼ିଆ' ? 'ରୋଗୀ ଔଷଧ ଷ୍ଟକ୍ ତୁରନ୍ତ ଯାଞ୍ଚ (କେମିଷ୍ଟ ଟୁଲ୍)' : lang === 'हिन्दी' ? 'रोगी दवा त्वरित स्टॉक जांच (केमिस्ट टूल)' : 'Quick Patient Stock & Generic Alternative Lookup'}
                </strong>
              </div>
              <p style={{ fontSize: '12px', color: '#0284c7', margin: '0 0 10px 0' }}>
                Instant phone-in or counter lookup tool to advise arriving villagers if their prescribed medicine is in stock or if a Jan Aushadhi generic alternative is available.
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={quickLookupQuery}
                  onChange={(e) => setQuickLookupQuery(e.target.value)}
                  placeholder="Type medicine or generic name (e.g. Paracetamol, Amoxicillin, Metformin, ORS)..."
                  style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #7dd3fc', fontSize: '13px' }}
                />
                {quickLookupQuery && (
                  <button
                    type="button"
                    onClick={() => setQuickLookupQuery('')}
                    className="btn btn-secondary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {quickLookupQuery && (
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {medicines
                    .filter(m =>
                      m.name.toLowerCase().includes(quickLookupQuery.toLowerCase()) ||
                      m.category.toLowerCase().includes(quickLookupQuery.toLowerCase()) ||
                      (m.genericName && m.genericName.toLowerCase().includes(quickLookupQuery.toLowerCase()))
                    )
                    .map(m => (
                      <div key={m.id} style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e0f2fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <strong>{m.name}</strong> {m.genericName && <span style={{ fontSize: '12px', color: '#64748b' }}>({m.genericName})</span>}
                          <div style={{ fontSize: '12px', color: '#475569' }}>Category: {m.category} • Price: {m.unitPrice} • Units In Stock: <strong>{m.quantity}</strong></div>
                        </div>
                        <span
                          className={`badge ${
                            m.status === 'AVAILABLE' ? 'badge-green' : m.status === 'LIMITED STOCK' ? 'badge-amber' : 'badge-red'
                          }`}
                          style={{ fontWeight: 700 }}
                        >
                          {m.status} ({m.quantity} units)
                        </span>
                      </div>
                    ))}
                  {medicines.filter(m =>
                    m.name.toLowerCase().includes(quickLookupQuery.toLowerCase()) ||
                    m.category.toLowerCase().includes(quickLookupQuery.toLowerCase()) ||
                    (m.genericName && m.genericName.toLowerCase().includes(quickLookupQuery.toLowerCase()))
                  ).length === 0 && (
                    <div style={{ fontSize: '12px', color: '#b42318', background: '#fef2f2', padding: '8px 12px', borderRadius: '6px' }}>
                      ⚠️ No exact match for "{quickLookupQuery}". Advise patient to check Jan Aushadhi generic alternative or nearest CHC pharmacy.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search and Category Filter Toolbar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  value={medSearchQuery}
                  onChange={(e) => setMedSearchQuery(e.target.value)}
                  placeholder="Filter inventory by medicine, category, or generic name..."
                  style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['ALL', 'Fever & Pain', 'Antibiotics & Infections', 'Gastroenterology', 'Respiratory', 'Emergency / Chronic'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMedCategoryFilter(cat)}
                    className={`btn ${medCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '16px' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="data-list">
              {medicines
                .filter(med => {
                  const matchesSearch = medSearchQuery === '' ||
                    med.name.toLowerCase().includes(medSearchQuery.toLowerCase()) ||
                    med.category.toLowerCase().includes(medSearchQuery.toLowerCase()) ||
                    (med.genericName && med.genericName.toLowerCase().includes(medSearchQuery.toLowerCase())) ||
                    med.block.toLowerCase().includes(medSearchQuery.toLowerCase());

                  const matchesCategory = medCategoryFilter === 'ALL' ||
                    med.category.toLowerCase().includes(medCategoryFilter.toLowerCase());

                  return matchesSearch && matchesCategory;
                })
                .map((med) => (
                  <div key={med.id} className="data-item" style={{ flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: '16px' }}>{med.name}</strong>
                        {med.genericName && (
                          <span style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic' }}>
                            ({med.genericName})
                          </span>
                        )}
                        <span
                          className={`badge ${
                            med.status === 'AVAILABLE'
                              ? 'badge-green'
                              : med.status === 'LIMITED STOCK'
                              ? 'badge-amber'
                              : 'badge-red'
                          }`}
                          style={{ fontSize: '11px', fontWeight: 700 }}
                        >
                          {med.status === 'AVAILABLE'
                            ? (lang === 'ଓଡ଼ିଆ' ? 'ଉପଲବ୍ଧ' : lang === 'हिन्दी' ? 'उपलब्ध' : 'AVAILABLE')
                            : med.status === 'LIMITED STOCK'
                            ? (lang === 'ଓଡ଼ିଆ' ? 'ସୀମିତ ଷ୍ଟକ୍' : lang === 'हिन्दी' ? 'सीमित स्टॉक' : 'LIMITED STOCK')
                            : (lang === 'ଓଡ଼ିଆ' ? 'ଷ୍ଟକ୍ ଶେଷ' : lang === 'हिन्दी' ? 'स्टॉक समाप्त' : 'OUT OF STOCK')}
                        </span>
                      </div>

                      <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
                        {t.category}: {med.category} • {t.price}: {med.unitPrice} • {t.block}: {med.block}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--muted-light)', marginTop: '2px' }}>
                        {t.availableUnits}: <strong style={{ color: '#0f172a' }}>{med.quantity}</strong> • {t.lastUpdated}: {med.lastUpdated}
                      </div>
                    </div>

                    {/* Quantity Stepper & Quick Action Buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {/* Quantity Stepper */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '2px' }}>
                        <button
                          type="button"
                          onClick={() => handleQuantityAdjust(med.id, -5)}
                          style={{ border: 'none', background: 'transparent', padding: '4px 8px', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                          title="Decrease units by 5"
                        >
                          <Minus size={13} color="#475569" />
                        </button>
                        <span style={{ fontSize: '12px', fontWeight: 700, padding: '0 8px', color: '#0f172a', minWidth: '32px', textAlign: 'center' }}>
                          {med.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuantityAdjust(med.id, 5)}
                          style={{ border: 'none', background: 'transparent', padding: '4px 8px', cursor: 'pointer', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                          title="Increase units by 5"
                        >
                          <Plus size={13} color="#475569" />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleStatusChange(med.id, 'AVAILABLE', med.quantity > 0 ? med.quantity : 50)}
                        style={{
                          fontSize: '11px',
                          padding: '5px 10px',
                          background: med.status === 'AVAILABLE' ? '#16a34a' : '#f0fdf4',
                          color: med.status === 'AVAILABLE' ? '#ffffff' : '#166534',
                          borderColor: '#bbf7d0',
                          fontWeight: 700
                        }}
                      >
                        {t.markAvailable}
                      </button>

                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleStatusChange(med.id, 'LIMITED STOCK', 10)}
                        style={{
                          fontSize: '11px',
                          padding: '5px 10px',
                          background: med.status === 'LIMITED STOCK' ? '#d97706' : '#fffbeb',
                          color: med.status === 'LIMITED STOCK' ? '#ffffff' : '#92400e',
                          borderColor: '#fde68a',
                          fontWeight: 700
                        }}
                      >
                        {t.markLimited}
                      </button>

                      <button
                        type="button"
                        className="btn"
                        onClick={() => handleStatusChange(med.id, 'OUT OF STOCK', 0)}
                        style={{
                          fontSize: '11px',
                          padding: '5px 10px',
                          background: med.status === 'OUT OF STOCK' ? '#dc2626' : '#fef2f2',
                          color: med.status === 'OUT OF STOCK' ? '#ffffff' : '#991b1b',
                          borderColor: '#fecaca',
                          fontWeight: 700
                        }}
                      >
                        {t.markOutOfStock}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PATIENT REQUESTS (Section 30) */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* TAB 3: PATIENT REQUESTS (Section 30) */}
      {/* ======================================================== */}
      {activeTab === 'requests' && (
        <div>
          {renderBackButton()}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2>{t.patientRequestsTitle}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                  {t.patientRequestsDesc}
                </p>
              </div>
              <span className="badge badge-blue">{pendingRequests} {t.pending}</span>
            </div>

            <div className="data-list">
              {requests.map((req) => (
                <div key={req.id} className="data-item">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '15px' }}>{req.patientName}</strong>
                      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
                        {req.patientId || 'RHB-OD-KLH-0941'}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>• {req.village}</span>
                    </div>

                    <div style={{ fontSize: '13px', color: '#0f172a' }}>
                      {t.requestedMedicine}: <strong>{req.medicines}</strong>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--muted-light)', marginTop: '2px' }}>
                      {t.timeReceived}: {req.timestamp} • {t.preferred}: {user.name}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className={`badge ${
                        req.status === 'Confirmed Available' ? 'badge-green' : 'badge-amber'
                      }`}
                    >
                      {req.status === 'Confirmed Available' ? t.confirmedAvailable : t.pending}
                    </span>

                    {req.status === 'Pending' && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleConfirmRequest(req.id)}
                        style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700 }}
                      >
                        <Check size={14} />
                        <span>{t.confirmAvailable}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PHARMACY PROFILE */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div>
          {renderBackButton()}
          <div className="card">
            <h2>{t.profileTitle}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
              {t.profileSubtitle}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '13px', marginBottom: '18px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 700 }}>{t.pharmacyName}</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{user.name}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 700 }}>{t.drugLicense}</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{user.registrationNumber || 'KLH-2024-8192-RET'}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 700 }}>{t.addressBlock}</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{user.location || t.addressVal}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 700 }}>{t.operatingHours}</span>
                <strong style={{ fontSize: '14px', color: '#0f172a' }}>{t.operatingHoursVal}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 700 }}>Current Operating Status</span>
                <span
                  className="badge"
                  style={{
                    background: pharmacyStatus.isOpen ? '#dcfce7' : '#fee2e2',
                    color: pharmacyStatus.isOpen ? '#166534' : '#991b1b',
                    fontWeight: 700,
                    marginTop: '4px',
                    display: 'inline-block'
                  }}
                >
                  {pharmacyStatus.isOpen ? '🟢 OPEN & DISPENSING' : '🔴 CLOSED / HOLIDAY'}
                </span>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0', fontSize: '13px', color: '#166534' }}>
              ✓ <strong>Verified Jan Aushadhi Kendra:</strong> Subsidized essential medicines listed here are price-capped under the Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP).
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation for Pharmacy (Prompt Section 45) */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderTop: '1px solid #cbd5e1',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '6px 0',
        zIndex: 900
      }}>
        <button
          onClick={() => setActiveTab('home')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'home' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <ClipboardList size={18} />
          <span>{t.navHome}</span>
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'stock' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <Package size={18} />
          <span>{t.navStock}</span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'requests' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <Clock size={18} />
          <span>{t.navRequests}</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'profile' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <User size={18} />
          <span>{t.navProfile}</span>
        </button>
      </div>
    </div>
  );
};
