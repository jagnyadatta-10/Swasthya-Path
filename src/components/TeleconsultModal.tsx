import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Signal, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DoctorItem, DemoUser } from '../types';
import { storage } from '../utils/storage';

interface TeleconsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorItem;
  patient: DemoUser;
}

export const TeleconsultModal: React.FC<TeleconsultModalProps> = ({
  isOpen,
  onClose,
  doctor,
  patient
}) => {
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [doctorNote, setDoctorNote] = useState('Patient presented with mild respiratory symptoms for 2 days. Rest, hydration, Tab Paracetamol 500mg SOS.');
  const [consultationSaved, setConsultationSaved] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isOpen) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    storage.saveRecord({
      type: 'consultation',
      doctorName: doctor.name,
      notes: `Teleconsultation completed (${formatTime(callDuration)}). Clinical advice: ${doctorNote}`,
      pathway: 'clinician consultation',
      urgency: 'routine',
      synced: true
    });
    storage.incrementMetric('appointmentsCompleted', 1);
    setConsultationSaved(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="teleconsult-title">
      <div className="modal-dialog" style={{ maxWidth: '800px', background: '#020a1d', color: '#ffffff', border: '1px solid rgba(25, 211, 255, 0.3)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
          <div>
            <h3 id="teleconsult-title" style={{ color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#19d3ff' }}>Live Telehealth Bridge</span>
              <span className="badge badge-green" style={{ fontSize: '11px' }}>
                <span className="status-dot"></span> Call Connected ({formatTime(callDuration)})
              </span>
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0 0' }}>
              Secure encrypted teleconsultation connecting {patient.name} with {doctor.name}
            </p>
          </div>

          {/* Bandwidth Adapter Toggle */}
          <button
            onClick={() => setIsLowBandwidth(!isLowBandwidth)}
            className="btn"
            style={{
              background: isLowBandwidth ? '#b45309' : 'rgba(25, 211, 255, 0.15)',
              color: isLowBandwidth ? '#fff' : '#19d3ff',
              border: '1px solid rgba(25, 211, 255, 0.4)',
              fontSize: '12px',
              padding: '6px 12px'
            }}
            title="Toggle between standard video and low-bandwidth 2G audio mode"
          >
            <Signal size={14} />
            <span>{isLowBandwidth ? '2G Audio-Only Mode' : 'Standard Video Mode'}</span>
          </button>
        </div>

        {/* Video / Audio Feeds */}
        <div className="video-room-container">
          <div className="video-grid">
            {/* Doctor View */}
            <div className="video-frame" style={{ minHeight: isLowBandwidth ? '160px' : '260px' }}>
              {isLowBandwidth ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <img
                    src={doctor.avatarUrl}
                    alt={doctor.name}
                    style={{ width: '70px', height: '70px', borderRadius: '50%', border: '2px solid #19d3ff', margin: '0 auto 10px' }}
                  />
                  <div style={{ fontWeight: 700, color: '#ffffff' }}>{doctor.name}</div>
                  <div style={{ fontSize: '12px', color: '#38bdf8' }}>Audio Stream Active (Saved 92% bandwidth)</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '12px' }}>
                    <div style={{ width: '4px', height: '18px', background: '#38bdf8', animation: 'pulse-voice 0.6s infinite' }}></div>
                    <div style={{ width: '4px', height: '28px', background: '#38bdf8', animation: 'pulse-voice 0.9s infinite' }}></div>
                    <div style={{ width: '4px', height: '22px', background: '#38bdf8', animation: 'pulse-voice 0.7s infinite' }}></div>
                    <div style={{ width: '4px', height: '14px', background: '#38bdf8', animation: 'pulse-voice 0.8s infinite' }}></div>
                  </div>
                </div>
              ) : (
                <>
                  <img src={doctor.avatarUrl} alt={doctor.name} />
                  <div className="video-label">
                    👨‍⚕️ {doctor.name} (District Telehealth Hub)
                  </div>
                </>
              )}
            </div>

            {/* Patient View */}
            <div className="video-frame" style={{ minHeight: isLowBandwidth ? '160px' : '260px' }}>
              {isLowBandwidth || !videoOn ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #a6f4c5', margin: '0 auto 8px' }}
                  />
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '13px' }}>{patient.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Village Badamba • Patient feed</div>
                </div>
              ) : (
                <>
                  <img src={patient.avatar} alt={patient.name} />
                  <div className="video-label">
                    👤 {patient.name} (Patient View)
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Doctor Clinical Notes in Session */}
        <div style={{ marginTop: '16px', background: 'rgba(255, 255, 255, 0.05)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
            <FileText size={15} />
            <span>Doctor's Clinical Tele-Consultation Advice & Rx:</span>
          </div>
          <textarea
            rows={2}
            value={doctorNote}
            onChange={(e) => setDoctorNote(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '13px'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
            <ShieldCheck size={13} style={{ color: '#10b981' }} />
            <span>Doctor retains sole diagnostic and prescribing authority. Recorded to patient's offline health record.</span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn"
              onClick={() => setMicOn(!micOn)}
              style={{
                background: micOn ? 'rgba(255, 255, 255, 0.15)' : '#b91c1c',
                color: '#ffffff',
                border: 0
              }}
            >
              {micOn ? <Mic size={16} /> : <MicOff size={16} />}
              <span>{micOn ? 'Mute Mic' : 'Unmute'}</span>
            </button>

            <button
              className="btn"
              onClick={() => setVideoOn(!videoOn)}
              style={{
                background: videoOn ? 'rgba(255, 255, 255, 0.15)' : '#b91c1c',
                color: '#ffffff',
                border: 0
              }}
            >
              {videoOn ? <Video size={16} /> : <VideoOff size={16} />}
              <span>{videoOn ? 'Cam On' : 'Cam Off'}</span>
            </button>
          </div>

          <button
            className="btn btn-danger"
            onClick={handleEndCall}
            style={{ fontWeight: 700, padding: '10px 20px', background: '#dc2626', color: '#ffffff', border: 0 }}
          >
            <PhoneOff size={16} />
            <span>Complete & Save Consultation</span>
          </button>
        </div>

        {consultationSaved && (
          <div style={{ marginTop: '12px', padding: '10px', background: '#065f46', borderRadius: '8px', color: '#a7f3d0', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} />
            <span>Consultation concluded and synced to Patient Offline Record!</span>
          </div>
        )}
      </div>
    </div>
  );
};
