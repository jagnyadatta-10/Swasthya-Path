import React, { useState } from 'react';
import {
  HeartPulse,
  X,
  Baby,
  Syringe,
  Activity,
  Smile,
  Eye,
  Ear,
  SmilePlus,
  Shield,
  Clock,
  Phone,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Language } from '../types';
import { storage } from '../utils/storage';

interface PrimaryCareServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToQueue: () => void;
  lang?: Language;
}

const PRIMARY_I18N: Record<Language, {
  modalTitle: string;
  modalSub: string;
  tabAam: string;
  tabMental: string;
  tabNcd: string;
  tabTb: string;
  aamNotice: string;
  maternalTitle: string;
  maternalDesc: string;
  immunisationTitle: string;
  immunisationDesc: string;
  ncdTitle: string;
  ncdDesc: string;
  mentalTitle: string;
  mentalDesc: string;
  eyeTitle: string;
  eyeDesc: string;
  entTitle: string;
  entDesc: string;
  scheduleAamBtn: string;
  teleManasTitle: string;
  teleManasDesc: string;
  feelingLabel: string;
  nationalHelpline: string;
  helplineSub: string;
  dialBtn: string;
  mentalSuccess: string;
  cancelBtn: string;
  requestCounselingBtn: string;
  closeBtn: string;
}> = {
  English: {
    modalTitle: 'Comprehensive Primary Health Services',
    modalSub: 'Ayushman Arogya Mandir (AAM), Tele-MANAS & Longitudinal Support Modules',
    tabAam: 'AAM Primary Care (12 Packages)',
    tabMental: 'Mental Well-Being (Tele-MANAS)',
    tabNcd: 'NCD Chronic Care',
    tabTb: 'Long-Term Treatment (TB)',
    aamNotice: '* Operational navigation categories aligned with Ayushman Arogya Mandir (AAM) guidelines for rural Odisha.',
    maternalTitle: 'Maternal & Child Health',
    maternalDesc: 'Antenatal checks, anemia screening, and infant growth monitoring.',
    immunisationTitle: 'Immunisation',
    immunisationDesc: 'Universal vaccination schedule & local ASHA session tracking.',
    ncdTitle: 'NCD Screening',
    ncdDesc: 'Hypertension, diabetes & oral/breast/cervical cancer awareness.',
    mentalTitle: 'Mental Health Support',
    mentalDesc: 'Stress reduction, counseling & Tele-MANAS district linkage.',
    eyeTitle: 'Eye & Vision Care',
    eyeDesc: 'Cataract screening & basic refraction referrals at CHC.',
    entTitle: 'ENT Care',
    entDesc: 'Ear discharge, hearing loss & chronic throat infection reviews.',
    scheduleAamBtn: 'Schedule Tele-Consultation for Primary Care',
    teleManasTitle: 'Tele-MANAS Mental Well-Being Pathway',
    teleManasDesc: 'Confidential emotional well-being check and counselor connection. In accordance with clinical safety principles, AI does not diagnose psychiatric disorders.',
    feelingLabel: 'How are you feeling?',
    nationalHelpline: 'National Tele-MANAS Helpline',
    helplineSub: 'Toll-Free 24x7 Mental Health Counseling',
    dialBtn: 'Dial 14416',
    mentalSuccess: 'Tele-counseling appointment requested! Transitioning to queue...',
    cancelBtn: 'Cancel',
    requestCounselingBtn: 'Request Supportive Tele-Counseling',
    closeBtn: 'Close'
  },
  'ଓଡ଼ିଆ': {
    modalTitle: 'ସମନ୍ୱିତ ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
    modalSub: 'ଆୟୁଷ୍ମାନ ଆରୋଗ୍ୟ ମନ୍ଦିର (AAM), ଟେଲି-ମାନସ ଏବଂ ସ୍ୱାସ୍ଥ୍ୟ ମାର୍ଗଦର୍ଶନ',
    tabAam: 'AAM ପ୍ରାଥମିକ ସେବା (୧୨ ପ୍ୟାକେଜ୍)',
    tabMental: 'ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ (ଟେଲି-ମାନସ)',
    tabNcd: 'NCD ଦୀର୍ଘମିଆଦି ରୋଗ ଯତ୍ନ',
    tabTb: 'ଯକ୍ଷ୍ମା (TB) ଚିକିତ୍ସା ସହାୟତା',
    aamNotice: '* ଓଡ଼ିଶାର ଆୟୁଷ୍ମାନ ଆରୋଗ୍ୟ ମନ୍ଦିର (AAM) ମାର୍ଗଦର୍ଶିକା ଅନୁଯାୟୀ ପ୍ରାଥମିକ ସେବା।',
    maternalTitle: 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ',
    maternalDesc: 'ଗର୍ଭବତୀ ଯାଞ୍ଚ, ରକ୍ତହୀନତା ପରୀକ୍ଷା ଏବଂ ଶିଶୁର ଓଜନ ଓ ବୃଦ୍ଧି ନିରୀକ୍ଷଣ।',
    immunisationTitle: 'ଟୀକାକରଣ (Immunisation)',
    immunisationDesc: 'ନିୟମିତ ଟୀକା ସାରଣୀ ଏବଂ ଗ୍ରାମୀଣ ଆଶା କର୍ମୀଙ୍କ ସହ ସମନ୍ୱୟ।',
    ncdTitle: 'NCD ରୋଗ ଯାଞ୍ଚ',
    ncdDesc: 'ଉଚ୍ଚ ରକ୍ତଚାପ, ମଧୁମେହ (Diabetes) ଏବଂ ସଚେତନତା।',
    mentalTitle: 'ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା',
    mentalDesc: 'ମାନସିକ ଚାପ ହ୍ରାସ, କାଉନସେଲିଂ ଏବଂ ଟେଲି-ମାନସ ଜିଲ୍ଲା ସଂଯୋଗ।',
    eyeTitle: 'ଚକ୍ଷୁ ଯତ୍ନ',
    eyeDesc: 'ମୋତିଆବିନ୍ଦୁ ଯାଞ୍ଚ ଏବଂ CHC ରେ ଦୃଷ୍ଟିଶକ୍ତି ପରୀକ୍ଷା ରେଫରାଲ୍।',
    entTitle: 'କାନ, ନାକ ଓ ଗଳା (ENT)',
    entDesc: 'କାନ ପାଣି ହେବା, କମ୍ ଶୁଣାଯିବା ଏବଂ ଗଳା ସଂକ୍ରମଣ ପରାମର୍ଶ।',
    scheduleAamBtn: 'ପ୍ରାଥମିକ ସେବା ପାଇଁ ଟେଲି-ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ',
    teleManasTitle: 'ଟେଲି-ମାନସ ମାନସିକ ସୁସ୍ଥତା ମାର୍ଗ',
    teleManasDesc: 'ଗୋପନୀୟ ମାନସିକ ପରାମର୍ଶ। AI କୌଣସି ମାନସିକ ରୋଗ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ; ବିଶେଷଜ୍ଞ କାଉନସେଲର ହିଁ କଥା ହୁଅନ୍ତି।',
    feelingLabel: 'ଆପଣ କିପରି ଅନୁଭବ କରୁଛନ୍ତି?',
    nationalHelpline: 'ଜାତୀୟ ଟେଲି-ମାନସ ହେଲ୍ପଲାଇନ୍',
    helplineSub: 'ଟୋଲ୍-ଫ୍ରି ୨୪x୭ ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ କାଉନସେଲିଂ',
    dialBtn: '୧୪୪୧୬ କୁ କଲ୍ କରନ୍ତୁ',
    mentalSuccess: 'ଟେଲି-କାଉନସେଲିଂ ଅନୁରୋଧ ଗୃହୀତ ହେଲା! ଡାକ୍ତରୀ କ୍ୟୁକୁ ନିଆଯାଉଛି...',
    cancelBtn: 'ବାତିଲ କରନ୍ତୁ',
    requestCounselingBtn: 'ଟେଲି-କାଉନସେଲିଂ ଅନୁରୋଧ କରନ୍ତୁ',
    closeBtn: 'ବନ୍ଦ କରନ୍ତୁ'
  },
  'हिन्दी': {
    modalTitle: 'व्यापक प्राथमिक स्वास्थ्य सेवाएं',
    modalSub: 'आयुष्मान आरोग्य मंदिर (AAM), टेली-मानस एवं स्वास्थ्य मार्गदर्शन',
    tabAam: 'AAM प्राथमिक सेवाएं (१२ पैकेज)',
    tabMental: 'मानसिक स्वास्थ्य (टेली-मानस)',
    tabNcd: 'NCD दीर्घकालिक देखभाल',
    tabTb: 'टीबी (TB) उपचार सहायता',
    aamNotice: '* ग्रामीण ओडिशा हेतु आयुष्मान आरोग्य मंदिर (AAM) दिशानिर्देशों के अनुरूप प्राथमिक सेवाएं।',
    maternalTitle: 'मातृ एवं शिशु स्वास्थ्य',
    maternalDesc: 'गर्भावस्था जांच, एनीमिया स्क्रीनिंग और शिशु विकास की निगरानी।',
    immunisationTitle: 'टीकाकरण (Immunisation)',
    immunisationDesc: 'नियमित टीकाकरण अनुसूची और स्थानीय आशा कार्यकर्ता सत्र ट्रैकिंग।',
    ncdTitle: 'NCD रोग स्क्रीनिंग',
    ncdDesc: 'उच्च रक्तचाप, मधुमेह (शुगर) और कैंसर जागरूकता।',
    mentalTitle: 'मानसिक स्वास्थ्य सहायता',
    mentalDesc: 'तनाव मुक्ति, परामर्श एवं टेली-मानस जिला समन्वय।',
    eyeTitle: 'नेत्र देखभाल',
    eyeDesc: 'मोतियाबिंद जांच और प्राथमिक दृष्टि परीक्षण रेफरल।',
    entTitle: 'कान, नाक और गला (ENT)',
    entDesc: 'कान बहना, कम सुनाई देना और गले के संक्रमण की समीक्षा।',
    scheduleAamBtn: 'प्राथमिक देखभाल हेतु परामर्श बुक करें',
    teleManasTitle: 'टेली-मानस मानसिक स्वास्थ्य देखभाल',
    teleManasDesc: 'गोपनीय भावनात्मक परामर्श। AI मानसिक रोगों का निदान नहीं करता; योग्य काउंसलर सहायता प्रदान करते हैं।',
    feelingLabel: 'आप कैसा महसूस कर रहे हैं?',
    nationalHelpline: 'राष्ट्रीय टेली-मानस हेल्पलाइन',
    helplineSub: 'टोल-फ्री २४x७ मानसिक स्वास्थ्य परामर्श',
    dialBtn: '१४४१६ डायल करें',
    mentalSuccess: 'परामर्श अनुरोध दर्ज! कतार में स्थानांतरित किया जा रहा है...',
    cancelBtn: 'रद्द करें',
    requestCounselingBtn: 'टेली-काउंसलिंग का अनुरोध करें',
    closeBtn: 'बंद करें'
  }
};

export const PrimaryCareServicesModal: React.FC<PrimaryCareServicesModalProps> = ({
  isOpen,
  onClose,
  onNavigateToQueue,
  lang = 'English'
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [activeCategory, setActiveCategory] = useState<'aam' | 'mental' | 'ncd' | 'tb'>('aam');
  const [mentalFeeling, setMentalFeeling] = useState('Feeling stressed / overwhelmed');
  const [mentalSubmitted, setMentalSubmitted] = useState(false);

  React.useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  const ncd = storage.getNcd();
  const tb = storage.getTb();

  if (!isOpen) return null;

  const t = PRIMARY_I18N[activeLang] || PRIMARY_I18N.English;

  const handleMentalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMentalSubmitted(true);
    storage.addNotification({
      title: 'Tele-MANAS Support Request',
      body: `Demo notification: Mental well-being teleconsultation request logged for ${mentalFeeling}.`,
      type: 'doctor'
    });
    storage.addAuditLog(`Tele-MANAS request logged for ${mentalFeeling}`, 'Keshab Rout');
    setTimeout(() => {
      setMentalSubmitted(false);
      onClose();
      onNavigateToQueue();
    }, 1800);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="aam-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '700px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
          color: '#ffffff',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
              <HeartPulse size={18} />
            </div>
            <div>
              <h3 id="aam-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                {t.modalTitle}
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                {t.modalSub}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Language toggle pills */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '20px',
              padding: '2px',
              border: '1px solid rgba(255, 255, 255, 0.25)'
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
                    padding: '3px 9px',
                    fontSize: '11px',
                    fontWeight: activeLang === l ? 800 : 500,
                    cursor: 'pointer'
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
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', background: '#e2e8f0', borderBottom: '1px solid #cbd5e1', padding: '4px 10px', gap: '6px', overflowX: 'auto' }}>
          <button
            type="button"
            className={`tab-btn ${activeCategory === 'aam' ? 'active' : ''}`}
            onClick={() => setActiveCategory('aam')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            {t.tabAam}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeCategory === 'mental' ? 'active' : ''}`}
            onClick={() => setActiveCategory('mental')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            {t.tabMental}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeCategory === 'ncd' ? 'active' : ''}`}
            onClick={() => setActiveCategory('ncd')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            {t.tabNcd}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeCategory === 'tb' ? 'active' : ''}`}
            onClick={() => setActiveCategory('tb')}
            style={{ padding: '6px 12px', fontSize: '12px' }}
          >
            {t.tabTb}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '72vh', overflowY: 'auto' }}>
          {/* CATEGORY 1: AAM 12 Essential Primary Care Packages */}
          {activeCategory === 'aam' && (
            <div>
              <div style={{ background: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '11px', color: '#0369a1', marginBottom: '14px' }}>
                {t.aamNotice}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', marginBottom: '4px' }}>
                    <Baby size={18} />
                    <strong style={{ fontSize: '13px' }}>{t.maternalTitle}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{t.maternalDesc}</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', marginBottom: '4px' }}>
                    <Syringe size={18} />
                    <strong style={{ fontSize: '13px' }}>{t.immunisationTitle}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{t.immunisationDesc}</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706', marginBottom: '4px' }}>
                    <Activity size={18} />
                    <strong style={{ fontSize: '13px' }}>{t.ncdTitle}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{t.ncdDesc}</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7c3aed', marginBottom: '4px' }}>
                    <Smile size={18} />
                    <strong style={{ fontSize: '13px' }}>{t.mentalTitle}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{t.mentalDesc}</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', marginBottom: '4px' }}>
                    <Eye size={18} />
                    <strong style={{ fontSize: '13px' }}>{t.eyeTitle}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{t.eyeDesc}</p>
                </div>

                <div style={{ background: '#ffffff', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0891b2', marginBottom: '4px' }}>
                    <Ear size={18} />
                    <strong style={{ fontSize: '13px' }}>{t.entTitle}</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>{t.entDesc}</p>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    onClose();
                    onNavigateToQueue();
                  }}
                  style={{ fontWeight: 800 }}
                >
                  {t.scheduleAamBtn}
                </button>
              </div>
            </div>
          )}

          {/* CATEGORY 2: Mental Well-Being (Tele-MANAS) */}
          {activeCategory === 'mental' && (
            <div>
              <div style={{ background: '#f5f3ff', border: '1.5px solid #ddd6fe', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6d28d9', fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>
                  <Smile size={18} />
                  <span>{t.teleManasTitle}</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#5b21b6', lineHeight: 1.5 }}>
                  {t.teleManasDesc}
                </p>
              </div>

              <form onSubmit={handleMentalSubmit}>
                <div className="field" style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700 }}>{t.feelingLabel}</label>
                  <select
                    value={mentalFeeling}
                    onChange={(e) => setMentalFeeling(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Feeling stressed / overwhelmed">
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ଅତ୍ୟଧିକ ମାନସିକ ଚାପ / ଚିନ୍ତା' : activeLang === 'हिन्दी' ? 'अत्यधिक तनाव / काम का बोझ' : 'Feeling stressed / overwhelmed with daily work'}
                    </option>
                    <option value="Feeling anxious / restless">
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ଭୟ / ଅଶାନ୍ତି ଅନୁଭବ ହେବା' : activeLang === 'हिन्दी' ? 'घबराहट / बेचैनी महसूस होना' : 'Feeling anxious or restless'}
                    </option>
                    <option value="Low mood / lack of interest">
                      {activeLang === 'ଓଡ଼ିଆ' ? 'କୌଣସି କାମରେ ମନ ନ ଲାଗିବା / ଉଦାସ ରହିବା' : activeLang === 'हिन्दी' ? 'उदास रहना / किसी काम में मन न लगना' : 'Low mood / feeling sad for several days'}
                    </option>
                    <option value="Sleep difficulty / insomnia">
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ନିଦ ନ ହେବା / ରାତିରେ ବାରମ୍ବାର ନିଦ ଭାଙ୍ଗିବା' : activeLang === 'हिन्दी' ? 'नींद न आना / अनिद्रा की समस्या' : 'Sleep difficulty / waking up tired'}
                    </option>
                    <option value="Need someone to talk to">
                      {activeLang === 'ଓଡ଼ିଆ' ? 'କାହା ସହ ନିଜ ମନକଥା ବାଣ୍ଟିବାକୁ ଚାହୁଁଛି' : activeLang === 'हिन्दी' ? 'किसी से बात करने और मार्गदर्शन की जरूरत' : 'Need someone supportive to talk to'}
                    </option>
                  </select>
                </div>

                {/* 24x7 Tele-MANAS Helpline Linkage */}
                <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{t.nationalHelpline}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.helplineSub}</div>
                  </div>
                  <a href="tel:14416" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700 }}>
                    <Phone size={13} /> {t.dialBtn}
                  </a>
                </div>

                {mentalSubmitted && (
                  <div className="alert ok" style={{ marginBottom: '12px' }}>
                    <CheckCircle2 size={16} /> {t.mentalSuccess}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    {t.cancelBtn}
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                    {t.requestCounselingBtn}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CATEGORY 3: NCD Chronic Care */}
          {activeCategory === 'ncd' && (
            <div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px', marginBottom: '14px', fontSize: '12px', color: '#92400e' }}>
                * {activeLang === 'ଓଡ଼ିଆ' ? 'କଳାହାଣ୍ଡି NCD ସେଲ୍ ଦ୍ୱାରା ଦୀର୍ଘମିଆଦି ରୋଗର ନିୟମିତ ତଦାରଖ।' : activeLang === 'हिन्दी' ? 'कालाहांडी NCD सेल द्वारा दीर्घकालिक बीमारियों की नियमित निगरानी।' : 'Longitudinal Non-Communicable Disease (NCD) chronic care tracker (Kalahandi NCD Cell demo).'}
              </div>

              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1.5px solid #cbd5e1', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '16px', color: '#071c42' }}>
                    {ncd.condition} {activeLang === 'ଓଡ଼ିଆ' ? 'ପରିଚାଳନା ଯୋଜନା' : activeLang === 'हिन्दी' ? 'प्रबंधन योजना' : 'Management Plan'}
                  </strong>
                  <span className="badge badge-green">{ncd.status}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#334155', marginBottom: '8px' }}>
                  <strong>{activeLang === 'ଓଡ଼ିଆ' ? 'ଚିକିତ୍ସା ନିୟମ:' : activeLang === 'हिन्दी' ? 'देखभाल प्रोटोकॉल:' : 'Care Protocol:'}</strong> {ncd.carePlan}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', fontSize: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>{activeLang === 'ଓଡ଼ିଆ' ? 'ଶେଷ ରିଡିଙ୍ଗ:' : activeLang === 'हिन्दी' ? 'पिछला रिकॉर्ड:' : 'Last Reading:'}</span> <strong>{ncd.lastReading}</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>{activeLang === 'ଓଡ଼ିଆ' ? 'ଲକ୍ଷ୍ୟ:' : activeLang === 'हिन्दी' ? 'लक्ष्य:' : 'Target Goal:'}</span> <strong>{ncd.targetGoal}</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>{activeLang === 'ଓଡ଼ିଆ' ? 'ଔଷଧ ସେବନ ନିୟମିତତା:' : activeLang === 'हिन्दी' ? 'दवा नियमितता:' : 'Adherence:'}</span> <strong style={{ color: '#16a34a' }}>{ncd.adherencePercent}%</strong>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '10px', fontWeight: 600 }}>
                  {activeLang === 'ଓଡ଼ିଆ' ? 'ପରବର୍ତ୍ତୀ ଯାଞ୍ଚ ତାରିଖ:' : activeLang === 'हिन्दी' ? 'अगली जांच तिथि:' : 'Next Follow-up Due:'} {ncd.nextFollowUp}
                </div>
              </div>
            </div>
          )}

          {/* CATEGORY 4: Long-Term TB Treatment Module */}
          {activeCategory === 'tb' && (
            <div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', marginBottom: '14px', fontSize: '12px', color: '#166534' }}>
                * {activeLang === 'ଓଡ଼ିଆ' ? 'ନି-କ୍ଷୟ (Ni-kshay) ଆଧାରିତ ଯକ୍ଷ୍ମା ଚିକିତ୍ସା ଓ DOTS ସହାୟତା ମଡ୍ୟୁଲ୍।' : activeLang === 'हिन्दी' ? 'निक्षय (Ni-kshay) आधारित टीबी उपचार एवं DOTS सहायता मॉड्यूल।' : 'Government-program integration concept — prototype only (Inspired by Ni-kshay longitudinal treatment workflows).'}
              </div>

              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1.5px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '15px', color: '#071c42' }}>
                    {activeLang === 'ଓଡ଼ିଆ' ? 'ଯକ୍ଷ୍ମା (TB) ଚିକିତ୍ସା ସହାୟତା' : activeLang === 'हिन्दी' ? 'टीबी (TB) उपचार सहायता' : 'Tuberculosis Treatment Support'}
                  </strong>
                  <span className="badge badge-green">{tb.status}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#334155', marginBottom: '6px' }}>
                  {activeLang === 'ଓଡ଼ିଆ' ? 'ଔଷଧ ସାରଣୀ:' : activeLang === 'हिन्दी' ? 'दवा कार्यक्रम:' : 'Regimen:'} <strong>{tb.regimen}</strong> ({tb.phase})
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  DOTS Center: {tb.dotsCenter} • {activeLang === 'ଓଡ଼ିଆ' ? 'ପରବର୍ତ୍ତୀ କଫ ପରୀକ୍ଷା:' : activeLang === 'हिन्दी' ? 'अगली बलगम जांच:' : 'Next Sputum Smear:'} <strong>{tb.nextSputumTest}</strong>
                </div>

                {/* Progress Bar */}
                <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '10px', overflow: 'hidden', margin: '12px 0 6px' }}>
                  <div style={{ width: `${(tb.treatmentMonthsCompleted / tb.totalMonths) * 100}%`, height: '100%', background: '#16a34a' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span>
                    {activeLang === 'ଓଡ଼ିଆ' ? `ସମ୍ପନ୍ନ: ${tb.totalMonths} ମାସରୁ ${tb.treatmentMonthsCompleted} ମାସ` : activeLang === 'हिन्दी' ? `पूर्ण: ${tb.totalMonths} माह में से ${tb.treatmentMonthsCompleted} माह` : `Completed: ${tb.treatmentMonthsCompleted} of ${tb.totalMonths} months`}
                  </span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>
                    {activeLang === 'ଓଡ଼ିଆ' ? 'ନିୟମିତତା:' : activeLang === 'हिन्दी' ? 'नियमितता:' : 'Adherence:'} {tb.adherencePercent}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose} style={{ fontWeight: 800 }}>
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
