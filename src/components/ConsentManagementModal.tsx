import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Check, AlertCircle, RefreshCw, Key, Lock, Eye, FileText } from 'lucide-react';
import { ConsentItem, Language } from '../types';
import { storage } from '../utils/storage';

interface ConsentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  lang?: Language;
}

const CONSENT_I18N: Record<Language, {
  title: string;
  sub: string;
  noticeUpdated: string;
  abhaHeader: string;
  abhaBadge: string;
  abhaIdLabel: string;
  abhaAddressLabel: string;
  permissionsTitle: string;
  permissionsDesc: string;
  sharedDataLabel: string;
  purposeLabel: string;
  validityLabel: string;
  expiresLabel: string;
  btnRevoke: string;
  btnGrant: string;
  btnDone: string;
}> = {
  English: {
    title: 'MY DATA & CONSENT MANAGEMENT',
    sub: 'ABDM-Inspired Consent Manager • Patient-Centric Health Privacy',
    noticeUpdated: 'Consent state updated and saved locally in browser sandbox.',
    abhaHeader: 'ABHA & Digital Health Profile',
    abhaBadge: 'ABDM integration is simulated in this prototype',
    abhaIdLabel: 'ABHA ID (14-Digit):',
    abhaAddressLabel: 'ABHA Address:',
    permissionsTitle: 'Active Health Data Access Permissions',
    permissionsDesc: 'You maintain total control over which healthcare providers can access your longitudinal health record.',
    sharedDataLabel: 'Shared Data:',
    purposeLabel: 'Purpose:',
    validityLabel: 'Validity:',
    expiresLabel: 'Expires:',
    btnRevoke: 'Revoke Consent',
    btnGrant: 'Grant Consent',
    btnDone: 'Done'
  },
  'ଓଡ଼ିଆ': {
    title: 'ମୋର ତଥ୍ୟ ଓ ସମ୍ମତି ପରିଚାଳନା',
    sub: 'ABDM-ପ୍ରେରିତ ସମ୍ମତି ପରିଚାଳକ • ରୋଗୀ ଗୋପନୀୟତା ସୁରକ୍ଷା',
    noticeUpdated: 'ସମ୍ମତି ସ୍ଥିତି ସଫଳତାର ସହ ଅଦ୍ୟତନ କରାଗଲା।',
    abhaHeader: 'ABHA ଓ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରୋଫାଇଲ୍',
    abhaBadge: 'ପ୍ରୋଟୋଟାଇପ୍ ରେ ABDM ସିମୁଲେସନ୍ ସକ୍ରିୟ',
    abhaIdLabel: 'ABHA ଆଇଡି (୧୪-ଅଙ୍କ ବିଶିଷ୍ଟ):',
    abhaAddressLabel: 'ABHA ଠିକଣା:',
    permissionsTitle: 'ସକ୍ରିୟ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ଅନୁମତି ସମୂହ',
    permissionsDesc: 'କେଉଁ ଡାକ୍ତରଖାନା ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ଦେଖିପାରିବେ, ତାହା ଉପରେ ଆପଣଙ୍କର ସମ୍ପୂର୍ଣ୍ଣ ନିୟନ୍ତ୍ରଣ ରହିଛି।',
    sharedDataLabel: 'ଅଂଶୀଦାର ତଥ୍ୟ:',
    purposeLabel: 'ଉଦ୍ଦେଶ୍ୟ:',
    validityLabel: 'ବୈଧତା:',
    expiresLabel: 'ମିଆଦ ଶେଷ:',
    btnRevoke: 'ସମ୍ମତି ପ୍ରତ୍ୟାହାର କରନ୍ତୁ',
    btnGrant: 'ସମ୍ମତି ପ୍ରଦାନ କରନ୍ତୁ',
    btnDone: 'ସମ୍ପନ୍ନ'
  },
  'हिन्दी': {
    title: 'मेरा डेटा और सहमति प्रबंधन',
    sub: 'ABDM-प्रेरित सहमति प्रबंधक • रोगी केंद्रित स्वास्थ्य गोपनीयता',
    noticeUpdated: 'सहमति स्थिति सफलतापूर्वक अपडेट की गई।',
    abhaHeader: 'ABHA एवं डिजिटल स्वास्थ्य प्रोफाइल',
    abhaBadge: 'प्रोटोटाइप में ABDM सिमुलेशन सक्रिय',
    abhaIdLabel: 'ABHA आईडी (14-अंकीय):',
    abhaAddressLabel: 'ABHA पता:',
    permissionsTitle: 'सक्रिय स्वास्थ्य डेटा पहुंच अनुमतियाँ',
    permissionsDesc: 'कौन से स्वास्थ्य प्रदाता आपके मेडिकल रिकॉर्ड तक पहुंच सकते हैं, इस पर आपका पूरा नियंत्रण है।',
    sharedDataLabel: 'साझा डेटा:',
    purposeLabel: 'उद्देश्य:',
    validityLabel: 'वैधता:',
    expiresLabel: 'समाप्ति:',
    btnRevoke: 'सहमति वापस लें',
    btnGrant: 'सहमति प्रदान करें',
    btnDone: 'पूर्ण'
  }
};

export const ConsentManagementModal: React.FC<ConsentManagementModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  lang = 'English'
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [consents, setConsents] = useState<ConsentItem[]>(storage.getConsents());
  const [abhaId, setAbhaId] = useState('98-2143-8765-1094');
  const [abhaAddress, setAbhaAddress] = useState('keshabrout@abdm');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = CONSENT_I18N[activeLang] || CONSENT_I18N.English;

  const handleToggle = (id: string) => {
    const updated = storage.toggleConsent(id);
    setConsents([...updated]);
    setNotice(t.noticeUpdated);
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="consent-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '640px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
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
              <Lock size={18} />
            </div>
            <div>
              <h3 id="consent-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
                {t.title}
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                {t.sub}
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

        {/* Content */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '74vh', overflowY: 'auto' }}>
          {notice && (
            <div className="alert ok" style={{ marginBottom: '14px' }}>
              <Check size={16} /> {notice}
            </div>
          )}

          {/* ABHA Simulated Identity Section */}
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} color="#0284c7" />
                <strong style={{ fontSize: '14px', color: '#071c42' }}>{t.abhaHeader}</strong>
              </div>
              <span className="badge badge-blue" style={{ fontSize: '10px' }}>
                {t.abhaBadge}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', fontSize: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>{t.abhaIdLabel}</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace' }}>{abhaId}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>{t.abhaAddressLabel}</span>
                <strong style={{ color: '#0284c7' }}>{abhaAddress}</strong>
              </div>
            </div>
          </div>

          {/* Active Consent Artifacts */}
          <div style={{ marginBottom: '12px' }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#071c42' }}>
              {t.permissionsTitle}
            </h4>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
              {t.permissionsDesc}
            </p>

            <div className="data-list">
              {consents.map((c) => (
                <div key={c.id} className="data-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{c.party}</strong>
                      <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
                        {t.sharedDataLabel} <strong>{c.dataType}</strong>
                      </div>
                    </div>
                    <span className={`badge ${c.status === 'Granted' ? 'badge-green' : 'badge-red'}`}>
                      {c.status === 'Granted' ? (activeLang === 'ଓଡ଼ିଆ' ? 'ଅନୁମୋଦିତ' : activeLang === 'हिन्दी' ? 'स्वीकृत' : 'GRANTED') : (activeLang === 'ଓଡ଼ିଆ' ? 'ପ୍ରତ୍ୟାହୃତ' : activeLang === 'हिन्दी' ? 'रद्द' : 'REVOKED')}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '6px 8px', borderRadius: '4px' }}>
                    <strong>{t.purposeLabel}</strong> {c.purpose} • <strong>{t.validityLabel}</strong> {c.duration} ({t.expiresLabel} {c.expiresAt})
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      className={`btn ${c.status === 'Granted' ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => handleToggle(c.id)}
                      style={{ fontSize: '11px', padding: '4px 12px' }}
                    >
                      {c.status === 'Granted' ? t.btnRevoke : t.btnGrant}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            {t.btnDone}
          </button>
        </div>
      </div>
    </div>
  );
};
