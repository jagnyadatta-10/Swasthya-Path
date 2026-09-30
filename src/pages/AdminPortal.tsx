import React, { useState } from 'react';
import {
  Users,
  Stethoscope,
  Activity,
  AlertTriangle,
  Pill,
  MapPin,
  TrendingUp,
  Clock,
  ShieldCheck,
  Building2,
  FileText,
  BarChart3,
  Calendar,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { DemoUser, Language, NetworkQuality } from '../types';
import { storage } from '../utils/storage';

interface AdminPortalProps {
  user: DemoUser;
  networkQuality: NetworkQuality;
  lang: Language;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ user, networkQuality, lang }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'impact' | 'facilities' | 'audit'>('overview');
  const [syncedAlert, setSyncedAlert] = useState('');

  const metrics = storage.getMetrics();
  const queue = storage.getTriageQueue();
  const appointments = storage.getAppointments();
  const medicines = storage.getMedicines();
  const facilities = storage.getFacilities();
  const auditLog = storage.getAuditLog();
  const specialistRequests = storage.getSpecialistRequests();

  const handleSimulateSync = () => {
    setSyncedAlert('Synchronized district telemetry with Kalahandi Health Command Center.');
    storage.addAuditLog('District health telemetry synchronized', user.name);
    setTimeout(() => setSyncedAlert(''), 3000);
  };

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* Admin Profile Bar */}
      <div className="user-bar" style={{ borderRadius: '14px', marginBottom: '18px' }}>
        <div className="user-profile">
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#047857',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 800
            }}
          >
            HA
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Chief District Medical Officer (CDMO) Directorate • Kalahandi, Odisha
            </div>
            <span className="user-badge" style={{ background: '#ecfdf5', color: '#047857' }}>
              District Program Administrator • Swasthya Path Hub
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSimulateSync}
            style={{ fontSize: '12px', padding: '6px 12px' }}
          >
            <RefreshCw size={13} /> Sync District Telemetry
          </button>
        </div>
      </div>

      {/* Tabs */}
      <nav className="tabs-scroll-wrap" aria-label="Admin navigation">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          District Program Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'impact' ? 'active' : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          Rural Health Impact Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
          onClick={() => setActiveTab('facilities')}
        >
          Facility & Block Oversight ({facilities.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
          onClick={() => setActiveTab('audit')}
        >
          District Audit Trail ({auditLog.length})
        </button>
      </nav>

      {syncedAlert && (
        <div className="alert ok" style={{ marginBottom: '16px' }}>
          <CheckCircle2 size={16} /> {syncedAlert}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: DISTRICT OVERVIEW (Prompt Section 35) */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div>
          <div className="hero-card" style={{ borderRadius: '16px', marginBottom: '20px' }}>
            <h1>Kalahandi District Health Administration</h1>
            <p>
              Real-time oversight of rural tele-triage queues, hospital referrals, essential medicine stock levels, and offline patient synchronization across Kalahandi blocks.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span className="badge badge-green" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                Active Node: DHH Bhawanipatna Hub
              </span>
              <span className="badge badge-blue" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                5 Blocks Connected (Junagarh, Dharamgarh, Kesinga, Narla, Bhawanipatna)
              </span>
            </div>
          </div>

          {/* Section 35 KPI Grid */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', color: 'var(--navy-mid)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                DISTRICT TELEHEALTH TELEMETRY (TODAY)
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                *Illustrative demo data • Prototype simulation
              </span>
            </div>

            <div className="kpis-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              <div className="kpi-card">
                <span className="kpi-label">Registered Patients</span>
                <div className="kpi-val" style={{ color: '#0284c7' }}>1,420</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Across 12 Kalahandi blocks</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Active Doctors on Duty</span>
                <div className="kpi-val" style={{ color: '#059669' }}>18</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>DHH & CHC Tele-OPD Hubs</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Today's Consultations</span>
                <div className="kpi-val" style={{ color: '#0d70d4' }}>42</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Completed sessions</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Priority Red-Flag Cases</span>
                <div className="kpi-val" style={{ color: '#b42318' }}>{queue.filter(q => q.urgency === 'urgent').length + 6}</div>
                <span style={{ fontSize: '12px', color: '#b42318' }}>Immediate CHC escalations</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Specialist Referrals</span>
                <div className="kpi-val" style={{ color: '#7c3aed' }}>{specialistRequests.length + 13}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Doctor-to-Doctor escalations</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Pharmacy Stock Syncs</span>
                <div className="kpi-val" style={{ color: '#d97706' }}>36</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Jan Aushadhi real-time updates</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Offline Sessions</span>
                <div className="kpi-val" style={{ color: '#64748b' }}>84</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Accessed in 2G dead-zones</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Pending Sync Queue</span>
                <div className="kpi-val" style={{ color: '#0284c7' }}>3</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Awaiting signal recovery</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: RURAL HEALTH IMPACT DASHBOARD (Prompt Section 36) */}
      {/* ======================================================== */}
      {activeTab === 'impact' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2>Rural Healthcare Measurable Impact Dashboard</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                Quantified healthcare savings for daily-wage workers and smallholder farmers in Kalahandi, Odisha
              </p>
            </div>
            <span className="badge badge-green" style={{ fontSize: '11px' }}>
              Prototype Simulation • Verified Methodology
            </span>
          </div>

          <div className="kpis-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '20px' }}>
            <div className="kpi-card" style={{ borderLeft: '4px solid #059669' }}>
              <span className="kpi-label">Unnecessary Travel Avoided</span>
              <div className="kpi-val" style={{ color: '#059669' }}>128 Cases</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Prevented costly 20–40 km bus journeys to district hospital
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #0284c7' }}>
              <span className="kpi-label">Patient Travel & Wages Saved</span>
              <div className="kpi-val" style={{ color: '#0284c7' }}>₹ 51,200</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Avg ₹400 saved per patient (bus fare + daily labor wage)
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #d97706' }}>
              <span className="kpi-label">Avg OPD Wait Reduction</span>
              <div className="kpi-val" style={{ color: '#d97706' }}>44.5% Less</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Reduced from 3.5 hrs physical queue to ~12 min tele-queue
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #7c3aed' }}>
              <span className="kpi-label">Futile Pharmacy Trips Prevented</span>
              <div className="kpi-val" style={{ color: '#7c3aed' }}>210 Checks</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Stock checked locally before traveling to town
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #0891b2' }}>
              <span className="kpi-label">Offline Record Accesses</span>
              <div className="kpi-val" style={{ color: '#0891b2' }}>164 Times</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Medical records available in zero-connectivity village pockets
              </span>
            </div>

            <div className="kpi-card" style={{ borderLeft: '4px solid #dc2626' }}>
              <span className="kpi-label">Priority Emergencies Escalated</span>
              <div className="kpi-val" style={{ color: '#dc2626' }}>12 Cases</div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                High-acuity red flags routed straight to 108 ambulance
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FACILITY & BLOCK OVERSIGHT */}
      {/* ======================================================== */}
      {activeTab === 'facilities' && (
        <div className="card">
          <h2>Kalahandi District Facility Network</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
            District Hospitals, CHCs, PHCs, and Jan Aushadhi pharmacies participating in the Swasthya Path network
          </p>

          <div className="data-list">
            {facilities.map((fac) => (
              <div key={fac.id} className="data-item">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '15px' }}>{fac.name}</strong>
                    <span className="badge badge-blue">{fac.type}</span>
                    <span className="badge badge-green">{fac.block} Block</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {fac.address} • Contact: <strong>{fac.phone}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>
                    Services: {fac.services.join(' • ')}
                  </div>
                </div>

                <div>
                  <span className="badge badge-green">{fac.referralStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: AUDIT TRAIL */}
      {/* ======================================================== */}
      {activeTab === 'audit' && (
        <div className="card">
          <h2>District Audit Log & Governance Trail</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
            Immutable activity history recording clinical decisions, prescription generation, queue entries, and consent updates
          </p>

          <div className="data-list">
            {auditLog.map((log) => (
              <div key={log.id} className="data-item" style={{ fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#0284c7', fontFamily: 'monospace', fontWeight: 700 }}>
                    {log.time}
                  </span>
                  <div>
                    <strong style={{ color: '#0f172a' }}>{log.action}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Authorized Actor: {log.actor}</div>
                  </div>
                </div>

                <span className="badge badge-gray">Verified Event</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
