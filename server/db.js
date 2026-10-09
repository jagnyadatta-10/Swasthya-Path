import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'swasthya_path.db');
const db = new DatabaseSync(dbPath);

// Compatibility wrappers for pragmas and transactions
db.pragma = (str) => db.exec('PRAGMA ' + str);
db.transaction = (fn) => {
  return (...args) => {
    db.exec('BEGIN');
    try {
      const result = fn(...args);
      db.exec('COMMIT');
      return result;
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }
  };
};

// Enable Write-Ahead Logging for high concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    abha_id TEXT,
    hospital TEXT,
    specialty TEXT,
    gender TEXT,
    age INTEGER,
    location TEXT,
    is_verified INTEGER DEFAULT 1,
    account_status TEXT DEFAULT 'active',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS prescriptions (
    id TEXT PRIMARY KEY,
    prescription_number TEXT UNIQUE NOT NULL,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    doctor_hospital TEXT,
    date TEXT NOT NULL,
    diagnosis_summary TEXT NOT NULL,
    medicines_json TEXT NOT NULL,
    follow_up TEXT,
    notes TEXT,
    digital_signature TEXT,
    status TEXT DEFAULT 'finalized',
    sync_status TEXT DEFAULT 'synced',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled',
    start_time TEXT,
    end_time TEXT,
    duration_seconds INTEGER DEFAULT 0,
    notes TEXT,
    follow_up_plan TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lab_orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    patient_id TEXT NOT NULL,
    patient_name TEXT NOT NULL,
    doctor_id TEXT,
    doctor_name TEXT,
    test_id TEXT NOT NULL,
    test_name TEXT NOT NULL,
    sample_type TEXT NOT NULL,
    priority TEXT DEFAULT 'routine',
    status TEXT DEFAULT 'ordered',
    collection_status TEXT DEFAULT 'pending',
    report_summary TEXT,
    parameters_json TEXT,
    barcode TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pharmacy_inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    strength TEXT,
    category TEXT,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    unit_price REAL NOT NULL DEFAULT 0,
    batch_number TEXT,
    expiry_date TEXT,
    low_stock_threshold INTEGER DEFAULT 50
  );

  CREATE TABLE IF NOT EXISTS emergency_cases (
    id TEXT PRIMARY KEY,
    case_number TEXT UNIQUE NOT NULL,
    patient_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    location TEXT NOT NULL,
    chief_concern TEXT NOT NULL,
    triage_level TEXT NOT NULL,
    dispatch_status TEXT DEFAULT 'incoming',
    assigned_facility TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    user_name TEXT,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    timestamp TEXT NOT NULL
  );
`);

// Seed default users if table is empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

if (userCount === 0) {
  console.log('Seeding initial production database users...');
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('swasthya123', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, username, password_hash, role, phone, abha_id, hospital, specialty, gender, age, location, is_verified, account_status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialUsers = [
    {
      id: 'usr-pat-01',
      name: 'Keshab Sahu',
      username: 'keshab',
      role: 'patient',
      phone: '+91 94371 28401',
      abha_id: '91-4820-1928-4821',
      hospital: null,
      specialty: null,
      gender: 'male',
      age: 26,
      location: 'Bhawanipatna, Kalahandi, Odisha'
    },
    {
      id: 'usr-doc-01',
      name: 'Dr. Ananya Mishra, MD',
      username: 'ananya',
      role: 'doctor',
      phone: '+91 94370 82190',
      abha_id: '91-1029-4820-9921',
      hospital: 'District Headquarters Hospital (DHH) Bhawanipatna',
      specialty: 'General Medicine & Infectious Diseases',
      gender: 'female',
      age: 38,
      location: 'Bhawanipatna, Odisha'
    },
    {
      id: 'usr-doc-02',
      name: 'Dr. Rajesh Patnaik, MBBS, MS',
      username: 'rajesh',
      role: 'doctor',
      phone: '+91 94372 90112',
      abha_id: '91-8841-3920-1049',
      hospital: 'Community Health Centre (CHC) Junagarh',
      specialty: 'Family Medicine & Rural Emergency Care',
      gender: 'male',
      age: 44,
      location: 'Junagarh, Kalahandi, Odisha'
    },
    {
      id: 'usr-pharma-01',
      name: 'Maa Manikeswari Medicos (Prasant Pradhan)',
      username: 'pharmacy',
      role: 'pharmacy',
      phone: '+91 98610 44210',
      abha_id: 'PHARM-OD-KLH-002',
      hospital: 'Pradhan Medical Complex, College Road, Bhawanipatna',
      specialty: 'Jan Aushadhi & Emergency Supply',
      gender: 'male',
      age: 42,
      location: 'Bhawanipatna, Odisha'
    },
    {
      id: 'usr-lab-01',
      name: 'DHH Bhawanipatna Central Pathology Lab',
      username: 'lab',
      role: 'lab',
      phone: '+91 94373 55102',
      abha_id: 'LAB-OD-KLH-001',
      hospital: 'DHH Bhawanipatna Diagnostics Wing',
      specialty: 'Clinical Hematology, Biochemistry & Microbiology',
      gender: 'other',
      age: null,
      location: 'Bhawanipatna, Odisha'
    },
    {
      id: 'usr-admin-01',
      name: 'District Health Administration (Chief District Medical Officer)',
      username: 'admin',
      role: 'admin',
      phone: '+91 94370 00108',
      abha_id: 'ADMIN-OD-KLH-CDMO',
      hospital: 'Office of the CDMO, Kalahandi',
      specialty: 'Public Health Administration & Tele-OPD Oversight',
      gender: 'other',
      age: null,
      location: 'Kalahandi, Odisha'
    }
  ];

  for (const u of initialUsers) {
    insertUser.run(
      u.id,
      u.name,
      u.username,
      defaultPasswordHash,
      u.role,
      u.phone,
      u.abha_id,
      u.hospital,
      u.specialty,
      u.gender,
      u.age,
      u.location,
      1,
      'active',
      new Date().toISOString()
    );
  }
}

// Seed initial pharmacy inventory
const inventoryCount = db.prepare('SELECT COUNT(*) as count FROM pharmacy_inventory').get().count;

if (inventoryCount === 0) {
  console.log('Seeding initial pharmacy inventory...');
  const insertMed = db.prepare(`
    INSERT INTO pharmacy_inventory (id, name, strength, category, stock_quantity, unit_price, batch_number, expiry_date, low_stock_threshold)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const initialMeds = [
    { id: 'med-01', name: 'Tab Paracetamol', strength: '500mg', category: 'Analgesic / Antipyretic', stock_quantity: 450, unit_price: 1.5, batch_number: 'PCM-2026-A1', expiry_date: '2028-06-30' },
    { id: 'med-02', name: 'Oral Rehydration Salts (ORS WHO)', strength: '21.8g Sachet', category: 'Electrolyte', stock_quantity: 280, unit_price: 5.0, batch_number: 'ORS-2026-B4', expiry_date: '2027-12-31' },
    { id: 'med-03', name: 'Tab Cetirizine', strength: '10mg', category: 'Antihistamine', stock_quantity: 320, unit_price: 2.0, batch_number: 'CTZ-2026-C2', expiry_date: '2028-03-31' },
    { id: 'med-04', name: 'Tab Amoxicillin', strength: '500mg', category: 'Antibiotic', stock_quantity: 190, unit_price: 6.5, batch_number: 'AMX-2026-D9', expiry_date: '2027-09-30' },
    { id: 'med-05', name: 'Tab Pantoprazole', strength: '40mg', category: 'Antacid / PPI', stock_quantity: 240, unit_price: 4.0, batch_number: 'PNT-2026-E1', expiry_date: '2028-01-31' },
    { id: 'med-06', name: 'Zinc Sulfate Dispersible', strength: '20mg', category: 'Mineral Supplement', stock_quantity: 160, unit_price: 2.5, batch_number: 'ZNC-2026-F3', expiry_date: '2027-11-30' },
    { id: 'med-07', name: 'Tab Azithromycin', strength: '500mg', category: 'Antibiotic', stock_quantity: 85, unit_price: 18.0, batch_number: 'AZM-2026-G7', expiry_date: '2027-08-31' }
  ];

  for (const m of initialMeds) {
    insertMed.run(m.id, m.name, m.strength, m.category, m.stock_quantity, m.unit_price, m.batch_number, m.expiry_date, 50);
  }
}

// Seed initial lab diagnostic catalog
const labOrdersCount = db.prepare('SELECT COUNT(*) as count FROM lab_orders').get().count;

if (labOrdersCount === 0) {
  console.log('Seeding initial lab orders...');
  const insertLab = db.prepare(`
    INSERT INTO lab_orders (id, order_number, patient_id, patient_name, doctor_id, doctor_name, test_id, test_name, sample_type, priority, status, collection_status, report_summary, parameters_json, barcode, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertLab.run(
    'lab-ord-01',
    'LAB-KLH-2026-0042',
    'usr-pat-01',
    'Keshab Sahu',
    'usr-doc-01',
    'Dr. Ananya Mishra, MD',
    'cbc-01',
    'Complete Blood Count (CBC) with Platelet Count',
    'Venous Whole Blood (EDTA)',
    'urgent',
    'completed',
    'collected',
    'Hemoglobin slightly low (12.2 g/dL). Platelets normal (210,000/mcL). TLC 7,800/mcL.',
    JSON.stringify([
      { name: 'Hemoglobin', value: '12.2', unit: 'g/dL', normalRange: '13.0 - 17.0', flag: 'LOW' },
      { name: 'TLC (Total Leukocyte Count)', value: '7,800', unit: '/mcL', normalRange: '4,000 - 11,000', flag: 'NORMAL' },
      { name: 'Platelets', value: '210,000', unit: '/mcL', normalRange: '150,000 - 450,000', flag: 'NORMAL' },
      { name: 'RBC Count', value: '4.4', unit: 'million/mcL', normalRange: '4.5 - 5.9', flag: 'LOW' }
    ]),
    'BC-KLH-99214',
    new Date(Date.now() - 86400000).toISOString()
  );
}

export default db;
