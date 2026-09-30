import React from 'react';
import { Bell, Check, Clock, X, MessageSquare, AlertCircle, Pill, Stethoscope, Shield } from 'lucide-react';
import { AppNotification } from '../types';
import { storage } from '../utils/storage';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onRefresh: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefresh
}) => {
  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    storage.markNotificationsRead();
    onRefresh();
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'queue':
        return <Clock size={16} color="#0284c7" />;
      case 'doctor':
        return <Stethoscope size={16} color="#059669" />;
      case 'prescription':
        return <Pill size={16} color="#d97706" />;
      case 'pharmacy':
        return <Pill size={16} color="#7c3aed" />;
      default:
        return <MessageSquare size={16} color="#64748b" />;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '64px',
        right: '16px',
        width: '360px',
        maxWidth: '92vw',
        background: '#ffffff',
        borderRadius: '14px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
        border: '1px solid #cbd5e1',
        zIndex: 9999,
        overflow: 'hidden'
      }}
      role="dialog"
      aria-label="In-App Notifications"
    >
      {/* Header */}
      <div style={{
        background: '#071c42',
        color: '#ffffff',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} style={{ color: '#38bdf8' }} />
          <span style={{ fontWeight: 800, fontSize: '14px' }}>In-App SMS & Alerts</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleMarkAllRead}
            style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}
          >
            Mark all read
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Sub-banner disclaimer */}
      <div style={{ background: '#f8fafc', padding: '6px 12px', borderBottom: '1px solid #e2e8f0', fontSize: '11px', color: '#64748b' }}>
        * In-app simulated notifications for rural SMS & tele-queue triggers.
      </div>

      {/* List */}
      <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
            No new notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: '12px 14px',
                borderBottom: '1px solid #f1f5f9',
                background: n.read ? '#ffffff' : '#f0f9ff',
                display: 'flex',
                gap: '10px'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: n.read ? '#f1f5f9' : '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getIcon(n.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>{n.title}</strong>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>{n.time}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.4' }}>
                  {n.body}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 12px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <span style={{ fontSize: '10px', color: '#94a3b8' }}>
          Swasthya Path Notification Engine • Demo Mode
        </span>
      </div>
    </div>
  );
};
