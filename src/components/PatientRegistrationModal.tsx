import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck, Check, Heart, Phone, MapPin, AlertCircle } from 'lucide-react';
import { DemoUser, KalahandiBlock, Language } from '../types';

interface PatientRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistered: (user: DemoUser) => void;
  lang: Language;
}

export const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistered,
  lang
}) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(26);
  const [gender, setGender] = useState('Female');
  const [mobile, setMobile] = useState('+91 9');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [district] = useState('Kalahandi');
  const [block, setBlock] = useState<KalahandiBlock>('Bhawanipatna');
  const [preferredLang, setPreferredLang] = useState<Language>(lang);
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergies, setAllergies] = useState('No known drug allergies');
  const [conditions, setConditions] = useState('None reported');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [abhaId, setAbhaId] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!consentAgreed) {
      setErrorMsg('Please review and check the teleconsultation consent.');
      return;
    }

    const generatedId = `RHB-OD-KLH-${Math.floor(Math.random() * 8999 + 1000)}`;

    const newUser: DemoUser = {
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@swasthyapath.demo`,
      mobile: mobile.trim(),
      role: 'patient',
      portalTitle: 'Patient Portal',
      badge: `Rural Citizen • ${block}, ${district}`,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      location: `${block}, ${district}, Odisha`,
      patientId: generatedId,
      age: Number(age),
      gender,
      bloodGroup,
      abhaId: abhaId.trim() || `98-${Math.floor(Math.random()*8999+1000)}-${Math.floor(Math.random()*8999+1000)}`,
      allergies,
      conditions,
      emergencyContact,
      block
    };

    onRegistered(newUser);
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="reg-modal-title">
      <div className="modal-dialog" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 id="reg-modal-title" style={{ margin: 0, fontSize: '18px' }}>
                Rural Patient Registration
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--muted)' }}>
                Kalahandi District Telehealth Bridge • Odisha
              </p>
            </div>
          </div>
          <button className="btn" onClick={onClose} style={{ padding: '6px 10px', borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
            “Your information is used to support your healthcare journey and connect with district clinicians.”
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Minati Sahu"
              />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Age *</label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Gender *</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Mobile Number *</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 94370 00000"
              />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Kalahandi Block *</label>
              <select value={block} onChange={(e) => setBlock(e.target.value as KalahandiBlock)}>
                <option value="Bhawanipatna">Bhawanipatna</option>
                <option value="Junagarh">Junagarh</option>
                <option value="Dharamgarh">Dharamgarh</option>
                <option value="Kesinga">Kesinga</option>
                <option value="Narla / Lanjigarh">Narla / Lanjigarh</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Blood Group (Optional)</label>
              <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                <option value="B+">B+</option>
                <option value="A+">A+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>ABHA ID (Ayushman Health Account)</label>
              <input
                type="text"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                placeholder="e.g. 98-2143-8765-1094"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div className="field" style={{ margin: 0 }}>
              <label>Known Drug Allergies</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin or None"
              />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Emergency Contact Phone</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+91 94371 XXXXX"
              />
            </div>
          </div>

          {/* Consent Checkbox */}
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => setConsentAgreed(e.target.checked)}
                style={{ width: 'auto', marginTop: '2px' }}
              />
              <span>
                <strong>Teleconsultation Consent:</strong> I agree to receive healthcare intake and consultation support through this Swasthya Path telemedicine service. I understand that doctors hold sole clinical authority and emergencies require physical hospital care.
              </span>
            </label>
          </div>

          {errorMsg && (
            <div className="alert danger" style={{ margin: 0, padding: '8px 12px', fontSize: '13px' }}>
              <AlertCircle size={15} style={{ display: 'inline', marginRight: '6px' }} />
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
              Complete Registration & Generate ID
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
