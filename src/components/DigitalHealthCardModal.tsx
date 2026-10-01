import React, { useState, useEffect } from 'react';
import { CreditCard, X, QrCode, Shield, Download, Check, FileText } from 'lucide-react';
import { DemoUser, Language } from '../types';

interface DigitalHealthCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: DemoUser;
  onViewFullRecord?: () => void;
  lang?: Language;
}

const CARD_I18N: Record<Language, {
  modalTitle: string;
  modalSub: string;
  govtHeader: string;
  cardName: string;
  patientNameLabel: string;
  patientIdLabel: string;
  ageGenderLabel: string;
  years: string;
  male: string;
  female: string;
  bloodGroupLabel: string;
  abhaIdLabel: string;
  scanOpd: string;
  locationLabel: string;
  allergiesLabel: string;
  noAllergies: string;
  emergencyContactLabel: string;
  privacyNotice: string;
  btnDownload: string;
  btnDownloaded: string;
  btnViewRecord: string;
}> = {
  English: {
    modalTitle: 'Kalahandi Rural Digital Health Card',
    modalSub: 'Low-Bandwidth Telehealth & Care-Navigation Identification',
    govtHeader: 'Government of Odisha • Kalahandi District Telehealth',
    cardName: 'SWASTHYA PATH SMART HEALTH ID',
    patientNameLabel: 'Patient Full Name',
    patientIdLabel: 'Patient ID:',
    ageGenderLabel: 'Age / Gender:',
    years: 'yrs',
    male: 'Male',
    female: 'Female',
    bloodGroupLabel: 'Blood Group:',
    abhaIdLabel: 'ABHA ID:',
    scanOpd: 'SCAN FOR OPD',
    locationLabel: 'Location:',
    allergiesLabel: 'Allergies:',
    noAllergies: 'No known drug allergies',
    emergencyContactLabel: 'Emergency Contact:',
    privacyNotice: '“Your information is used to support your healthcare journey.” Consent is verified before each teleconsultation.',
    btnDownload: 'Download Offline Card',
    btnDownloaded: 'Card Downloaded (PDF)',
    btnViewRecord: 'View Full Health Record'
  },
  'ଓଡ଼ିଆ': {
    modalTitle: 'କଳାହାଣ୍ଡି ଗ୍ରାମୀଣ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ',
    modalSub: 'ସ୍ୱଳ୍ପ ଇଣ୍ଟରନେଟ୍ ଟେଲି-ହେଲ୍ଥ ଏବଂ ଚିକିତ୍ସା ପରିଚୟ ପତ୍ର',
    govtHeader: 'ଓଡ଼ିଶା ସରକାର • କଳାହାଣ୍ଡି ଜିଲ୍ଲା ଟେଲି-ହେଲ୍ଥ',
    cardName: 'ସ୍ୱାସ୍ଥ୍ୟ ପଥ ସ୍ମାର୍ଟ ସ୍ୱାସ୍ଥ୍ୟ ID',
    patientNameLabel: 'ରୋଗୀଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ନାମ',
    patientIdLabel: 'ରୋଗୀ ID:',
    ageGenderLabel: 'ବୟସ / ଲିଙ୍ଗ:',
    years: 'ବର୍ଷ',
    male: 'ପୁରୁଷ',
    female: 'ମହିଳା',
    bloodGroupLabel: 'ରକ୍ତ ବର୍ଗ:',
    abhaIdLabel: 'ଆଭା (ABHA) ID:',
    scanOpd: 'OPD ସ୍କାନ୍ କରନ୍ତୁ',
    locationLabel: 'ଠିକଣା:',
    allergiesLabel: 'ଏଲର୍ଜି:',
    noAllergies: 'କୌଣସି ଜଣାଶୁଣା ଏଲର୍ଜି ନାହିଁ',
    emergencyContactLabel: 'ଜରୁରୀକାଳୀନ ଯୋଗାଯୋଗ:',
    privacyNotice: '“ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ କେବଳ ଚିକିତ୍ସା ସେବା ପାଇଁ ବ୍ୟବହୃତ ହୁଏ।” ପ୍ରତ୍ୟେକ ପରାମର୍ଶ ପୂର୍ବରୁ ସହମତି ଯାଞ୍ଚ କରାଯାଏ।',
    btnDownload: 'ଅଫଲାଇନ୍ କାର୍ଡ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    btnDownloaded: 'କାର୍ଡ ଡାଉନଲୋଡ୍ ହୋଇଗଲା (PDF)',
    btnViewRecord: 'ସମ୍ପୂର୍ଣ୍ଣ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ଦେଖନ୍ତୁ'
  },
  'हिन्दी': {
    modalTitle: 'कालाहांडी ग्रामीण डिजिटल स्वास्थ्य कार्ड',
    modalSub: 'कम इंटरनेट टेलीहेल्थ एवं चिकित्सा पहचान पत्र',
    govtHeader: 'ओडिशा सरकार • कालाहांडी जिला टेलीहेल्थ',
    cardName: 'स्वास्थ्य पथ स्मार्ट हेल्थ ID',
    patientNameLabel: 'रोगी का पूरा नाम',
    patientIdLabel: 'रोगी ID:',
    ageGenderLabel: 'उम्र / लिंग:',
    years: 'वर्ष',
    male: 'पुरुष',
    female: 'महिला',
    bloodGroupLabel: 'रक्त समूह:',
    abhaIdLabel: 'आभा (ABHA) ID:',
    scanOpd: 'OPD स्कैन करें',
    locationLabel: 'स्थान:',
    allergiesLabel: 'एलर्जी:',
    noAllergies: 'कोई ज्ञात दवा एलर्जी नहीं',
    emergencyContactLabel: 'आपातकालीन संपर्क:',
    privacyNotice: '“आपकी जानकारी केवल आपकी स्वास्थ्य सेवा के लिए उपयोग की जाती है।” प्रत्येक परामर्श से पहले सहमति ली जाती है।',
    btnDownload: 'ऑफ़लाइन कार्ड डाउनलोड करें',
    btnDownloaded: 'कार्ड डाउनलोड हो गया (PDF)',
    btnViewRecord: 'संपूर्ण स्वास्थ्य रिकॉर्ड देखें'
  }
};

export const DigitalHealthCardModal: React.FC<DigitalHealthCardModalProps> = ({
  isOpen,
  onClose,
  user,
  onViewFullRecord,
  lang = 'English'
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = CARD_I18N[activeLang] || CARD_I18N.English;

  const patientId = user.patientId || 'RHB-OD-KLH-0941';
  const abhaId = user.abhaId || '91-8472-9102-4821';
  const bloodGroup = user.bloodGroup || 'B+';
  const allergies = user.allergies || t.noAllergies;
  const emergencyContact = user.emergencyContact || '+91 94370 12345 (Family)';
  const location = user.location || (activeLang === 'ଓଡ଼ିଆ' ? 'କଳାହାଣ୍ଡି, ଓଡ଼ିଶା' : activeLang === 'हिन्दी' ? 'कालाहांडी, ओडिशा' : 'Kalahandi, Odisha');
  const genderText = user.gender === 'Female' ? t.female : t.male;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="card-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '580px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0c3672 100%)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
              <CreditCard size={18} />
            </div>
            <div>
              <h3 id="card-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                {t.modalTitle}
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                {t.modalSub}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                    padding: '3px 8px',
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
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px', background: '#f8fafc' }}>
          {/* THE HEALTH CARD CONTAINER */}
          <div style={{
            background: 'linear-gradient(135deg, #0a1f44 0%, #0d2e61 50%, #071936 100%)',
            borderRadius: '16px',
            color: '#ffffff',
            padding: '20px 22px',
            boxShadow: '0 12px 28px rgba(7, 28, 66, 0.35)',
            border: '1.5px solid rgba(25, 211, 255, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Watermark/Emblem overlay */}
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-20px',
              opacity: 0.05,
              pointerEvents: 'none'
            }}>
              <Shield size={240} />
            </div>

            {/* Top row: State / Project & Chip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800 }}>
                  {t.govtHeader}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.03em' }}>
                  {t.cardName}
                </div>
              </div>

              {/* Digital Chip Simulation */}
              <div style={{
                width: '38px',
                height: '28px',
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                borderRadius: '6px',
                border: '1px solid #fef08a',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)'
              }} />
            </div>

            {/* Middle: Patient Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t.patientNameLabel}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  {user.name}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>{t.patientIdLabel} </span>
                    <strong style={{ color: '#38bdf8', fontFamily: 'monospace', fontSize: '13px' }}>{patientId}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>{t.ageGenderLabel} </span>
                    <strong style={{ color: '#ffffff' }}>{user.age || 26} {t.years} • {genderText}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>{t.bloodGroupLabel} </span>
                    <strong style={{ color: '#f87171' }}>{bloodGroup}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>{t.abhaIdLabel} </span>
                    <strong style={{ color: '#cbd5e1', fontSize: '11px' }}>{abhaId}</strong>
                  </div>
                </div>
              </div>

              {/* QR Code Demo Box */}
              <div style={{
                background: '#ffffff',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}>
                <QrCode size={68} color="#0a1f44" />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#0a1f44', marginTop: '4px' }}>
                  {t.scanOpd}
                </span>
              </div>
            </div>

            {/* Bottom Details Row */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              paddingTop: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              fontSize: '11px'
            }}>
              <div>
                <span style={{ color: '#94a3b8', display: 'block' }}>{t.locationLabel}</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>{location}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block' }}>{t.allergiesLabel}</span>
                <span style={{ color: '#fca5a5', fontWeight: 600 }}>{allergies}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block' }}>{t.emergencyContactLabel}</span>
                <span style={{ color: '#86efac', fontWeight: 600 }}>{emergencyContact}</span>
              </div>
            </div>
          </div>

          {/* Privacy & Healthcare Statement */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '14px',
            padding: '10px 14px',
            background: '#e0f2fe',
            borderRadius: '10px',
            color: '#0369a1',
            fontSize: '12px'
          }}>
            <Shield size={16} style={{ flexShrink: 0 }} />
            <span>{t.privacyNotice}</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '18px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDownload}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {downloadSuccess ? <Check size={16} color="#059669" /> : <Download size={16} />}
              <span>{downloadSuccess ? t.btnDownloaded : t.btnDownload}</span>
            </button>

            {onViewFullRecord && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  onClose();
                  onViewFullRecord();
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}
              >
                <FileText size={16} />
                <span>{t.btnViewRecord}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
