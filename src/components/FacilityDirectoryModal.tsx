import React, { useState } from 'react';
import { Building2, X, Search, MapPin, Phone, Video, CheckCircle2, Shield } from 'lucide-react';
import { HealthFacility } from '../types';
import { storage } from '../utils/storage';

interface FacilityDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FacilityDirectoryModal: React.FC<FacilityDirectoryModalProps> = ({ isOpen, onClose }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

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
          alignItems: 'center'
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
                Kalahandi Health Facility Directory
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                ABDM-Inspired Health Facility Registry (HFR) • Public & Private Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn"
            style={{ background: 'transparent', color: '#cbd5e1', border: 'none', padding: '6px', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', background: '#f8fafc', maxHeight: '74vh', overflowY: 'auto' }}>
          {/* Disclaimer */}
          <div style={{ background: '#f0f9ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '11px', color: '#0369a1', marginBottom: '14px' }}>
            * Verified prototype directory for Kalahandi district healthcare navigation. Facility distances and services are simulated for demonstration.
          </div>

          {/* Search & Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', marginBottom: '14px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search facility name, block, or service (e.g. DHH, Junagarh, Dialysis)..."
                style={{ width: '100%', paddingLeft: '34px', fontSize: '13px' }}
              />
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px' }}
            >
              <option value="All">All Types</option>
              <option value="District Hospital">District Hospitals</option>
              <option value="CHC">CHCs</option>
              <option value="PHC">PHCs</option>
              <option value="Pharmacy">Pharmacies</option>
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
                    <span className="badge badge-green" style={{ fontSize: '10px' }}>{fac.referralStatus}</span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} style={{ flexShrink: 0 }} />
                    <span>{fac.address} • <strong>{fac.distanceKm} km away</strong></span>
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
                      <Video size={12} /> Live Tele-OPD Node Connected
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <a
                    href={`tel:${fac.phone}`}
                    className="btn btn-secondary"
                    style={{ fontSize: '11px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                  >
                    <Phone size={12} /> Call {fac.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
