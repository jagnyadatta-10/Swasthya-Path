import React, { useState } from 'react';
import { Building2, X, Search, MapPin, Phone, Video, CheckCircle2, Shield } from 'lucide-react';
import { HealthFacility, Language } from '../types';
import { storage } from '../utils/storage';

interface FacilityDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

const FACILITY_I18N: Record<Language, {
  modalTitle: string;
  modalSub: string;
  disclaimer: string;
  searchPlaceholder: string;
  allTypes: string;
  districtHospitals: string;
  chcs: string;
  phcs: string;
  pharmacies: string;
  kmAway: string;
  teleOpdConnected: string;
  callBtn: string;
  closeBtn: string;
}> = {
  English: {
    modalTitle: 'Kalahandi Health Facility Directory',
    modalSub: 'ABDM-Inspired Health Facility Registry (HFR) • Public & Private Network',
    disclaimer: '* Verified directory for Kalahandi district healthcare navigation. Facility distances and services are simulated for demonstration.',
    searchPlaceholder: 'Search facility name, block, or service (e.g. DHH, Junagarh, Dialysis)...',
    allTypes: 'All Types',
    districtHospitals: 'District Hospitals',
    chcs: 'Community Health Centers (CHCs)',
    phcs: 'Primary Health Centers (PHCs)',
    pharmacies: 'Pharmacies',
    kmAway: 'km away',
    teleOpdConnected: 'Live Tele-OPD Node Connected',
    callBtn: 'Call',
    closeBtn: 'Close Directory'
  },
  'ଓଡ଼ିଆ': {
    modalTitle: 'କଳାହାଣ୍ଡି ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ତାଲିକା',
    modalSub: 'ABDM ପ୍ରେରିତ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ରେଜିଷ୍ଟ୍ରି (HFR) • ସରକାରୀ ଓ ଔଷଧ ନେଟୱର୍କ',
    disclaimer: '* କଳାହାଣ୍ଡି ଜିଲ୍ଲାର ପ୍ରାଥମିକ, ଗୋଷ୍ଠୀ ଏବଂ ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟର ସୂଚନା।',
    searchPlaceholder: 'ଡାକ୍ତରଖାନା ନାମ, ବ୍ଲକ ବା ସେବା ଖୋଜନ୍ତୁ (ଯଥା: DHH, ଜୁନାଗଡ଼)...',
    allTypes: 'ସମସ୍ତ ପ୍ରକାର',
    districtHospitals: 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ',
    chcs: 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC)',
    phcs: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (PHC)',
    pharmacies: 'ଔଷଧ ଦୋକାନ (ଫାର୍ମାସୀ)',
    kmAway: 'କି.ମି. ଦୂର',
    teleOpdConnected: 'ଲାଇଭ୍ ଟେଲି-OPD ସଂଯୋଗ ଅଛି',
    callBtn: 'କଲ୍ କରନ୍ତୁ',
    closeBtn: 'ବନ୍ଦ କରନ୍ତୁ'
  },
  'हिन्दी': {
    modalTitle: 'कालाहांडी स्वास्थ्य केंद्र निर्देशिका',
    modalSub: 'ABDM स्वास्थ्य केंद्र रजिस्ट्री (HFR) • सरकारी एवं निजी नेटवर्क',
    disclaimer: '* कालाहांडी जिले के प्राथमिक, सामुदायिक और जिला अस्पतालों की जानकारी।',
    searchPlaceholder: 'अस्पताल का नाम, ब्लॉक या सेवा खोजें (उदा. DHH, जूनागढ़)...',
    allTypes: 'सभी प्रकार',
    districtHospitals: 'जिला अस्पताल',
    chcs: 'सामुदायिक स्वास्थ्य केंद्र (CHC)',
    phcs: 'प्राथमिक स्वास्थ्य केंद्र (PHC)',
    pharmacies: 'दवा दुकानें (फार्मेसी)',
    kmAway: 'किमी दूर',
    teleOpdConnected: 'लाइव टेली-OPD नोड सक्रिय',
    callBtn: 'कॉल करें',
    closeBtn: 'बंद करें'
  }
};

export const FacilityDirectoryModal: React.FC<FacilityDirectoryModalProps> = ({
  isOpen,
  onClose,
  lang = 'English'
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = FACILITY_I18N[activeLang] || FACILITY_I18N.English;
  const facilities = storage.getFacilities();

  const filtered = facilities.filter(f => {
    const matchesType = filterType === 'All' || f.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = !searchTerm ||
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="facility-modal-title">
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
              <Building2 size={18} />
            </div>
            <div>
              <h3 id="facility-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
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
          {/* Disclaimer */}
          <div style={{ background: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '11px', color: '#0369a1', marginBottom: '14px' }}>
            {t.disclaimer}
          </div>

          {/* Search & Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '14px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                style={{ width: '100%', paddingLeft: '34px', fontSize: '13px', borderRadius: '8px', border: '1.5px solid #cbd5e1' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
            >
              <option value="All">{t.allTypes}</option>
              <option value="District Hospital">{t.districtHospitals}</option>
              <option value="CHC">{t.chcs}</option>
              <option value="PHC">{t.phcs}</option>
              <option value="Pharmacy">{t.pharmacies}</option>
            </select>
          </div>

          {/* Facility List */}
          <div className="data-list">
            {filtered.map((fac) => (
              <div key={fac.id} className="data-item" style={{ alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '15px', color: '#071c42' }}>{fac.name}</strong>
                    <span className="badge badge-blue" style={{ fontSize: '10px' }}>{fac.type}</span>
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ରେଫରାଲ୍ ଗ୍ରହଣ କରୁଛି' : activeLang === 'हिन्दी' ? 'रेफरल स्वीकृत' : fac.referralStatus}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} style={{ flexShrink: 0 }} />
                    <span>{fac.address} • <strong>{fac.distanceKm} {t.kmAway}</strong></span>
                  </div>

                  <div style={{ marginTop: '6px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {fac.services.map((svc, sIdx) => (
                      <span key={sIdx} style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', color: '#334155' }}>
                        {svc}
                      </span>
                    ))}
                  </div>

                  {fac.teleconsultAvailable && (
                    <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Video size={12} /> {t.teleOpdConnected}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <a
                    href={`tel:${fac.phone}`}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontWeight: 700 }}
                  >
                    <Phone size={12} /> {t.callBtn} {fac.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
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
