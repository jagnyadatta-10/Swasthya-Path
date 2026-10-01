import React, { useState, useEffect } from 'react';
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
  aamDisclaimer: string;
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
  btnSchedule: string;
  teleManasTitle: string;
  teleManasDesc: string;
  feelingLabel: string;
  opt1: string;
  opt2: string;
  opt3: string;
  opt4: string;
  opt5: string;
  helplineTitle: string;
  helplineSub: string;
  btnDial: string;
  btnRequestCounseling: string;
  btnCancel: string;
  btnClose: string;
  alertRequested: string;
}> = {
  English: {
    modalTitle: 'Comprehensive Primary Health Services',
    modalSub: 'Ayushman Arogya Mandir (AAM), Tele-MANAS & Longitudinal Support Modules',
    tabAam: 'AAM Primary Care (12 Packages)',
    tabMental: 'Mental Well-Being (Tele-MANAS)',
    tabNcd: 'NCD Chronic Care',
    tabTb: 'Long-Term Treatment (TB)',
    aamDisclaimer: '* Operational navigation categories aligned with Ayushman Arogya Mandir (AAM) guidelines for rural Odisha.',
    maternalTitle: 'Maternal & Child',
    maternalDesc: 'Antenatal checks, anemia screening, and infant growth monitoring.',
    immunisationTitle: 'Immunisation',
    immunisationDesc: 'Universal vaccination schedule & local ASHA session tracking.',
    ncdTitle: 'NCD Screening',
    ncdDesc: 'Hypertension, diabetes & oral/breast/cervical cancer awareness.',
    mentalTitle: 'Mental Health',
    mentalDesc: 'Stress reduction, counseling & Tele-MANAS district linkage.',
    eyeTitle: 'Eye & Vision Care',
    eyeDesc: 'Cataract screening & basic refraction referrals at CHC.',
    entTitle: 'ENT Care',
    entDesc: 'Ear discharge, hearing loss & chronic throat infection reviews.',
    btnSchedule: 'Schedule Tele-Consultation for Primary Care',
    teleManasTitle: 'Tele-MANAS Mental Well-Being Pathway',
    teleManasDesc: 'Confidential emotional well-being check and counselor connection. In accordance with clinical safety principles, AI does not diagnose psychiatric disorders.',
    feelingLabel: 'How are you feeling?',
    opt1: 'Feeling stressed / overwhelmed with daily work',
    opt2: 'Feeling anxious or restless',
    opt3: 'Low mood / feeling sad for several days',
    opt4: 'Sleep difficulty / waking up tired',
    opt5: 'Need someone supportive to talk to',
    helplineTitle: 'National Tele-MANAS Helpline',
    helplineSub: 'Toll-Free 24x7 Mental Health Counseling',
    btnDial: 'Dial 14416',
    btnRequestCounseling: 'Request Supportive Tele-Counseling',
    btnCancel: 'Cancel',
    btnClose: 'Close',
    alertRequested: 'Tele-counseling appointment requested! Transitioning to queue...'
  },
  'ଓଡ଼ିଆ': {
    modalTitle: 'ସମଗ୍ର ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
    modalSub: 'ଆୟୁଷ୍ମାନ ଆରୋଗ୍ୟ ମନ୍ଦିର (AAM), ଟେଲି-ମାନସ ଓ ଦୀର୍ଘକାଳୀନ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା',
    tabAam: 'AAM ପ୍ରାଥମିକ ସେବା (୧୨ ପ୍ୟାକେଜ୍)',
    tabMental: 'ମାନସିକ ସୁସ୍ଥତା (ଟେଲି-ମାନସ)',
    tabNcd: 'NCD କ୍ରନିକ୍ କେୟାର',
    tabTb: 'ଦୀର୍ଘକାଳୀନ ଚିକିତ୍ସା (TB)',
    aamDisclaimer: '* ଗ୍ରାମୀଣ ଓଡ଼ିଶା ପାଇଁ ଆୟୁଷ୍ମାନ ଆରୋଗ୍ୟ ମନ୍ଦିର ନିର୍ଦ୍ଦେଶାବଳୀ ଅନୁଯାୟୀ କାର୍ଯ୍ୟକାରୀ ସେବା।',
    maternalTitle: 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ',
    maternalDesc: 'ଗର୍ଭବତୀ ଯାଞ୍ଚ, ରକ୍ତହୀନତା ପରୀକ୍ଷା ଏବଂ ଶିଶୁର ଓଜନ ବୃଦ୍ଧି ତଦାରଖ।',
    immunisationTitle: 'ଟୀକାକରଣ (Immunisation)',
    immunisationDesc: 'ନିର୍ଦ୍ଧାରିତ ଟୀକାକରଣ କାର୍ଯ୍ୟସୂଚୀ ଓ ସ୍ଥାନୀୟ ଆଶା ଦିଦିଙ୍କ ତଦାରଖ।',
    ncdTitle: 'NCD ସ୍କ୍ରିନିଂ (ଅସଂକ୍ରାମକ ରୋଗ)',
    ncdDesc: 'ଉଚ୍ଚ ରକ୍ତଚାପ (BP), ମଧୁମେହ (Diabetes) ଏବଂ କ୍ୟାନସର ସଚେତନତା।',
    mentalTitle: 'ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ',
    mentalDesc: 'ଚାପ ମୁକ୍ତି, କାଉନସେଲିଂ ଏବଂ ଟେଲି-ମାନସ ହେଲ୍ପଲାଇନ୍ ସଂଯୋଗ।',
    eyeTitle: 'ଚକ୍ଷୁ ଯତ୍ନ (Eye Care)',
    eyeDesc: 'ମୋତିଆବିନ୍ଦୁ ଯାଞ୍ଚ ଏବଂ CHC କେନ୍ଦ୍ରକୁ ଚକ୍ଷୁ ପରୀକ୍ଷା ରେଫରାଲ୍।',
    entTitle: 'ନାକ, କାନ ଓ ଗଳା (ENT)',
    entDesc: 'କାନ ପାଣି ବାହାରିବା, କମ୍ ଶୁଣାଯିବା ଏବଂ ଗଳା ସଂକ୍ରମଣ ଯାଞ୍ଚ।',
    btnSchedule: 'ପ୍ରାଥମିକ ସେବା ପାଇଁ ଟେଲି-ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ',
    teleManasTitle: 'ଟେଲି-ମାନସ ମାନସିକ ସୁସ୍ଥତା ସହାୟତା',
    teleManasDesc: 'ଗୋପନୀୟ ମାନସିକ ପରାମର୍ଶ ଓ ବିଶେଷଜ୍ଞଙ୍କ ସହ କଥାବାର୍ତ୍ତା। କ୍ଲିନିକାଲ୍ ସୁରକ୍ଷା ଅନୁସାରେ AI କୌଣସି ମାନସିକ ରୋଗ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ।',
    feelingLabel: 'ଆପଣ କିପରି ଅନୁଭବ କରୁଛନ୍ତି?',
    opt1: 'ଦୈନନ୍ଦିନ କାମର ଚାପ ବା ଅତ୍ୟଧିକ ଚିନ୍ତା',
    opt2: 'ମନରେ ଅସ୍ଥିରତା ବା ଭୟ ଲାଗିବା',
    opt3: 'କିଛି ଦିନ ହେବ ମନ ଖରାପ ରହିବା',
    opt4: 'ନିଦ ହେବାରେ ସମସ୍ୟା ବା କ୍ଳାନ୍ତ ଲାଗିବା',
    opt5: 'କାହା ସହ କଥା ହେବାର ଆବଶ୍ୟକତା ଅଛି',
    helplineTitle: 'ଜାତୀୟ ଟେଲି-ମାନସ ହେଲ୍ପଲାଇନ୍',
    helplineSub: 'ମାଗଣା ୨୪ ଘଣ୍ଟିଆ ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ',
    btnDial: '୧୪୪୧୬ କୁ କଲ୍ କରନ୍ତୁ',
    btnRequestCounseling: 'ମାନସିକ ପରାମର୍ଶ ପାଇଁ ଅନୁରୋଧ କରନ୍ତୁ',
    btnCancel: 'ବାତିଲ୍ କରନ୍ତୁ',
    btnClose: 'ବନ୍ଦ କରନ୍ତୁ',
    alertRequested: 'ପରାମର୍ଶ ଅନୁରୋଧ ଗ୍ରହଣ କରାଗଲା! ଡାକ୍ତରୀ କ୍ୟୁ କୁ ପଠାଯାଉଛି...'
  },
  'हिन्दी': {
    modalTitle: 'व्यापक प्राथमिक स्वास्थ्य सेवाएं',
    modalSub: 'आयुष्मान आरोग्य मंदिर (AAM), टेली-मानस एवं दीर्घकालिक देखभाल मॉड्यूल',
    tabAam: 'AAM प्राथमिक देखभाल (12 पैकेज)',
    tabMental: 'मानसिक स्वास्थ्य (टेली-मानस)',
    tabNcd: 'NCD क्रॉनिक केयर',
    tabTb: 'दीर्घकालिक उपचार (TB)',
    aamDisclaimer: '* ग्रामीण ओडिशा के लिए आयुष्मान आरोग्य मंदिर दिशा-निर्देशों के अनुरूप प्राथमिक सेवाएं।',
    maternalTitle: 'मातृ एवं शिशु स्वास्थ्य',
    maternalDesc: 'गर्भावस्था जांच, एनीमिया स्क्रीनिंग और शिशु वृद्धि निगरानी।',
    immunisationTitle: 'टीकाकरण (Immunisation)',
    immunisationDesc: 'सार्वभौमिक टीकाकरण अनुसूची एवं स्थानीय आशा कार्यकर्ता ट्रैकिंग।',
    ncdTitle: 'NCD स्क्रीनिंग (गैर-संचारी रोग)',
    ncdDesc: 'उच्च रक्तचाप, मधुमेह एवं कैंसर जागरूकता जांच।',
    mentalTitle: 'मानसिक स्वास्थ्य',
    mentalDesc: 'तनाव मुक्ति, परामर्श एवं टेली-मानस हेल्पलाइन संपर्क।',
    eyeTitle: 'नेत्र देखभाल (Eye Care)',
    eyeDesc: 'मोतियाबिंद जांच एवं CHC केंद्र हेतु दृष्टि रेफरल।',
    entTitle: 'कान, नाक एवं गला (ENT)',
    entDesc: 'कान बहना, कम सुनाई देना एवं गले के संक्रमण की जांच।',
    btnSchedule: 'प्राथमिक देखभाल हेतु टेली-परामर्श बुक करें',
    teleManasTitle: 'टेली-मानस मानसिक स्वास्थ्य सेवा',
    teleManasDesc: 'गोपनीय मानसिक स्वास्थ्य सहायता एवं परामर्शदाता से संपर्क। सुरक्षा मानकों के अनुसार AI किसी मानसिक बीमारी का निदान नहीं करता।',
    feelingLabel: 'आप कैसा महसूस कर रहे हैं?',
    opt1: 'दैनिक कार्यों से अत्यधिक तनाव व थकान',
    opt2: 'बेचैनी या घबराहट महसूस होना',
    opt3: 'कई दिनों से मन उदास रहना',
    opt4: 'नींद न आना या सुबह थकान महसूस होना',
    opt5: 'किसी से बात करने और मार्गदर्शन की आवश्यकता है',
    helplineTitle: 'राष्ट्रीय टेली-मानस हेल्पलाइन',
    helplineSub: 'टोल-फ्री 24x7 मानसिक स्वास्थ्य परामर्श',
    btnDial: '14416 पर कॉल करें',
    btnRequestCounseling: 'मानसिक परामर्श हेतु अनुरोध भेजें',
    btnCancel: 'रद्द करें',
    btnClose: 'बंद करें',
    alertRequested: 'परामर्श अनुरोध दर्ज! डॉक्टर कतार में जोड़ा जा रहा है...'
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

  useEffect(() => {
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
      <div className="modal-dialog" style={{ maxWidth: '680px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
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
            <div style={{
              width: '32px',
              height: '32px',
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
              onClick={onClose}
              className="btn"
              style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '6px', cursor: 'pointer' }}
              aria-label="Close"
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
                {t.aamDisclaimer}
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
                >
                  {t.btnSchedule}
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
                    <option value="Feeling stressed / overwhelmed">{t.opt1}</option>
                    <option value="Feeling anxious / restless">{t.opt2}</option>
                    <option value="Low mood / lack of interest">{t.opt3}</option>
                    <option value="Sleep difficulty / insomnia">{t.opt4}</option>
                    <option value="Need someone to talk to">{t.opt5}</option>
                  </select>
                </div>

                {/* 24x7 Tele-MANAS Helpline Linkage */}
                <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0f172a' }}>{t.helplineTitle}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.helplineSub}</div>
                  </div>
                  <a href="tel:14416" className="btn btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                    <Phone size={13} /> {t.btnDial}
                  </a>
                </div>

                {mentalSubmitted && (
                  <div className="alert ok" style={{ marginBottom: '12px' }}>
                    <CheckCircle2 size={16} /> {t.alertRequested}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    {t.btnCancel}
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ fontWeight: 800 }}>
                    {t.btnRequestCounseling}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CATEGORY 3: NCD Chronic Care */}
          {activeCategory === 'ncd' && (
            <div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px', marginBottom: '14px', fontSize: '12px', color: '#92400e' }}>
                * {activeLang === 'ଓଡ଼ିଆ' ? 'ଦୀର୍ଘକାଳୀନ ଅସଂକ୍ରାମକ ରୋଗ (NCD) ପରିଚାଳନା ଟ୍ରାକର୍ (କଳାହାଣ୍ଡି ଜିଲ୍ଲା)।' : activeLang === 'हिन्दी' ? 'दीर्घकालिक गैर-संचारी रोग (NCD) देखभाल ट्रैकर (कालाहांडी NCD सेल)।' : 'Longitudinal Non-Communicable Disease (NCD) chronic care tracker (Kalahandi NCD Cell demo).'}
              </div>

              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1.5px solid #cbd5e1', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '16px', color: '#071c42' }}>
                    {activeLang === 'ଓଡ଼ିଆ' ? 'ଉଚ୍ଚ ରକ୍ତଚାପ (Hypertension) ପରିଚାଳନା ଯୋଜନା' : activeLang === 'हिन्दी' ? 'उच्च रक्तचाप (Hypertension) प्रबंधन योजना' : `${ncd.condition} Management Plan`}
                  </strong>
                  <span className="badge badge-green">
                    {activeLang === 'ଓଡ଼ିଆ' ? 'ନିୟନ୍ତ୍ରିତ' : activeLang === 'हिन्दी' ? 'नियंत्रित' : ncd.status}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#334155', marginBottom: '8px' }}>
                  <strong>{activeLang === 'ଓଡ଼ିଆ' ? 'ଚିକିତ୍ସା ନିୟମ:' : activeLang === 'हिन्दी' ? 'देखभाल प्रोटोकॉल:' : 'Care Protocol:'}</strong> {activeLang === 'ଓଡ଼ିଆ' ? 'ଟାବଲେଟ୍ ଟେଲମିସାର୍ଟନ ୪୦ମି.ଗ୍ରା. ଦୈନିକ ଥରେ + କମ୍ ଲୁଣ ଖାଦ୍ୟ' : activeLang === 'हिन्दी' ? 'टैबलेट टेल्मिसार्टन 40mg दैनिक + कम नमक आहार' : ncd.carePlan}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px', fontSize: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>{activeLang === 'ଓଡ଼ିଆ' ? 'ଶେଷ ରିଡିଙ୍ଗ:' : activeLang === 'हिन्दी' ? 'अंतिम रीडिंग:' : 'Last Reading:'}</span> <strong>{ncd.lastReading}</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>{activeLang === 'ଓଡ଼ିଆ' ? 'ଲକ୍ଷ୍ୟ ମାପ:' : activeLang === 'हिन्दी' ? 'लक्ष्य स्तर:' : 'Target Goal:'}</span> <strong>{ncd.targetGoal}</strong>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                    <span style={{ color: '#64748b' }}>{activeLang === 'ଓଡ଼ିଆ' ? 'ନିୟମିତତା:' : activeLang === 'हिन्दी' ? 'दवा नियमिता:' : 'Adherence:'}</span> <strong style={{ color: '#16a34a' }}>{ncd.adherencePercent}%</strong>
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
                * {activeLang === 'ଓଡ଼ିଆ' ? 'ନିକ୍ଷୟ (Ni-kshay) ଦୀର୍ଘକାଳୀନ ଟିବି ଚିକିତ୍ସା କାର୍ଯ୍ୟକ୍ରମ ସହାୟତା।' : activeLang === 'हिन्दी' ? 'निक्षय (Ni-kshay) टीबी उपचार सहायता मॉड्यूल।' : 'Government-program integration concept — prototype only (Inspired by Ni-kshay longitudinal treatment workflows).'}
              </div>

              <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1.5px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '15px', color: '#071c42' }}>
                    {activeLang === 'ଓଡ଼ିଆ' ? 'ଯକ୍ଷ୍ମା (TB) ଚିକିତ୍ସା ସହାୟତା' : activeLang === 'हिन्दी' ? 'तपेदिक (TB) उपचार सहायता' : 'Tuberculosis Treatment Support'}
                  </strong>
                  <span className="badge badge-green">
                    {activeLang === 'ଓଡ଼ିଆ' ? 'ସକ୍ରିୟ ଚିକିତ୍ସାଧୀନ' : activeLang === 'हिन्दी' ? 'सक्रिय उपचार' : tb.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#334155', marginBottom: '6px' }}>
                  {activeLang === 'ଓଡ଼ିଆ' ? 'ଚିକିତ୍ସା ଫର୍ମୁଲା:' : activeLang === 'हिन्दी' ? 'दवा संयोजन:' : 'Regimen:'} <strong>4FDC (HRZE)</strong> ({activeLang === 'ଓଡ଼ିଆ' ? 'ନିରନ୍ତର ପର୍ଯ୍ୟାୟ' : activeLang === 'हिन्दी' ? 'सतत चरण' : tb.phase})
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  {activeLang === 'ଓଡ଼ିଆ' ? 'DOTS କେନ୍ଦ୍ର:' : activeLang === 'हिन्दी' ? 'DOTS केंद्र:' : 'DOTS Center:'} {tb.dotsCenter} • {activeLang === 'ଓଡ଼ିଆ' ? 'ପରବର୍ତ୍ତୀ କଫ ପରୀକ୍ଷା:' : activeLang === 'हिन्दी' ? 'अगला बलगम परीक्षण:' : 'Next Sputum Smear:'} <strong>{tb.nextSputumTest}</strong>
                </div>

                {/* Progress Bar */}
                <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '10px', overflow: 'hidden', margin: '12px 0 6px' }}>
                  <div style={{ width: `${(tb.treatmentMonthsCompleted / tb.totalMonths) * 100}%`, height: '100%', background: '#16a34a' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                  <span>{activeLang === 'ଓଡ଼ିଆ' ? `ସମ୍ପନ୍ନ: ${tb.treatmentMonthsCompleted} ରୁ ${tb.totalMonths} ମାସ` : activeLang === 'हिन्दी' ? `पूर्ण: ${tb.totalMonths} में से ${tb.treatmentMonthsCompleted} माह` : `Completed: ${tb.treatmentMonthsCompleted} of ${tb.totalMonths} months`}</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>{activeLang === 'ଓଡ଼ିଆ' ? 'ଔଷଧ ସେବନ ହାର:' : activeLang === 'हिन्दी' ? 'नियमितता:' : 'Adherence:'} {tb.adherencePercent}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            {t.btnClose}
          </button>
        </div>
      </div>
    </div>
  );
};
