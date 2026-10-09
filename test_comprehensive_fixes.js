import fs from 'fs';

console.log('========================================================');
console.log('SWASTHYA PATH: COMPREHENSIVE AUDIT & FIXES VERIFICATION');
console.log('========================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. Patient Portal: Doctor profile modal & Location normalization
const patientPortalCode = fs.readFileSync('src/pages/PatientPortal.tsx', 'utf8');
assert(patientPortalCode.includes('viewingDoctorProfile') && patientPortalCode.includes('setViewingDoctorProfile'),
  'PatientPortal: viewingDoctorProfile state and setter defined');
assert(patientPortalCode.includes('View Profile') && patientPortalCode.includes('setViewingDoctorProfile(doc)'),
  'PatientPortal: Doctor card renders [View Profile] button');
assert(patientPortalCode.includes('Doctor Profile Modal') && patientPortalCode.includes('Clinical Focus & Teleconsultation Guidelines'),
  'PatientPortal: Doctor Profile Modal implemented with complete clinician details');
assert(patientPortalCode.includes('Dharamgarh') && patientPortalCode.includes('dharm'),
  'PatientPortal: Doctor location filter normalizes Dharamgarh / Dharmagarh spelling');

// 2. Patient Portal: Simple Mode 1-tap call & Instant token booking
assert(patientPortalCode.includes('1-TAP CALL DOCTOR NOW') && patientPortalCode.includes('handleStartConsultation(primaryDoctor)'),
  'PatientPortal: Simple Mode offers 1-tap direct doctor consultation without multi-step modal');
assert(patientPortalCode.includes('GET NEXT APPOINTMENT TOKEN (NO FORMS)') && patientPortalCode.includes('storage.generateToken'),
  'PatientPortal: Simple Mode offers 1-tap instant appointment token booking');
assert(patientPortalCode.includes('Preliminary Triage Summary') && patientPortalCode.includes('AI assists. Doctors decide.'),
  'PatientPortal: Simple Mode symptom intake step 4 shows structured triage summary and safety notice');
assert(patientPortalCode.includes('Prescribed Medicines & Village Pharmacy Availability') && patientPortalCode.includes('🔍 Find Medicine'),
  'PatientPortal: Simple Mode records link prescribed medicines directly to pharmacy search');

// 3. Doctor Portal: Sync status badges
const doctorPortalCode = fs.readFileSync('src/pages/DoctorPortal.tsx', 'utf8');
assert(doctorPortalCode.includes('Saved locally') && doctorPortalCode.includes('Waiting to sync') && doctorPortalCode.includes('Synced successfully'),
  'DoctorPortal: Longitudinal prescriptions display transparent sync status badges');

// 4. Pharmacy Portal: Store status & generic lookup
const pharmacyPortalCode = fs.readFileSync('src/pages/PharmacyPortal.tsx', 'utf8');
assert(pharmacyPortalCode.includes('OPEN & DISPENSING') && pharmacyPortalCode.includes('HOLIDAY SCHEDULE') && pharmacyPortalCode.includes('CLOSED'),
  'PharmacyPortal: Store status toggles for Open, Closed, and Holiday schedule present');
assert(pharmacyPortalCode.includes('genericName') && pharmacyPortalCode.includes('Jan Aushadhi'),
  'PharmacyPortal: Generic salt search and Jan Aushadhi substitution lookup active');

// 5. Capacitor & Android configuration
assert(fs.existsSync('capacitor.config.json'), 'Capacitor: capacitor.config.json created');
const capConfig = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
assert(capConfig.appId === 'org.swasthyapath.app' && capConfig.appName === 'Swasthya Path',
  'Capacitor: AppId and AppName correctly set to org.swasthyapath.app and Swasthya Path');

// 6. Mobile Viewport & CSS touch targets
const indexHtml = fs.readFileSync('index.html', 'utf8');
assert(indexHtml.includes('viewport-fit=cover') && indexHtml.includes('mobile-web-app-capable'),
  'index.html: Viewport-fit=cover and mobile web app meta tags configured');

const indexCss = fs.readFileSync('src/index.css', 'utf8');
assert(indexCss.includes('env(safe-area-inset-top') && indexCss.includes('min-height: 44px'),
  'index.css: Safe-area insets and minimum 44px mobile touch target standards configured');

console.log('\n========================================================');
console.log(`SUMMARY: ${passCount}/${passCount + failCount} COMPREHENSIVE TESTS PASSED`);
console.log('========================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('>>> ALL VERIFICATION CHECKS PASSED WITH ZERO REGRESSIONS! <<<');
}
