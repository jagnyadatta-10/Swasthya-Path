import React, { useState } from 'react';
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
  modalTitle: string;
  modalSub: string;
  abhaTitle: string;
  abhaSimNotice: string;
  abhaIdLabel: string;
  abhaAddressLabel: string;
  permissionsTitle: string;
  permissionsSub: string;
  sharedDataLabel: string;
  purposeLabel: string;
  validityLabel: string;
  expiresLabel: string;
  grantBtn: string;
  revokeBtn: string;
  updatedNotice: string;
  doneBtn: string;
}> = {
  English: {
    modalTitle: 'MY DATA & CONSENT MANAGEMENT',
    modalSub: 'ABDM-Inspired Consent Manager • Patient-Centric Health Privacy',
    abhaTitle: 'ABHA & Digital Health Profile',
    abhaSimNotice: 'ABDM integration is simulated in this prototype',
    abhaIdLabel: 'ABHA ID (14-Digit):',
    abhaAddressLabel: 'ABHA Address:',
    permissionsTitle: 'Active Health Data Access Permissions',
    permissionsSub: 'You maintain total control over which healthcare providers can access your longitudinal health record.',
    sharedDataLabel: 'Shared Data:',
    purposeLabel: 'Purpose:',
    validityLabel: 'Validity:',
    expiresLabel: 'Expires:',
    grantBtn: 'Grant Consent',
    revokeBtn: 'Revoke Consent',
    updatedNotice: 'Consent state updated and saved locally in browser sandbox.',
    doneBtn: 'Done'
  },
  'ଓଡ଼ିଆ': {
    modalTitle: 'ମୋର ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ଓ ସମ୍ମତି ପରିଚାଳନା',
    modalSub: 'ABDM ଆଧାରିତ ସମ୍ମତି ପରିଚାଳକ • ରୋଗୀଙ୍କ ଗୋପନୀୟତା ସୁରକ୍ଷା',
    abhaTitle: 'ଆଭା (ABHA) ଓ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରୋଫାଇଲ୍',
    abhaSimNotice: 'ଏହି ପ୍ରୋଟୋଟାଇପରେ ABDM ସିମୁଲେସନ୍ କରାଯାଇଛି',
    abhaIdLabel: 'ଆଭା ଆଇଡି (୧୪ ଅଙ୍କ):',
    abhaAddressLabel: 'ଆଭା ଠିକଣା:',
    permissionsTitle: 'ସକ୍ରିୟ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ବ୍ୟବହାର ଅନୁମତି',
    permissionsSub: 'କେଉଁ ଡାକ୍ତରଖାନା ବା ଔଷଧ ଦୋକାନ ଆପଣଙ୍କ ତଥ୍ୟ ଦେଖିପାରିବେ, ତାହା ଆପଣଙ୍କ ହାତରେ ନିୟନ୍ତ୍ରିତ।',
    sharedDataLabel: 'ଅନୁମୋଦିତ ତଥ୍ୟ:',
    purposeLabel: 'ଉଦ୍ଦେଶ୍ୟ:',
    validityLabel: 'ଅବଧି:',
    expiresLabel: 'ସମାପ୍ତି:',
    grantBtn: 'ସମ୍ମତି ଦିଅନ୍ତୁ',
    revokeBtn: 'ସମ୍ମତି ପ୍ରତ୍ୟାହାର କରନ୍ତୁ',
    updatedNotice: 'ସମ୍ମତି ସ୍ଥିତି ସଫଳତାର ସହ ଅପଡେଟ୍ ହେଲା।',
    doneBtn: 'ସମାପ୍ତ'
  },
  'हिन्दी': {
    modalTitle: 'मेरा डेटा एवं सहमति प्रबंधन',
    modalSub: 'ABDM प्रेरित सहमति प्रबंधक • रोगी केंद्रित स्वास्थ्य गोपनीयता',
    abhaTitle: 'आभा (ABHA) एवं डिजिटल स्वास्थ्य प्रोफाइल',
    abhaSimNotice: 'इस प्रोटोटाइप में ABDM सिमुलेशन शामिल है',
    abhaIdLabel: 'आभा आईडी (१४ अंक):',
    abhaAddressLabel: 'आभा पता:',
    permissionsTitle: 'सक्रिय स्वास्थ्य डेटा उपयोग अनुमतियाँ',
    permissionsSub: 'कौन सा अस्पताल या फार्मेसी आपका रिकॉर्ड देख सकता है, इस पर आपका पूरा नियंत्रण है।',
    sharedDataLabel: 'साझा डेटा:',
    purposeLabel: 'उद्देश्य:',
    validityLabel: 'अवधि:',
    expiresLabel: 'समाप्ति:',
    grantBtn: 'सहमति दें',
    revokeBtn: 'सहमति रद्द करें',
    updatedNotice: 'सहमति स्थिति सफलतापूर्वक अपडेट की गई।',
    doneBtn: 'पूर्ण'
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

  React.useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = CONSENT_I18N[activeLang] || CONSENT_I18N.English;

  const handleToggle = (id: string) => {
    const updated = storage.toggleConsent(id);
    setConsents([...updated]);
    setNotice(t.updatedNotice);
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="consent-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '680px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
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
              <Lock size={18} />
            </div>
            <div>
              <h3 id="consent-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
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

        {/* Content */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '74vh', overflowY: 'auto' }}>
          {notice && (
            <div className="alert ok" style={{ marginBottom: '14px' }}>
              <Check size={16} /> {notice}
            </div>
          )}

          {/* ABHA Simulated Identity Section */}
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1.5px solid #cbd5e1', marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key size={16} color="#0284c7" />
                <strong style={{ fontSize: '14px', color: '#071c42' }}>{t.abhaTitle}</strong>
              </div>
              <span className="badge badge-blue" style={{ fontSize: '10px' }}>
                {t.abhaSimNotice}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '12px' }}>
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
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#64748b' }}>
              {t.permissionsSub}
            </p>

            <div className="data-list">
              {consents.map((c) => (
                <div key={c.id} className="data-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0f172a' }}>{c.party}</strong>
                      <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '2px' }}>
                        {t.sharedDataLabel} <strong>{c.dataType}</strong>
                      </div>
                    </div>
                    <span className={`badge ${c.status === 'Granted' ? 'badge-green' : 'badge-red'}`}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '8px 10px', borderRadius: '6px' }}>
                    <strong>{t.purposeLabel}</strong> {c.purpose} • <strong>{t.validityLabel}</strong> {c.duration} ({t.expiresLabel} {c.expiresAt})
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      className={`btn ${c.status === 'Granted' ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => handleToggle(c.id)}
                      style={{ fontSize: '11px', padding: '5px 14px', fontWeight: 700 }}
                    >
                      {c.status === 'Granted' ? t.revokeBtn : t.grantBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose} style={{ fontWeight: 800 }}>
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
