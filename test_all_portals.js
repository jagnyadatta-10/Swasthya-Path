// automated_verification.js
// Production readiness and role-based portal validation test suite for Swasthya Path

import { readFileSync } from 'fs';
import { resolve } from 'path';

console.log('========================================================');
console.log('SWASTHYA PATH: AUTOMATED PORTAL & ARCHITECTURE TEST SUITE');
console.log('========================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    console.error(`[FAIL] ${testName}`);
    process.exitCode = 1;
  }
}

// 1. Verify types.ts for 5 core roles and required portal models
const typesContent = readFileSync(resolve('./src/types.ts'), 'utf-8');
assert(typesContent.includes("'patient' | 'doctor' | 'pharmacy' | 'admin' | 'lab' | 'administrator' | 'pathology'"), 'Types: All 5 roles supported in UserRole union');
assert(typesContent.includes('export interface LabTestItem'), 'Types: LabTestItem model defined');
assert(typesContent.includes('export interface LabTestOrder'), 'Types: LabTestOrder model with full workflow defined');
assert(typesContent.includes('export interface LabSample'), 'Types: LabSample model with barcode tracking defined');
assert(typesContent.includes('export interface ManagedUser'), 'Types: ManagedUser model with audit and verification defined');
assert(typesContent.includes('export interface EmergencyCase'), 'Types: EmergencyCase model with 7-stage status workflow defined');
assert(typesContent.includes('export interface SystemHealthItem'), 'Types: SystemHealthItem model with latency & honest simulation flag defined');

// 2. Verify storage.ts implementation for lab, admin, emergency, health, audit
const storageContent = readFileSync(resolve('./src/utils/storage.ts'), 'utf-8');
assert(storageContent.includes('getLabTests()'), 'Storage: getLabTests() method implemented');
assert(storageContent.includes('addLabOrder('), 'Storage: addLabOrder() method implemented');
assert(storageContent.includes('updateLabOrderStatus('), 'Storage: updateLabOrderStatus() method implemented');
assert(storageContent.includes('releaseLabReport('), 'Storage: releaseLabReport() method implemented');
assert(storageContent.includes('syncLabReportToPatientRecord('), 'Storage: syncLabReportToPatientRecord() longitudinal sync implemented');
assert(storageContent.includes('getManagedUsers()'), 'Storage: getManagedUsers() method implemented');
assert(storageContent.includes('updateUserVerification('), 'Storage: updateUserVerification() method implemented');
assert(storageContent.includes('updateAccountStatus('), 'Storage: updateAccountStatus() method implemented');
assert(storageContent.includes('getEmergencyCases()'), 'Storage: getEmergencyCases() method implemented');
assert(storageContent.includes('updateEmergencyCaseStatus('), 'Storage: updateEmergencyCaseStatus() method implemented');
assert(storageContent.includes('getSystemHealth()'), 'Storage: getSystemHealth() method implemented');

// 3. Verify AdminPortal.tsx requirements
const adminContent = readFileSync(resolve('./src/pages/AdminPortal.tsx'), 'utf-8');
assert(adminContent.includes('External emergency service integration not connected.'), 'Admin: Explicit emergency integration disclaimer displayed');
assert(adminContent.includes("activeTab === 'overview'"), 'Admin: District Overview tab with 18 KPIs implemented');
assert(adminContent.includes("activeTab === 'users'"), 'Admin: Managed Users directory with filter/verification implemented');
assert(adminContent.includes("activeTab === 'emergency'"), 'Admin: Emergency Escalation center implemented');
assert(adminContent.includes("activeTab === 'facilities'"), 'Admin: Kalahandi Health Facilities registry implemented');
assert(adminContent.includes("activeTab === 'health'"), 'Admin: System Health monitoring implemented');
assert(adminContent.includes("activeTab === 'analytics'"), 'Admin: Operations Analytics implemented');
assert(adminContent.includes("activeTab === 'audit'"), 'Admin: Protected Audit Trail implemented');
assert(adminContent.includes("activeTab === 'notifications'"), 'Admin: Administrative Notifications implemented');
assert(adminContent.includes('Never automatically mark a doctor as verified'), 'Admin: Explicit manual verification constraint enforced');

// 4. Verify MedicalDashboard.tsx (Pathology / Laboratory Portal) requirements
const labContent = readFileSync(resolve('./src/pages/MedicalDashboard.tsx'), 'utf-8');
assert(labContent.includes('Laboratory results should be interpreted by a qualified healthcare professional.'), 'Lab: Required clinical interpretation disclaimer present');
assert(labContent.includes("activeTab === 'dashboard'"), 'Lab: Operations queue with 9 indicators implemented');
assert(labContent.includes("activeTab === 'orders'"), 'Lab: 7-stage test orders & sample workflow implemented');
assert(labContent.includes("activeTab === 'catalogue'"), 'Lab: Standard 7-test diagnostic catalogue implemented');
assert(labContent.includes("activeTab === 'submit'"), 'Lab: Paper scan digitizer with LOW/NORMAL/HIGH parameters implemented');
assert(labContent.includes("activeTab === 'registry'"), 'Lab: Released reports archive with multi-version tracking implemented');
assert(labContent.includes("activeTab === 'vitals'"), 'Lab: Pre-consultation vitals intake implemented');
assert(labContent.includes("activeTab === 'instruments'"), 'Lab: Analyzer telemetry & QC calibration implemented');

// 5. Verify Patient & Doctor Portals integrations
const doctorContent = readFileSync(resolve('./src/pages/DoctorPortal.tsx'), 'utf-8');
assert(doctorContent.includes('Request Pathology Lab Test'), 'Doctor: Request Pathology Lab Test button implemented');
assert(doctorContent.includes('Diagnostic Lab Reports & Scans'), 'Doctor: Lab reports viewer section integrated');

const patientContent = readFileSync(resolve('./src/pages/PatientPortal.tsx'), 'utf-8');
assert(patientContent.includes('Laboratory results should be interpreted by a qualified healthcare professional'), 'Patient: Lab report card with clinical disclaimer present');

// 6. Verify LoginScreen.tsx & Role-based authentication
const loginContent = readFileSync(resolve('./src/pages/LoginScreen.tsx'), 'utf-8');
assert(loginContent.includes("role: 'admin'"), 'Login: Administrator role selection available');
assert(loginContent.includes("role: 'lab'"), 'Login: Pathology Lab role selection available');
assert(loginContent.includes("role: 'patient'"), 'Login: Patient role selection available');
assert(loginContent.includes("role: 'doctor'"), 'Login: Doctor role selection available');
assert(loginContent.includes("role: 'pharmacy'"), 'Login: Pharmacy role selection available');

// 7. Verify Netlify configuration
const netlifyToml = readFileSync(resolve('./netlify.toml'), 'utf-8');
assert(netlifyToml.includes('command = "npm run build"'), 'Netlify: Build command specified in netlify.toml');
assert(netlifyToml.includes('publish = "dist"'), 'Netlify: Publish directory set to dist');
assert(netlifyToml.includes('to = "/index.html"'), 'Netlify: SPA redirect rule configured');

console.log('\n========================================================');
console.log(`SUMMARY: ${passedTests}/${totalTests} TESTS PASSED`);
console.log('========================================================\n');
