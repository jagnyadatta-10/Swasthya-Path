import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/translations';

interface SafetyBannerProps {
  lang: Language;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ lang }) => {
  return (
    <div className="safety-banner" role="region" aria-label="Clinical Safety and Emergency Notice">
      <AlertTriangle size={20} style={{ color: '#d97706', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <strong>CLINICAL SAFETY NOTICE: </strong>
        {getTranslation(lang, 'safetyDisclaimer')}
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#d97706',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }}
      >
        <PhoneCall size={13} />
        <span>108 Emergency</span>
      </div>
    </div>
  );
};
