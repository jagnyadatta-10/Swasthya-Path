import React, { useState, useEffect } from 'react';
import { UserPlus, X, Send, Check, AlertCircle, Shield, Clock } from 'lucide-react';
import { SpecialistRequest, Language } from '../types';
import { storage } from '../utils/storage';

interface SpecialistRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  referringDoctor?: string;
  patientName?: string;
  patientId?: string;
  onRequestSubmitted?: (req: SpecialistRequest) => void;
  lang?: Language;
}

const SPEC_I18N: Record<Language, {
  title: string;
  sub: string;
  refBannerTitle: string;
  refBannerDoctor: string;
  specLabel: string;
  reasonLabel: string;
  urgencyLabel: string;
  btnCancel: string;
  btnSubmit: string;
  successMsg: string;
}> = {
  English: {
    title: 'Request Specialist Tele-Opinion',
    sub: 'Doctor-to-Doctor Telemedicine Escalation Workflow',
    refBannerTitle: 'Patient Reference:',
    refBannerDoctor: 'Referring Clinician:',
    specLabel: 'Target Specialist Discipline',
    reasonLabel: 'Referral Reason & Clinical Question',
    urgencyLabel: 'Urgency Level',
    btnCancel: 'Cancel',
    btnSubmit: 'Submit Tele-Referral',
    successMsg: 'Specialist tele-opinion request sent successfully!'
  },
  'ଓଡ଼ିଆ': {
    title: 'ବିଶେଷଜ୍ଞ ଡାକ୍ତରୀ ମତାମତ ଅନୁରୋଧ',
    sub: 'ଡାକ୍ତର-ରୁ-ଡାକ୍ତର ଟେଲି-ମେଡିସିନ୍ ରେଫରାଲ୍ ପ୍ରକ୍ରିୟା',
    refBannerTitle: 'ରୋଗୀ ପରିଚୟ:',
    refBannerDoctor: 'ରେଫର୍ କରୁଥିବା ଡାକ୍ତର:',
    specLabel: 'ଆବଶ୍ୟକୀୟ ବିଶେଷଜ୍ଞ ବିଭାଗ',
    reasonLabel: 'ରେଫରାଲ୍ କାରଣ ଓ କ୍ଲିନିକାଲ୍ ପ୍ରଶ୍ନ',
    urgencyLabel: 'ଜରୁରୀକାଳୀନ ସ୍ତର',
    btnCancel: 'ବାତିଲ୍ କରନ୍ତୁ',
    btnSubmit: 'ଟେଲି-ରେଫରାଲ୍ ପ୍ରଦାନ କରନ୍ତୁ',
    successMsg: 'ବିଶେଷଜ୍ଞ ପରାମର୍ଶ ଅନୁରୋଧ ସଫଳତାର ସହ ପଠାଗଲା!'
  },
  'हिन्दी': {
    title: 'विशेषज्ञ चिकित्सक से टेली-परामर्श अनुरोध',
    sub: 'डॉक्टर-से-डॉक्टर टेलीमेडिसिन रेफरल प्रक्रिया',
    refBannerTitle: 'मरीज संदर्भ:',
    refBannerDoctor: 'रेफर करने वाले चिकित्सक:',
    specLabel: 'लक्षित विशेषज्ञ विभाग',
    reasonLabel: 'रेफरल का कारण एवं क्लीनिकल प्रश्न',
    urgencyLabel: 'प्राथमिकता स्तर',
    btnCancel: 'रद्द करें',
    btnSubmit: 'टेली-रेफरल भेजें',
    successMsg: 'विशेषज्ञ परामर्श अनुरोध सफलतापूर्वक भेजा गया!'
  }
};

export const SpecialistRequestModal: React.FC<SpecialistRequestModalProps> = ({
  isOpen,
  onClose,
  referringDoctor = 'Dr. Ananya Mishra',
  patientName = 'Keshab Rout',
  patientId = 'RHB-OD-KLH-0941',
  onRequestSubmitted,
  lang = 'English'
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [requestedSpecialist, setRequestedSpecialist] = useState('Internal Medicine Specialist (MKCG Medical College)');
  const [reason, setReason] = useState('Persistent febrile symptoms requiring secondary clinical opinion and lab review.');
  const [urgency, setUrgency] = useState<'Routine' | 'Urgent' | 'Emergency'>('Routine');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = SPEC_I18N[activeLang] || SPEC_I18N.English;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = storage.addSpecialistRequest({
      referringDoctor,
      requestedSpecialist,
      reason,
      urgency,
      patientId,
      patientName
    });

    storage.addNotification({
      title: 'Doctor-to-Doctor Tele-Consult Requested',
      body: `Demo notification: Referral request for ${requestedSpecialist} initiated for patient ${patientName}.`,
      type: 'doctor'
    });

    setSubmitted(true);
    if (onRequestSubmitted) onRequestSubmitted(req);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="specialist-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '540px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
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
              <UserPlus size={18} />
            </div>
            <div>
              <h3 id="specialist-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', background: '#f8fafc' }}>
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '10px',
            padding: '12px 14px',
            marginBottom: '16px',
            fontSize: '12px'
          }}>
            <div style={{ fontWeight: 700, color: '#0369a1', marginBottom: '4px' }}>
              {t.refBannerTitle} {patientName} ({patientId})
            </div>
            <div style={{ color: '#0c4a6e' }}>
              {t.refBannerDoctor} <strong>{referringDoctor}</strong> • District Hospital Kalahandi
            </div>
          </div>

          <div className="field" style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'block' }}>
              {t.specLabel}
            </label>
            <select
              value={requestedSpecialist}
              onChange={(e) => setRequestedSpecialist(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
            >
              <option value="Internal Medicine Specialist (MKCG Medical College)">Internal Medicine Specialist (MKCG Medical College)</option>
              <option value="Paediatrics Specialist (DHH Kalahandi)">Paediatrics Specialist (DHH Kalahandi)</option>
              <option value="Dermatologist (SCB Medical College Cuttack)">Dermatologist (SCB Medical College Cuttack)</option>
              <option value="Cardiologist / Tele-ECG Unit (Bhubaneswar)">Cardiologist / Tele-ECG Unit (Bhubaneswar)</option>
              <option value="Chest Physician / Pulmonologist">Chest Physician / Pulmonologist</option>
            </select>
          </div>

          <div className="field" style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'block' }}>
              {t.reasonLabel}
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State concise clinical question for the consulting specialist..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
              required
            />
          </div>

          <div className="field" style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'block' }}>
              {t.urgencyLabel}
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(['Routine', 'Urgent', 'Emergency'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgency(lvl)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: urgency === lvl
                      ? (lvl === 'Emergency' ? '2px solid #b42318' : lvl === 'Urgent' ? '2px solid #d97706' : '2px solid #0284c7')
                      : '1px solid #cbd5e1',
                    background: urgency === lvl
                      ? (lvl === 'Emergency' ? '#fef2f2' : lvl === 'Urgent' ? '#fffbeb' : '#f0f9ff')
                      : '#ffffff',
                    color: urgency === lvl
                      ? (lvl === 'Emergency' ? '#b42318' : lvl === 'Urgent' ? '#d97706' : '#0284c7')
                      : '#64748b'
                  }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {submitted && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '10px 12px',
              borderRadius: '8px',
              color: '#065f46',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '14px'
            }}>
              <Check size={16} /> {t.successMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              {t.btnCancel}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitted}
              style={{ fontWeight: 800 }}
            >
              <Send size={15} /> {t.btnSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
