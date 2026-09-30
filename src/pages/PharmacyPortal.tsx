import React, { useState, useEffect } from 'react';
import { Pill, CheckCircle2, AlertTriangle, Clock, RefreshCw, Plus, Check, ShieldCheck, ClipboardList, User, Package, Bell, MapPin } from 'lucide-react';
import { DemoUser, Language, MedicineItem, PharmacyRequest, NetworkQuality } from '../types';
import { storage } from '../utils/storage';
import { getTranslation } from '../utils/translations';

interface PharmacyPortalProps {
  user: DemoUser;
  networkQuality: NetworkQuality;
  lang: Language;
}

export const PharmacyPortal: React.FC<PharmacyPortalProps> = ({ user, networkQuality, lang }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'stock' | 'requests' | 'profile'>('home');
  const [updateNotice, setUpdateNotice] = useState('');
  const [medicines, setMedicines] = useState<MedicineItem[]>(storage.getMedicines());
  const [requests, setRequests] = useState<PharmacyRequest[]>(storage.getRequests());

  const isConnected = networkQuality !== 'offline';

  useEffect(() => {
    setMedicines(storage.getMedicines());
    setRequests(storage.getRequests());
  }, [activeTab]);

  const handleStatusChange = (id: string, newStatus: MedicineItem['status'], quantity?: number) => {
    const updated = storage.updateMedicineStatus(id, newStatus, quantity);
    setMedicines([...updated]);

    const item = updated.find((m) => m.id === id);
    storage.saveRecord({
      type: 'stock-update',
      notes: `Stock updated at ${user.name}: ${item?.name} is now '${newStatus}'.`,
      synced: isConnected
    });

    storage.addNotification({
      title: 'Pharmacy Stock Updated',
      body: `Demo notification: ${item?.name} status changed to ${newStatus} at ${user.name}.`,
      type: 'pharmacy'
    });

    storage.addAuditLog(`Stock status updated for ${item?.name} -> ${newStatus}`, user.name);

    setUpdateNotice(`Stock for ${item?.name} updated to ${newStatus}. Live patient availability synced!`);
    setTimeout(() => setUpdateNotice(''), 3000);
  };

  const handleConfirmRequest = (reqId: string) => {
    const updated = storage.updateRequestStatus(reqId, 'Confirmed Available');
    setRequests([...updated]);

    const req = updated.find(r => r.id === reqId);
    storage.addNotification({
      title: 'Medicine Hold Confirmed',
      body: `Demo notification: Your request for ${req?.medicines} is confirmed at ${user.name}.`,
      type: 'pharmacy'
    });

    storage.addAuditLog(`Pharmacy confirmed medicine request for ${req?.patientName}`, user.name);

    setUpdateNotice('Medicine hold confirmed! In-app notification sent to patient.');
    setTimeout(() => setUpdateNotice(''), 3000);
  };

  const availableCount = medicines.filter(m => m.status === 'AVAILABLE').length;
  const limitedCount = medicines.filter(m => m.status === 'LIMITED STOCK').length;
  const outOfStockCount = medicines.filter(m => m.status === 'OUT OF STOCK').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* Pharmacy Bar */}
      <div className="user-bar" style={{ borderRadius: '14px', marginBottom: '18px' }}>
        <div className="user-profile">
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: '#b42318',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 800
            }}
          >
            ML
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              {user.location} • Jan Aushadhi Partner Pharmacy
            </div>
            <span className="user-badge" style={{ background: '#fef3f2', color: '#b42318' }}>
              Licensed Chemist • Drug Lic: KLH-2024-8192
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            className="status-pill"
            style={{
              background: isConnected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isConnected ? '#059669' : '#dc2626'
            }}
          >
            <span className="status-dot"></span>
            <span>{isConnected ? 'Broadcasting Real-Time Stock' : 'Offline: Changes Queued'}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <nav className="tabs-scroll-wrap" aria-label="Pharmacy navigation">
        <button
          className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          {getTranslation(lang, 'tabHome')}
        </button>
        <button
          className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          Medicine Inventory ({medicines.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Patient Requests ({pendingRequests} Pending)
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Pharmacy Profile
        </button>
      </nav>

      {updateNotice && (
        <div className="alert ok" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <CheckCircle2 size={16} />
          <span>{updateNotice}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: PHARMACY DASHBOARD (Section 29) */}
      {/* ======================================================== */}
      {activeTab === 'home' && (
        <div>
          <div className="hero-card" style={{ borderRadius: '16px', marginBottom: '20px' }}>
            <h1>Pharmacy Partner Portal</h1>
            <p>
              Publish real-time essential medicine inventory for Kalahandi district so rural villagers and daily-wage workers can verify availability before traveling 15–30km to town.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => setActiveTab('stock')}
              >
                <Pill size={16} />
                <span>Manage Stock Inventory</span>
              </button>
              <button
                className="btn btn-ghost-light"
                onClick={() => setActiveTab('requests')}
              >
                <Clock size={16} />
                <span>View Patient Hold Requests</span>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', color: 'var(--navy-mid)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
              Live Inventory & Patient Requests
            </h3>
            <div className="kpis-grid">
              <div className="kpi-card">
                <span className="kpi-label">Available Medicines</span>
                <div className="kpi-val" style={{ color: '#027a48' }}>{availableCount}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  In stock ready for dispensing
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Low Stock</span>
                <div className="kpi-val" style={{ color: '#b54708' }}>{limitedCount}</div>
                <span style={{ fontSize: '12px', color: '#b54708' }}>
                  Replenishment recommended
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Out of Stock</span>
                <div className="kpi-val" style={{ color: '#b42318' }}>{outOfStockCount}</div>
                <span style={{ fontSize: '12px', color: '#b42318' }}>
                  Prevents futile patient travel
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">Patient Hold Requests</span>
                <div className="kpi-val" style={{ color: '#0d70d4' }}>{pendingRequests}</div>
                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  Awaiting chemist confirmation
                </span>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <ShieldCheck size={20} style={{ color: '#0284c7' }} />
              <h3>Partner Participation Notice</h3>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
              Stock information depends on partner updates and may change. When updated, availability updates broadcast directly to patients across Kalahandi blocks in real time.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MEDICINE INVENTORY (Section 29 Actions) */}
      {/* ======================================================== */}
      {activeTab === 'stock' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2>Medicine Stock Management</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                Update medicine status instantly. Changes are broadcast to the Patient portal in real time.
              </p>
            </div>
            <span
              className="status-pill"
              style={{
                background: isConnected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isConnected ? '#059669' : '#dc2626'
              }}
            >
              <span className="status-dot"></span>
              {isConnected ? 'Broadcasting live updates' : 'Offline: Queued locally'}
            </span>
          </div>

          <div className="data-list">
            {medicines.map((med) => (
              <div key={med.id} className="data-item" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '16px' }}>{med.name}</strong>
                    <span
                      className={`badge ${
                        med.status === 'AVAILABLE'
                          ? 'badge-green'
                          : med.status === 'LIMITED STOCK'
                          ? 'badge-amber'
                          : 'badge-red'
                      }`}
                      style={{ fontSize: '11px', fontWeight: 700 }}
                    >
                      {med.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>
                    Category: {med.category} • Price: {med.unitPrice} • Block: {med.block}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted-light)', marginTop: '2px' }}>
                    Available Units: <strong>{med.quantity}</strong> • Last updated: {med.lastUpdated}
                  </div>
                </div>

                {/* Quick Action Buttons from Prompt Section 29 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => handleStatusChange(med.id, 'AVAILABLE', med.quantity > 0 ? med.quantity : 50)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      background: med.status === 'AVAILABLE' ? '#16a34a' : '#f0fdf4',
                      color: med.status === 'AVAILABLE' ? '#ffffff' : '#166534',
                      borderColor: '#bbf7d0',
                      fontWeight: 700
                    }}
                  >
                    Mark Available
                  </button>

                  <button
                    type="button"
                    className="btn"
                    onClick={() => handleStatusChange(med.id, 'LIMITED STOCK', 10)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      background: med.status === 'LIMITED STOCK' ? '#d97706' : '#fffbeb',
                      color: med.status === 'LIMITED STOCK' ? '#ffffff' : '#92400e',
                      borderColor: '#fde68a',
                      fontWeight: 700
                    }}
                  >
                    Mark Limited
                  </button>

                  <button
                    type="button"
                    className="btn"
                    onClick={() => handleStatusChange(med.id, 'OUT OF STOCK', 0)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      background: med.status === 'OUT OF STOCK' ? '#dc2626' : '#fef2f2',
                      color: med.status === 'OUT OF STOCK' ? '#ffffff' : '#991b1b',
                      borderColor: '#fecaca',
                      fontWeight: 700
                    }}
                  >
                    Mark Out of Stock
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: PATIENT REQUESTS (Section 30) */}
      {/* ======================================================== */}
      {activeTab === 'requests' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2>Patient Medicine Availability Requests</h2>
              <p style={{ color: 'var(--muted)', fontSize: '13px', margin: 0 }}>
                Rural patients requesting medicine reservation before traveling from their village (Prompt Section 30)
              </p>
            </div>
            <span className="badge badge-blue">{pendingRequests} Pending</span>
          </div>

          <div className="data-list">
            {requests.map((req) => (
              <div key={req.id} className="data-item">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <strong style={{ fontSize: '15px' }}>{req.patientName}</strong>
                    <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
                      {req.patientId || 'RHB-OD-KLH-0941'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>• {req.village}</span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#0f172a' }}>
                    Requested Medicine: <strong>{req.medicines}</strong>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--muted-light)', marginTop: '2px' }}>
                    Time Received: {req.timestamp} • Preferred: {user.name}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    className={`badge ${
                      req.status === 'Confirmed Available' ? 'badge-green' : 'badge-amber'
                    }`}
                  >
                    {req.status}
                  </span>

                  {req.status === 'Pending' && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleConfirmRequest(req.id)}
                      style={{ fontSize: '12px', padding: '6px 14px', fontWeight: 700 }}
                    >
                      <Check size={14} />
                      <span>Confirm Available</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: PHARMACY PROFILE */}
      {/* ======================================================== */}
      {activeTab === 'profile' && (
        <div className="card">
          <h2>Pharmacy Profile & Partner Credentials</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>
            Registered Government Jan Aushadhi & District Health Society Retailer
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Pharmacy Name</span>
              <strong>{user.name}</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Drug License Number</span>
              <strong>KLH-2024-8192-RET</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Address & Block</span>
              <strong>College Road, Bhawanipatna, Kalahandi, Odisha</strong>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Operating Hours</span>
              <strong>8:00 AM – 9:30 PM (Daily)</strong>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation for Pharmacy (Prompt Section 45) */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        borderTop: '1px solid #cbd5e1',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '6px 0',
        zIndex: 900
      }}>
        <button
          onClick={() => setActiveTab('home')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'home' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <ClipboardList size={18} />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('stock')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'stock' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <Package size={18} />
          <span>Stock</span>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'requests' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <Clock size={18} />
          <span>Requests</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', color: activeTab === 'profile' ? '#0284c7' : '#64748b', fontSize: '10px', cursor: 'pointer' }}
        >
          <User size={18} />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};
