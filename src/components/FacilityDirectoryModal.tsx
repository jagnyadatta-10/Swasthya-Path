import React, { useState, useEffect } from 'react';
import { Building2, X, Search, MapPin, Phone, Video, CheckCircle2, Shield } from 'lucide-react';
import { HealthFacility, Language } from '../types';
import { storage } from '../utils/storage';

interface FacilityDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Language;
}

const FAC_I18N: Record<Language, {
  title: string;
  sub: string;
  disclaimer: string;
  searchPlaceholder: string;
  allTypes: string;
  districtHospitals: string;
  chcs: string;
  phcs: string;
  pharmacies: string;
  kmAway: string;
  teleOpd: string;
  btnCall: string;
  btnClose: string;
}> = {
  English: {
    title: 'Kalahandi Health Facility Directory',
    sub: 'ABDM-Inspired Health Facility Registry (HFR) • Public & Private Network',
    disclaimer: '* Verified prototype directory for Kalahandi district healthcare navigation. Facility distances and services are simulated for demonstration.',
    searchPlaceholder: 'Search facility name, block, or service (e.g. DHH, Junagarh, Dialysis)...',
    allTypes: 'All Types',
    districtHospitals: 'District Hospitals',
    chcs: 'CHCs (Community Health)',
    phcs: 'PHCs (Primary Health)',
    pharmacies: 'Pharmacies (Jan Aushadhi)',
    kmAway: 'km away',
    teleOpd: 'Live Tele-OPD Node Connected',
    btnCall: 'Call',
    btnClose: 'Close Directory'
  },
  'ଓଡ଼ିଆ': {
    title: 'କଳାହାଣ୍ଡି ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ତାଲିକା',
    sub: 'ABDM-ଆଧାରିତ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ପଞ୍ଜିକା (HFR) • ସରକାରୀ ଓ ଔଷଧ ନେଟୱାର୍କ',
    disclaimer: '* କଳାହାଣ୍ଡି ଜିଲ୍ଲାର ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା ପାଇଁ ଯାଞ୍ଚ ହୋଇଥିବା କେନ୍ଦ୍ର ତାଲିକା।',
    searchPlaceholder: 'ଡାକ୍ତରଖାନା, ବ୍ଲକ କିମ୍ବା ସେବା ଖୋଜନ୍ତୁ (ଯଥା: DHH, ଜୁନାଗଡ଼, ଡାଏଲିସିସ୍)...',
    allTypes: 'ସମସ୍ତ ପ୍ରକାର',
    districtHospitals: 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ',
    chcs: 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC)',
    phcs: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (PHC)',
    pharmacies: 'ଜନ ଔଷଧି କେନ୍ଦ୍ର (ଔଷଧ ଦୋକାନ)',
    kmAway: 'କି.ମି. ଦୂର',
    teleOpd: 'ଲାଇଭ୍ ଟେଲି-OPD ସଂଯୁକ୍ତ ଅଛି',
    btnCall: 'କଲ୍ କରନ୍ତୁ',
    btnClose: 'ତାଲିକା ବନ୍ଦ କରନ୍ତୁ'
  },
  'हिन्दी': {
    title: 'कालाहांडी स्वास्थ्य केंद्र निर्देशिका',
    sub: 'ABDM-आधारित स्वास्थ्य सुविधा रजिस्ट्री (HFR) • सार्वजनिक नेटवर्क',
    disclaimer: '* कालाहांडी जिले के लिए सत्यापित स्वास्थ्य केंद्र निर्देशिका।',
    searchPlaceholder: 'अस्पताल, ब्लॉक या सेवा खोजें (उदा. DHH, जूनागढ़, डायलिसिस)...',
    allTypes: 'सभी प्रकार',
    districtHospitals: 'जिला अस्पताल',
    chcs: 'सामुदायिक स्वास्थ्य केंद्र (CHC)',
    phcs: 'प्राथमिक स्वास्थ्य केंद्र (PHC)',
    pharmacies: 'जन औषधि केंद्र (दवा दुकानें)',
    kmAway: 'किमी दूर',
    teleOpd: 'लाइव टेली-ओपीडी केंद्र सक्रिय',
    btnCall: 'कॉल करें',
    btnClose: 'निर्देशिका बंद करें'
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

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen) return null;

  const t = FAC_I18N[activeLang] || FAC_I18N.English;
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
              <Building2 size={18} />
            </div>
            <div>
              <h3 id="facility-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>
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
          {/* Disclaimer */}
          <div style={{ background: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '11px', color: '#0369a1', marginBottom: '14px' }}>
            {t.disclaimer}
          </div>

          {/* Search & Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '14px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.searchPlaceholder}
                style={{ width: '100%', paddingLeft: '34px', fontSize: '13px' }}
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
                      {activeLang === 'ଓଡ଼ିଆ' ? 'ରେଫରାଲ୍ ସୁବିଧା' : activeLang === 'हिन्दी' ? 'रेफरल उपलब्ध' : fac.referralStatus}
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
                      <Video size={12} /> {t.teleOpd}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <a
                    href={`tel:${fac.phone}`}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                  >
                    <Phone size={12} /> {t.btnCall} {fac.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
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
