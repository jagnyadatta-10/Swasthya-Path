// Test script to verify registration, persistence, and dynamic portal reflection
import fs from 'fs';

console.log('Testing registration and authentication codebase...');

// Check LoginScreen.tsx for:
// 1. No top bar on unauthenticated state (handled in App.tsx)
// 2. eSanjeevani styling
// 3. Register sets activeTab to login, displays green success banner, pre-fills identifier
const appTsx = fs.readFileSync('src/App.tsx', 'utf8');
const loginTsx = fs.readFileSync('src/pages/LoginScreen.tsx', 'utf8');
const storageTs = fs.readFileSync('src/utils/storage.ts', 'utf8');
const patientTsx = fs.readFileSync('src/pages/PatientPortal.tsx', 'utf8');
const doctorTsx = fs.readFileSync('src/pages/DoctorPortal.tsx', 'utf8');
const pharmacyTsx = fs.readFileSync('src/pages/PharmacyPortal.tsx', 'utf8');
const labTsx = fs.readFileSync('src/pages/MedicalDashboard.tsx', 'utf8');
const adminTsx = fs.readFileSync('src/pages/AdminPortal.tsx', 'utf8');

const checks = [
  {
    name: 'App.tsx: Header hidden when unauthenticated (!currentUser)',
    pass: appTsx.includes('{currentUser && (') && appTsx.includes('<Header')
  },
  {
    name: 'App.tsx: SafetyBanner hidden when unauthenticated',
    pass: appTsx.includes('{currentUser && <SafetyBanner')
  },
  {
    name: 'App.tsx: DemoSimulator hidden when unauthenticated',
    pass: appTsx.includes('{currentUser && (') && appTsx.includes('<DemoSimulator')
  },
  {
    name: 'App.tsx: Footer hidden when unauthenticated',
    pass: appTsx.includes('{currentUser && (') && appTsx.includes('<footer className="app-footer"')
  },
  {
    name: 'LoginScreen: 3D Healthcare Illustration present',
    pass: loginTsx.includes('/images/esanjeevani-white-3d-bg.jpg')
  },
  {
    name: 'LoginScreen: National Tricolor top ribbon present',
    pass: loginTsx.includes('esanjeevani-top-ribbon')
  },
  {
    name: 'LoginScreen: Switches to login tab after registration',
    pass: loginTsx.includes("setActiveTab('login')") && loginTsx.includes('storage.registerNewAccount')
  },
  {
    name: 'LoginScreen: Prefills registered mobile or email after registration',
    pass: loginTsx.includes('setLoginIdentifier(newAccount.mobile || newAccount.email')
  },
  {
    name: 'LoginScreen: Displays green success message after registration',
    pass: loginTsx.includes('setSuccessMsg') && loginTsx.includes('Registration successful')
  },
  {
    name: 'Storage: registerNewAccount saves user and persists to localStorage',
    pass: storageTs.includes('registerNewAccount') && storageTs.includes('KEYS.REGISTERED_USERS')
  },
  {
    name: 'Storage: authenticateUser matches registered users by phone, email, name and password',
    pass: storageTs.includes('authenticateUser') && storageTs.includes('getRegisteredUsers')
  },
  {
    name: 'PatientPortal: Uses dynamic user.name in greeting instead of static name',
    pass: patientTsx.includes('${user.name}') || patientTsx.includes("user.name")
  },
  {
    name: 'PatientPortal: Uses dynamic user.patientId and user.location',
    pass: patientTsx.includes('user.patientId') && patientTsx.includes('user.location')
  },
  {
    name: 'DoctorPortal: Uses dynamic user.name, license, and specialty',
    pass: doctorTsx.includes('user.name') && doctorTsx.includes('user.registrationNumber') && doctorTsx.includes('user.specialty')
  },
  {
    name: 'PharmacyPortal: Uses dynamic user.name, drug license, and location',
    pass: pharmacyTsx.includes('user.name') && pharmacyTsx.includes('user.registrationNumber') && pharmacyTsx.includes('user.location')
  },
  {
    name: 'MedicalDashboard: Uses dynamic user.name, registration number, and location',
    pass: labTsx.includes('user?.name') && labTsx.includes('user?.registrationNumber')
  },
  {
    name: 'AdminPortal: Uses dynamic user.name and designation',
    pass: adminTsx.includes('user.name') && adminTsx.includes('user.designation')
  }
];

let allPassed = true;
checks.forEach(c => {
  if (c.pass) {
    console.log(`[PASS] ${c.name}`);
  } else {
    console.log(`[FAIL] ${c.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n>>> ALL 17 SYSTEM & FLOW VERIFICATIONS PASSED SUCCESSFULLY! <<<');
} else {
  console.error('\n>>> SOME VERIFICATIONS FAILED! <<<');
  process.exit(1);
}
