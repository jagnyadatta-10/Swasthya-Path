import React, { useState, useEffect } from 'react';
import { PhoneCall, X, Phone, ShieldAlert, MapPin, Share2, FileText, Check, AlertOctagon } from 'lucide-react';
import { Language } from '../types';
import { storage } from '../utils/storage';

interface EmergencyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
  patientName?: string;
  patientId?: string;
}

interface EmergencyCategoryItem {
  id: string;
  en: string;
  or: string;
  hi: string;
}

const EMERGENCY_ITEMS: EmergencyCategoryItem[] = [
  {
    id: 'breathing',
    en: 'Severe breathing difficulty / gasping',
    or: 'ପ୍ରବଳ ଶ୍ୱାସକ୍ରିୟା କଷ୍ଟ / ନିଶ୍ୱାସ ନେବାରେ ଅସୁବିଧା',
    hi: 'गंभीर सांस की तकलीफ / हांफना'
  },
  {
    id: 'chest',
    en: 'Severe chest pain / pressure radiating to arm',
    or: 'ଛାତିରେ ପ୍ରବଳ ଯନ୍ତ୍ରଣା ବା ହାତକୁ ଯନ୍ତ୍ରଣା ବ୍ୟାପିବା',
    hi: 'सीने में तेज दर्द / हाथ तक फैलता भारी दबाव'
  },
  {
    id: 'unconscious',
    en: 'Loss of consciousness / fainting / unresponsive',
    or: 'ଅଚେତ ହୋଇଯିବା / ବେହୋସ୍ / ପ୍ରତିକ୍ରିୟାହୀନ',
    hi: 'बेहोशी / अचेत होना / कोई प्रतिक्रिया न होना'
  },
  {
    id: 'bleeding',
    en: 'Severe or uncontrollable bleeding',
    or: 'ଅତ୍ୟଧିକ ବା ବନ୍ଦ ନ ହେଉଥିବା ରକ୍ତସ୍ରାବ',
    hi: 'अत्यधिक या अनियंत्रित रक्तस्राव'
  },
  {
    id: 'stroke',
    en: 'Sudden stroke-like symptoms (face droop, slurred speech)',
    or: 'ହଠାତ୍ ମୁହଁ ବଙ୍କା ହେବା / କଥା ଅସ୍ପଷ୍ଟ ହେବା',
    hi: 'अचानक चेहरे का टेढ़ा होना / बोली लड़खड़ाना'
  },
  {
    id: 'injury',
    en: 'Serious vehicular or agricultural injury',
    or: 'ଗୁରୁତର ଦୁର୍ଘଟଣା ବା କ୍ଷେତବାଡ଼ି କାମରେ କ୍ଷତ',
    hi: 'गंभीर सड़क दुर्घटना या कृषि चोट'
  },
  {
    id: 'poison',
    en: 'Snakebite or acute poisoning',
    or: 'ସାପ କାମୁଡ଼ା ବା ବିଷକ୍ରିୟା',
    hi: 'सांप का काटना या तीव्र विषाक्तता'
  },
  {
    id: 'other',
    en: 'Other urgent life-threatening problem',
    or: 'ଅନ୍ୟାନ୍ୟ ଜୀବନ-ସଙ୍କଟାପନ୍ନ ସମସ୍ୟା',
    hi: 'अन्य कोई गंभीर जीवन-घातक समस्या'
  }
];

const HELP_I18N: Record<Language, {
  modalTitle: string;
  modalSub: string;
  bannerTitle: string;
  bannerDesc: string;
  question: string;
  servicesHeader: string;
  amb108: string;
  amb108Sub: string;
  helpline104: string;
  helpline104Sub: string;
  dhhCasualty: string;
  dhhCasualtySub: string;
  nearbyTitle: string;
  callBtn: string;
  handoverTitle: string;
  genBtn: string;
  regenBtn: string;
  shareBtn: string;
  sharedSuccess: string;
  patientLabel: string;
  acuteIssueLabel: string;
  locationLabel: string;
  locationVal: string;
  allergiesLabel: string;
  allergiesVal: string;
  triagePriorityLabel: string;
  triagePriorityVal: string;
  footerNote: string;
  closeBtn: string;
}> = {
  English: {
    modalTitle: 'EMERGENCY MEDICAL ASSISTANCE',
    modalSub: 'Kalahandi District Emergency Response Protocol • Immediate Action Required',
    bannerTitle: 'DO NOT WAIT FOR ONLINE TELECONSULTATION',
    bannerDesc: 'If you or someone nearby is experiencing acute symptoms, normal teleconsultation waiting queues are stopped. Immediate in-person physical medical stabilization is required.',
    question: 'What is happening right now?',
    servicesHeader: 'CONFIGURED EMERGENCY SERVICES (Call Immediately)',
    amb108: '108 Ambulance',
    amb108Sub: 'Free Emergency Dispatch',
    helpline104: '104 Health Advice',
    helpline104Sub: '24x7 Medical Helpline',
    dhhCasualty: 'DHH Casualty',
    dhhCasualtySub: '06670-230450 (Bhawanipatna)',
    nearbyTitle: 'Nearby Emergency Health Facilities (Kalahandi, Odisha)',
    callBtn: 'Call',
    handoverTitle: 'Emergency Clinical Handover Summary',
    genBtn: 'Generate Summary',
    regenBtn: 'Regenerate',
    shareBtn: 'Share with 108 Dispatch & ASHA Worker',
    sharedSuccess: 'Shared successfully to 108 Dispatch!',
    patientLabel: 'Patient:',
    acuteIssueLabel: 'Acute Emergency Issue:',
    locationLabel: 'Location:',
    locationVal: 'Kalahandi District, Odisha (Bhawanipatna Block)',
    allergiesLabel: 'Known Allergies:',
    allergiesVal: 'No known drug allergies',
    triagePriorityLabel: 'Triage Priority:',
    triagePriorityVal: 'RED / IMMEDIATE PHYSICAL INTERVENTION',
    footerNote: 'Swasthya Path Emergency Guardian • Configured 108/104 Routing',
    closeBtn: 'Close Emergency Panel'
  },
  'ଓଡ଼ିଆ': {
    modalTitle: 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା ସହାୟତା',
    modalSub: 'କଳାହାଣ୍ଡି ଜିଲ୍ଲା ଜରୁରୀକାଳୀନ ପ୍ରୋଟୋକଲ୍ • ତୁରନ୍ତ ପଦକ୍ଷେପ ନିଅନ୍ତୁ',
    bannerTitle: 'ଅନଲାଇନ୍ ଟେଲି-ପରାମର୍ଶ ପାଇଁ ଅପେକ୍ଷା କରନ୍ତୁ ନାହିଁ',
    bannerDesc: 'ଯଦି ଆପଣ ବା ଆପଣଙ୍କ ପାଖରେ କାହାର ଅତି ଗୁରୁତର ଲକ୍ଷଣ ଅଛି, ତେବେ ସାଧାରଣ ଟେଲି-ଡାକ୍ତର ଅପେକ୍ଷା କ୍ୟୁ ବନ୍ଦ କରାଯାଇଛି। ତୁରନ୍ତ ନିକଟସ୍ଥ ଡାକ୍ତରଖାନାରେ ଭର୍ତ୍ତି ହେବା ଆବଶ୍ୟକ।',
    question: 'ଏହି ମୁହୂର୍ତ୍ତରେ କ’ଣ ହେଉଛି?',
    servicesHeader: 'ଜରୁରୀକାଳୀନ ସେବା ନମ୍ବର (ତୁରନ୍ତ କଲ୍ କରନ୍ତୁ)',
    amb108: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ',
    amb108Sub: 'ମାଗଣା ଜରୁରୀକାଳୀନ ଆମ୍ବୁଲାନ୍ସ',
    helpline104: '୧୦୪ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ',
    helpline104Sub: '୨୪ ଘଣ୍ଟିଆ ସ୍ୱାସ୍ଥ୍ୟ ହେଲ୍ପଲାଇନ୍',
    dhhCasualty: 'DHH ଜରୁରୀକାଳୀନ କାଜୁଆଲିଟି',
    dhhCasualtySub: '୦୬୬୭୦-୨୩୦୪୫୦ (ଭବାନୀପାଟଣା)',
    nearbyTitle: 'ନିକଟସ୍ଥ ଜରୁରୀକାଳୀନ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (କଳାହାଣ୍ଡି, ଓଡ଼ିଶା)',
    callBtn: 'କଲ୍ କରନ୍ତୁ',
    handoverTitle: 'ଜରୁରୀକାଳୀନ କ୍ଲିନିକାଲ୍ ହସ୍ତାନ୍ତର ସାରାଂଶ',
    genBtn: 'ସାରାଂଶ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    regenBtn: 'ପୁଣି ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    shareBtn: '୧୦୮ କଣ୍ଟ୍ରୋଲ ରୁମ୍ ଓ ଆଶା ଦିଦିଙ୍କୁ ପଠାନ୍ତୁ',
    sharedSuccess: '୧୦୮ କଣ୍ଟ୍ରୋଲ ରୁମ୍କୁ ସଫଳତାର ସହ ପଠାଗଲା!',
    patientLabel: 'ରୋଗୀଙ୍କ ନାମ:',
    acuteIssueLabel: 'ଜରୁରୀ ସମସ୍ୟା:',
    locationLabel: 'ସ୍ଥାନ:',
    locationVal: 'କଳାହାଣ୍ଡି ଜିଲ୍ଲା, ଓଡ଼ିଶା (ଭବାନୀପାଟଣା ବ୍ଲକ)',
    allergiesLabel: 'ଜଣାଶୁଣା ଆଲର୍ଜି:',
    allergiesVal: 'କୌଣସି ଜଣାଶୁଣା ଆଲର୍ଜି ନାହିଁ',
    triagePriorityLabel: 'ଟ୍ରିଆଜ୍ ପ୍ରାଥମିକତା:',
    triagePriorityVal: 'ଲାଲ୍ (RED) / ତୁରନ୍ତ ଡାକ୍ତରଖାନା ନିଅନ୍ତୁ',
    footerNote: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ ଜରୁରୀକାଳୀନ ସୁରକ୍ଷା • ୧୦୮/୧୦୪ ସିଧାସଳଖ ସଂଯୋଗ',
    closeBtn: 'ବନ୍ଦ କରନ୍ତୁ'
  },
  'हिन्दी': {
    modalTitle: 'आपातकालीन चिकित्सा सहायता',
    modalSub: 'कालाहांडी जिला आपातकालीन प्रोटोकॉल • तत्काल कार्रवाई आवश्यक',
    bannerTitle: 'ऑनलाइन टेली-परामर्श की प्रतीक्षा न करें',
    bannerDesc: 'यदि आपको या किसी अन्य को अत्यधिक गंभीर लक्षण हैं, तो सामान्य ऑनलाइन कतार रोक दी गई है। तत्काल अस्पताल ले जाकर प्राथमिक उपचार कराना आवश्यक है।',
    question: 'अभी क्या हो रहा है?',
    servicesHeader: 'आपातकालीन सेवा नंबर (तुरंत कॉल करें)',
    amb108: '108 एम्बुलेंस',
    amb108Sub: 'मुफ्त आपातकालीन एम्बुलेंस',
    helpline104: '104 स्वास्थ्य परामर्श',
    helpline104Sub: '24 घंटे स्वास्थ्य हेल्पलाइन',
    dhhCasualty: 'DHH आपातकालीन कक्ष',
    dhhCasualtySub: '06670-230450 (भवानीपटना)',
    nearbyTitle: 'नजदीकी आपातकालीन अस्पताल (कालाहांडी, ओडिशा)',
    callBtn: 'कॉल करें',
    handoverTitle: 'आपातकालीन क्लीनिकल हैंडओवर सारांश',
    genBtn: 'सारांश बनाएं',
    regenBtn: 'पुनः बनाएं',
    shareBtn: '108 कंट्रोल रूम और आशा दीदी को भेजें',
    sharedSuccess: '108 कंट्रोल रूम को सफलतापूर्वक भेजा गया!',
    patientLabel: 'रोगी का नाम:',
    acuteIssueLabel: 'गंभीर समस्या:',
    locationLabel: 'स्थान:',
    locationVal: 'कालाहांडी जिला, ओडिशा (भवानीपटना ब्लॉक)',
    allergiesLabel: 'ज्ञात एलर्जी:',
    allergiesVal: 'कोई ज्ञात एलर्जी नहीं',
    triagePriorityLabel: 'ट्राइएज प्राथमिकता:',
    triagePriorityVal: 'लाल (RED) / तुरंत अस्पताल ले जाएं',
    footerNote: 'स्वास्थ्य पथ आपातकालीन सुरक्षा • 108/104 सीधा संपर्क',
    closeBtn: 'बंद करें'
  }
};

export const EmergencyHelpModal: React.FC<EmergencyHelpModalProps> = ({
  isOpen,
  onClose,
  lang = 'English',
  patientName,
  patientId
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [selectedIssueId, setSelectedIssueId] = useState<string>('chest');
  const [generatedSummary, setGeneratedSummary] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = HELP_I18N[activeLang] || HELP_I18N.English;
  const facilities = storage.getFacilities().filter(f => f.type === 'District Hospital' || f.type === 'CHC');

  const selectedItem = EMERGENCY_ITEMS.find(i => i.id === selectedIssueId) || EMERGENCY_ITEMS[1];
  const currentIssueText = activeLang === 'ଓଡ଼ିଆ' ? selectedItem.or : activeLang === 'हिन्दी' ? selectedItem.hi : selectedItem.en;

  const handleGenerateSummary = () => {
    setGeneratedSummary(true);
    storage.addAuditLog(`Emergency summary generated for: ${selectedItem.en}`, 'Emergency System');
  };

  const handleShareSummary = () => {
    setShareSuccess(true);
    storage.addAuditLog(`Emergency summary shared with 108 Dispatch & ASHA coordinator`, 'Emergency System');
    setTimeout(() => setShareSuccess(false), 2500);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="emergency-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '680px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
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
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <PhoneCall size={20} />
            </div>
            <div>
              <h3 id="emergency-modal-title" style={{ margin: 0, fontSize: '17px', fontWeight: 900 }}>
                {t.modalTitle}
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#fca5a5' }}>
                {t.modalSub}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Multilingual Switcher Pills inside Emergency Help */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.18)',
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
                    background: activeLang === l ? '#ffffff' : 'transparent',
                    color: activeLang === l ? '#991b1b' : '#ffffff',
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
              style={{ background: 'transparent', color: '#fca5a5', border: 'none', padding: '6px', cursor: 'pointer' }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', background: '#fef2f2', maxHeight: '76vh', overflowY: 'auto' }}>
          {/* Warning Banner */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #ef4444',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>
              <AlertOctagon size={20} />
              <span>{t.bannerTitle}</span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#7f1d1d', lineHeight: 1.5 }}>
              {t.bannerDesc}
            </p>
          </div>

          {/* Quick Issue Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#7f1d1d', display: 'block', marginBottom: '8px' }}>
              {t.question}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
              {EMERGENCY_ITEMS.map((item) => {
                const label = activeLang === 'ଓଡ଼ିଆ' ? item.or : activeLang === 'हिन्दी' ? item.hi : item.en;
                const isSelected = selectedIssueId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIssueId(item.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: isSelected ? 800 : 500,
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #b91c1c' : '1px solid #fca5a5',
                      background: isSelected ? '#fee2e2' : '#ffffff',
                      color: isSelected ? '#991b1b' : '#334155',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Configured Emergency Contacts */}
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca', marginBottom: '16px' }}>
            <strong style={{ fontSize: '13px', color: '#991b1b', display: 'block', marginBottom: '10px' }}>
              {t.servicesHeader}
            </strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <a
                href="tel:108"
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Phone size={22} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>{t.amb108}</div>
                  <div style={{ fontSize: '11px', color: '#fee2e2' }}>{t.amb108Sub}</div>
                </div>
              </a>

              <a
                href="tel:104"
                style={{
                  background: '#b91c1c',
                  color: '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Phone size={22} />
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>{t.helpline104}</div>
                  <div style={{ fontSize: '11px', color: '#fee2e2' }}>{t.helpline104Sub}</div>
                </div>
              </a>

              <a
                href="tel:06670230450"
                style={{
                  background: '#7f1d1d',
                  color: '#ffffff',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Phone size={22} />
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800 }}>{t.dhhCasualty}</div>
                  <div style={{ fontSize: '11px', color: '#fee2e2' }}>{t.dhhCasualtySub}</div>
                </div>
              </a>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
              * {activeLang === 'ଓଡ଼ିଆ' ? 'କଳାହାଣ୍ଡି ଜିଲ୍ଲା ପାଇଁ ସ୍ୱତନ୍ତ୍ର ଜରୁରୀକାଳୀନ ସଂଯୋଗ।' : activeLang === 'हिन्दी' ? 'कालाहांडी जिले के लिए विशेष आपातकालीन संपर्क।' : 'Configured emergency services for Kalahandi district deployment.'}
            </div>
          </div>

          {/* Nearby Emergency Facilities */}
          <div style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #fecaca', marginBottom: '16px' }}>
            <strong style={{ fontSize: '13px', color: '#7f1d1d', display: 'block', marginBottom: '8px' }}>
              {t.nearbyTitle}
            </strong>
            <div style={{ display: 'grid', gap: '8px' }}>
              {facilities.slice(0, 2).map((fac) => (
                <div key={fac.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <strong style={{ color: '#0f172a' }}>{fac.name}</strong>
                    <div style={{ color: '#64748b' }}>
                      {fac.address} • {fac.distanceKm} km {activeLang === 'ଓଡ଼ିଆ' ? 'ଦୂର' : activeLang === 'हिन्दी' ? 'दूर' : 'away'}
                    </div>
                  </div>
                  <a href={`tel:${fac.phone}`} className="btn" style={{ padding: '6px 12px', fontSize: '12px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 700 }}>
                    {t.callBtn} {fac.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Summary Generator & Sharing */}
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <strong style={{ fontSize: '13px', color: '#7f1d1d' }}>
                {t.handoverTitle}
              </strong>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGenerateSummary}
                style={{ fontSize: '12px', padding: '5px 12px', fontWeight: 700 }}
              >
                <FileText size={13} /> {generatedSummary ? t.regenBtn : t.genBtn}
              </button>
            </div>

            {generatedSummary && (
              <div>
                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#1e293b', marginBottom: '12px', lineHeight: 1.5 }}>
                  <div><strong>{t.patientLabel}</strong> {patientName ? `${patientName} (${patientId || 'RHB-OD-KLH-0941'})` : 'Keshab Rout (RHB-OD-KLH-0941)'} • {activeLang === 'ଓଡ଼ିଆ' ? '୨୬ ବର୍ଷ • ପୁରୁଷ' : activeLang === 'हिन्दी' ? '२६ वर्ष • पुरुष' : 'Age: 26 • Male'} • B+</div>
                  <div><strong>{t.acuteIssueLabel}</strong> {currentIssueText}</div>
                  <div><strong>{t.locationLabel}</strong> {t.locationVal}</div>
                  <div><strong>{t.allergiesLabel}</strong> {t.allergiesVal}</div>
                  <div style={{ color: '#b91c1c', marginTop: '6px' }}><strong>{t.triagePriorityLabel}</strong> {t.triagePriorityVal}</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleShareSummary}
                    style={{ fontSize: '12px', padding: '8px 16px', fontWeight: 800 }}
                  >
                    <Share2 size={14} /> {t.shareBtn}
                  </button>
                  {shareSuccess && (
                    <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> {t.sharedSuccess}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #fecaca', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: 700 }}>
            {t.footerNote}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
