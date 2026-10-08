import React, { useState, useEffect } from 'react';
import { FileText, X, ZoomIn, ZoomOut, RotateCw, AlertTriangle, Download } from 'lucide-react';
import { DiagnosticDocument, Language } from '../types';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DiagnosticDocument | null;
  onUploadNew?: (doc: Omit<DiagnosticDocument, 'id'>) => void;
  lang?: Language;
}

const DOC_I18N: Record<Language, {
  categoryLabel: string;
  dateLabel: string;
  disclaimer: string;
  zoomIn: string;
  zoomOut: string;
  rotate: string;
  dicomInvert: string;
  zoom: string;
  rotation: string;
  chestLabel: string;
  expLabel: string;
  hospitalLabel: string;
  pathologyWing: string;
  reportName: string;
  clinicalImpression: string;
  normalImpression: string;
  thParameter: string;
  thResult: string;
  thRefRange: string;
  haemoglobin: string;
  leukocyte: string;
  platelet: string;
  malariaSmear: string;
  negative: string;
  validatedBy: string;
  verifiedTriage: string;
  btnDownload: string;
  btnClose: string;
}> = {
  English: {
    categoryLabel: 'Category:',
    dateLabel: 'Date:',
    disclaimer: 'Diagnostic image viewer — clinician review required. (Demo evaluation preview)',
    zoomIn: 'Zoom +',
    zoomOut: 'Zoom -',
    rotate: 'Rotate',
    dicomInvert: 'DICOM Invert',
    zoom: 'Zoom:',
    rotation: 'Rotation:',
    chestLabel: 'PA CHEST ERECT',
    expLabel: 'EXP: NORMAL',
    hospitalLabel: 'DHH BHAWANIPATNA',
    pathologyWing: 'Diagnostic Pathology & Investigation Wing',
    reportName: 'Report Name:',
    clinicalImpression: 'Clinical Impression:',
    normalImpression: 'Normal study parameters within biological reference interval.',
    thParameter: 'Parameter',
    thResult: 'Result',
    thRefRange: 'Reference Range',
    haemoglobin: 'Haemoglobin (Hb)',
    leukocyte: 'Total Leukocyte Count',
    platelet: 'Platelet Count',
    malariaSmear: 'Malaria Smear (MP)',
    negative: 'NEGATIVE',
    validatedBy: 'Validated by: DHH Kalahandi Pathologist Lab',
    verifiedTriage: 'Verified for Tele-Triage',
    btnDownload: 'Download',
    btnClose: 'Close Viewer'
  },
  'ଓଡ଼ିଆ': {
    categoryLabel: 'ବିଭାଗ:',
    dateLabel: 'ତାରିଖ:',
    disclaimer: 'ଡାଇଗ୍ନୋଷ୍ଟିକ୍ ଇମେଜ୍ ଭ୍ୟୁଅର୍ — ଡାକ୍ତରଙ୍କ ସମୀକ୍ଷା ଆବଶ୍ୟକ। (ଡେମୋ ମୂଲ୍ୟାଙ୍କନ)',
    zoomIn: 'ଜୁମ୍ +',
    zoomOut: 'ଜୁମ୍ -',
    rotate: 'ଘୂରାନ୍ତୁ',
    dicomInvert: 'DICOM ବିପରୀତ',
    zoom: 'ଜୁମ୍:',
    rotation: 'ଘୂର୍ଣ୍ଣନ:',
    chestLabel: 'ଛାତି ଏକ୍ସ-ରେ (PA)',
    expLabel: 'ଫଳାଫଳ: ସ୍ୱାଭାବିକ',
    hospitalLabel: 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ ଭବାନୀପାଟଣା',
    pathologyWing: 'ରୋଗ ନିରୂପଣ ଓ ତଦନ୍ତ ପାଥୋଲୋଜି ବିଭାଗ',
    reportName: 'ରିପୋର୍ଟ ନାମ:',
    clinicalImpression: 'କ୍ଲିନିକାଲ୍ ମତାମତ:',
    normalImpression: 'ନିର୍ଦ୍ଧାରିତ ମାନଦଣ୍ଡ ମଧ୍ୟରେ ସ୍ୱାଭାବିକ ଫଳାଫଳ।',
    thParameter: 'ପରୀକ୍ଷା ନାମ',
    thResult: 'ଫଳାଫଳ',
    thRefRange: 'ସ୍ୱାଭାବିକ ସୀମା',
    haemoglobin: 'ହିମୋଗ୍ଲୋବିନ୍ (Hb)',
    leukocyte: 'ଶ୍ୱେତ ରକ୍ତକଣିକା (TLC)',
    platelet: 'ପ୍ଲେଟଲେଟ୍ ସଂଖ୍ୟା',
    malariaSmear: 'ମ୍ୟାଲେରିଆ ପରୀକ୍ଷା (MP)',
    negative: 'ନେଗେଟିଭ୍ (ମୁକ୍ତ)',
    validatedBy: 'ପ୍ରମାଣିତ: DHH କଳାହାଣ୍ଡି ପାଥୋଲୋଜି ଲାବ୍',
    verifiedTriage: 'ଟେଲି-ଟ୍ରାଇଏଜ୍ ପାଇଁ ଯାଞ୍ଚ ହୋଇଛି',
    btnDownload: 'ଡାଉନଲୋଡ୍',
    btnClose: 'ବନ୍ଦ କରନ୍ତୁ'
  },
  'हिन्दी': {
    categoryLabel: 'श्रेणी:',
    dateLabel: 'तारीख:',
    disclaimer: 'डायग्नोस्टिक इमेज व्यूअर — चिकित्सक समीक्षा आवश्यक। (डेमो मूल्यांकन)',
    zoomIn: 'ज़ूम +',
    zoomOut: 'ज़ूम -',
    rotate: 'घुमाएं',
    dicomInvert: 'DICOM कंट्रास्ट',
    zoom: 'ज़ूम:',
    rotation: 'घूर्णन:',
    chestLabel: 'सीने का एक्स-रे (PA)',
    expLabel: 'परिणाम: सामान्य',
    hospitalLabel: 'DHH भवानीपटना',
    pathologyWing: 'रोग निदान एवं पैथोलॉजी प्रभाग',
    reportName: 'रिपोर्ट का नाम:',
    clinicalImpression: 'चिकित्सकीय निष्कर्ष:',
    normalImpression: 'सामान्य जैविक संदर्भ सीमा के भीतर सामान्य पैरामीटर।',
    thParameter: 'पैरामीटर',
    thResult: 'परिणाम',
    thRefRange: 'सामान्य संदर्भ सीमा',
    haemoglobin: 'हीमोग्लोबिन (Hb)',
    leukocyte: 'कुल ल्यूकोसाइट गणना (TLC)',
    platelet: 'प्लेटलेट काउंट',
    malariaSmear: 'मलेरिया स्मीयर (MP)',
    negative: 'नेगेटिव (सामान्य)',
    validatedBy: 'सत्यापित: DHH कालाहांडी पैथोलॉजिस्ट लैब',
    verifiedTriage: 'टेली-ट्राएज हेतु सत्यापित',
    btnDownload: 'डाउनलोड',
    btnClose: 'व्यूअर बंद करें'
  }
};

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  lang = 'English'
}) => {
  const [activeLang, setActiveLang] = useState<Language>(lang);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [invertContrast, setInvertContrast] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (lang) setActiveLang(lang);
  }, [lang]);

  if (!isOpen || !document) return null;

  const t = DOC_I18N[activeLang] || DOC_I18N.English;

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
                {t.categoryLabel} <strong>{document.category}</strong> • {t.dateLabel} {document.date} • {document.provider}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Interactive Language Selector */}
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
                    padding: '3px 8px',
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
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
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
          <span>{t.disclaimer}</span>
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
                <ZoomIn size={14} /> {t.zoomIn}
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleZoomOut}
                style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none' }}
              >
                <ZoomOut size={14} /> {t.zoomOut}
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleRotate}
                style={{ padding: '4px 10px', fontSize: '12px', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none' }}
              >
                <RotateCw size={14} /> {t.rotate}
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
                  {t.dicomInvert}
                </button>
              )}
            </div>

            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {t.zoom} {Math.round(zoomLevel * 100)}% | {t.rotation} {rotation}°
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
                {/* Simulated Chest X-Ray Canvas */}
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
                    {t.chestLabel}<br />{t.expLabel}
                  </div>
                  <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '10px', color: '#38bdf8', fontFamily: 'monospace' }}>
                    {t.hospitalLabel}
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
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.pathologyWing}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                    {t.dateLabel} <strong>{document.date}</strong>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '12px' }}>
                  <strong>{t.reportName}</strong> {document.title}
                  <div style={{ color: '#475569', marginTop: '4px' }}>
                    <strong>{t.clinicalImpression}</strong> {document.notes || t.normalImpression}
                  </div>
                </div>

                {document.fileUrl ? (
                  <div style={{ marginBottom: '14px', textAlign: 'center', background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                      Physical Scanned Document Attachment:
                    </div>
                    <img
                      src={document.fileUrl}
                      alt="Scanned Physical Report"
                      style={{ maxWidth: '100%', maxHeight: '360px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                ) : null}

                {document.parameters && document.parameters.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '14px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>{t.thParameter}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>{t.thResult}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>{t.thRefRange}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {document.parameters.map((param, pIdx) => {
                        const isAbnormal = param.isAbnormal;
                        const statusText = isAbnormal ? 'ABNORMAL ⚠️' : 'NORMAL ✓';
                        return (
                          <tr key={pIdx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '8px 6px', fontWeight: 600 }}>{param.name}</td>
                            <td style={{ padding: '8px 6px', fontWeight: 700, color: '#0f172a' }}>
                              {param.result} {param.unit || ''}
                            </td>
                            <td style={{ padding: '8px 6px' }}>
                              <span style={{
                                fontWeight: 800,
                                fontSize: '11px',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: isAbnormal ? '#fee2e2' : '#dcfce7',
                                color: isAbnormal ? '#991b1b' : '#166534',
                                border: isAbnormal ? '1.5px solid #ef4444' : '1.5px solid #22c55e'
                              }}>
                                {statusText}
                              </span>
                            </td>
                            <td style={{ padding: '8px 6px', color: '#475569', fontWeight: 500 }}>{param.refRange}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '14px' }}>
                    <thead>
                      <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>{t.thParameter}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>{t.thResult}</th>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>Status</th>
                        <th style={{ padding: '8px 6px', textAlign: 'left' }}>{t.thRefRange}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 6px', fontWeight: 600 }}>{t.haemoglobin}</td>
                        <td style={{ padding: '8px 6px', fontWeight: 700, color: '#0f172a' }}>12.8 g/dL</td>
                        <td style={{ padding: '8px 6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534', border: '1.5px solid #22c55e' }}>
                            NORMAL ✓
                          </span>
                        </td>
                        <td style={{ padding: '8px 6px', color: '#475569' }}>12.0 – 15.5 g/dL</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 6px', fontWeight: 600 }}>{t.leukocyte}</td>
                        <td style={{ padding: '8px 6px', fontWeight: 700, color: '#0f172a' }}>7,400 /cumm</td>
                        <td style={{ padding: '8px 6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534', border: '1.5px solid #22c55e' }}>
                            NORMAL ✓
                          </span>
                        </td>
                        <td style={{ padding: '8px 6px', color: '#475569' }}>4,000 – 11,000 /cumm</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 6px', fontWeight: 600 }}>{t.platelet}</td>
                        <td style={{ padding: '8px 6px', fontWeight: 700, color: '#0f172a' }}>2.4 Lakhs/cumm</td>
                        <td style={{ padding: '8px 6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534', border: '1.5px solid #22c55e' }}>
                            NORMAL ✓
                          </span>
                        </td>
                        <td style={{ padding: '8px 6px', color: '#475569' }}>1.5 – 4.0 Lakhs/cumm</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 6px', fontWeight: 600 }}>{t.malariaSmear}</td>
                        <td style={{ padding: '8px 6px', fontWeight: 700, color: '#0f172a' }}>{t.negative}</td>
                        <td style={{ padding: '8px 6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#dcfce7', color: '#166534', border: '1.5px solid #22c55e' }}>
                            NORMAL ✓
                          </span>
                        </td>
                        <td style={{ padding: '8px 6px', color: '#475569' }}>Negative</td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* Section 11 Laboratory Disclaimer */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  color: '#475569',
                  marginBottom: '12px',
                  lineHeight: 1.4
                }}>
                  ℹ️ <strong>Clinical Note:</strong> Reference ranges can vary by laboratory. Please discuss abnormal results with a healthcare professional. AI does not infer medical diagnoses from laboratory values.
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748b', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                  <span>{document.patientName ? `Patient: ${document.patientName} (${document.patientId || 'RHB-OD-KLH-0941'})` : 'Patient: Keshab Rout'}</span>
                  <span>{document.doctorInCharge ? `Sign-off: ${document.doctorInCharge}` : t.validatedBy}</span>
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
            ID: <span style={{ fontFamily: 'monospace' }}>{document.id}</span> • {t.verifiedTriage}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => alert(`Downloading ${document.title} in offline PDF format...`)}
            >
              <Download size={14} /> {t.btnDownload}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onClose}
            >
              {t.btnClose}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
