import React, { useState } from 'react';
import { FileText, X, Eye, ZoomIn, ZoomOut, RotateCw, AlertTriangle, ShieldCheck, Download, Upload, Check } from 'lucide-react';
import { DiagnosticDocument } from '../types';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DiagnosticDocument | null;
  onUploadNew?: (doc: Omit<DiagnosticDocument, 'id'>) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  onUploadNew
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [invertContrast, setInvertContrast] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState('');

  if (!isOpen || !document) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const handleToggleContrast = () => setInvertContrast(prev => !prev);

  const isRadiology = document.category === 'X-Ray' || document.category === 'CT' || document.category === 'MRI';

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="doc-viewer-title">
      <div className="modal-dialog" style={{ maxWidth: '720px', borderRadius: '16px', overflow: 'hidden', padding: 0 }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #071c42 0%, #0d3875 100%)',
          color: '#ffffff',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
              <FileText size={18} />
            </div>
            <div>
              <h3 id="doc-viewer-title" style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                {document.title}
              </h3>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                Category: <strong>{document.category}</strong> • Date: {document.date} • {document.provider}
              </p>
            </div>
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

        {/* Mandatory Clinical Disclaimer Banner */}
        <div style={{
          background: '#fef3c7',
          borderBottom: '1px solid #fde68a',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#92400e',
          fontSize: '12px',
          fontWeight: 700
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0 }} />
          <span>Diagnostic image viewer — clinician review required. (Demo evaluation preview)</span>
        </div>

        {/* Content Viewer Screen */}
        <div style={{ padding: '16px 20px', background: '#0a101d', color: '#f1f5f9' }}>
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '8px 12px',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn"
                onClick={handleZoomIn}
                style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none' }}
              >
                <ZoomIn size={14} /> Zoom +
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleZoomOut}
                style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none' }}
              >
                <ZoomOut size={14} /> Zoom -
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleRotate}
                style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none' }}
              >
                <RotateCw size={14} /> Rotate
              </button>
              {isRadiology && (
                <button
                  type="button"
                  className="btn"
                  onClick={handleToggleContrast}
                  style={{
                    padding: '4px 10px',
                    fontSize: '12px',
                    background: invertContrast ? '#0284c7' : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    border: 'none'
                  }}
                >
                  DICOM Invert
                </button>
              )}
            </div>

            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Zoom: {Math.round(zoomLevel * 100)}% | Rotation: {rotation}°
            </span>
          </div>

          {/* Document Canvas / Rendering Box */}
          <div style={{
            minHeight: '320px',
            maxHeight: '440px',
            overflow: 'auto',
            background: isRadiology ? '#000000' : '#1e293b',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            filter: invertContrast ? 'invert(1)' : 'none'
          }}>
            {document.category === 'X-Ray' ? (
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                  textAlign: 'center'
                }}
              >
                {/* Clean simulated high-contrast Chest X-Ray Canvas */}
                <div style={{
                  width: '280px',
                  height: '340px',
                  background: 'radial-gradient(ellipse at center, #334155 0%, #0f172a 70%, #020617 100%)',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 40px rgba(255,255,255,0.05)'
                }}>
                  {/* Simulated Rib Cage & Cardiac Silhouette */}
                  <div style={{
                    width: '180px',
                    height: '220px',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderRadius: '40% 40% 20% 20%',
                    position: 'relative',
                    background: 'radial-gradient(circle at 45% 55%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.02) 60%)'
                  }}>
                    {/* Spine column */}
                    <div style={{
                      position: 'absolute',
                      left: '50%',
                      top: '10px',
                      bottom: '10px',
                      width: '14px',
                      transform: 'translateX(-50%)',
                      background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.3), rgba(255,255,255,0.3) 6px, transparent 6px, transparent 12px)'
                    }} />
                    {/* Left & Right Lung fields */}
                    <div style={{ position: 'absolute', left: '16px', top: '30px', width: '48px', height: '110px', borderRadius: '40%', border: '1px dashed rgba(255,255,255,0.2)' }} />
                    <div style={{ position: 'absolute', right: '16px', top: '30px', width: '48px', height: '110px', borderRadius: '40%', border: '1px dashed rgba(255,255,255,0.2)' }} />
                  </div>
                  <div style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
                    PA CHEST ERECT<br />EXP: NORMAL
                  </div>
                  <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '10px', color: '#38bdf8', fontFamily: 'monospace' }}>
                    DHH BHAWANIPATNA
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                  background: '#ffffff',
                  color: '#0f172a',
                  width: '90%',
                  maxWidth: '520px',
                  padding: '24px',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  fontSize: '13px'
                }}
              >
                <div style={{ borderBottom: '2px solid #0284c7', paddingBottom: '8px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <strong style={{ fontSize: '15px', color: '#0369a1' }}>{document.provider}</strong>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Diagnostic Pathology & Investigation Wing</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                    Date: <strong>{document.date}</strong>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '12px' }}>
                  <strong>Report Name:</strong> {document.title}
                  <div style={{ color: '#475569', marginTop: '4px' }}>
                    <strong>Clinical Impression:</strong> {document.notes || 'Normal study parameters within biological reference interval.'}
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '6px', textAlign: 'left' }}>Parameter</th>
                      <th style={{ padding: '6px', textAlign: 'left' }}>Result</th>
                      <th style={{ padding: '6px', textAlign: 'left' }}>Reference Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '6px' }}>Haemoglobin (Hb)</td>
                      <td style={{ padding: '6px', fontWeight: 700, color: '#059669' }}>12.8 g/dL</td>
                      <td style={{ padding: '6px', color: '#64748b' }}>12.0 – 15.5 g/dL</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '6px' }}>Total Leukocyte Count</td>
                      <td style={{ padding: '6px', fontWeight: 700, color: '#0284c7' }}>7,400 /cumm</td>
                      <td style={{ padding: '6px', color: '#64748b' }}>4,000 – 11,000 /cumm</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '6px' }}>Platelet Count</td>
                      <td style={{ padding: '6px', fontWeight: 700, color: '#059669' }}>2.4 Lakhs/cumm</td>
                      <td style={{ padding: '6px', color: '#64748b' }}>1.5 – 4.0 Lakhs/cumm</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '6px' }}>Malaria Smear (MP)</td>
                      <td style={{ padding: '6px', fontWeight: 700, color: '#059669' }}>NEGATIVE</td>
                      <td style={{ padding: '6px', color: '#64748b' }}>Negative</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                  Validated by: <em>DHH Kalahandi Pathologist Lab</em>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '12px 20px',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            ID: <span style={{ fontFamily: 'monospace' }}>{document.id}</span> • Verified for Tele-Triage
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => alert(`Downloading ${document.title} in offline PDF format...`)}
            >
              <Download size={14} /> Download
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              Close Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
