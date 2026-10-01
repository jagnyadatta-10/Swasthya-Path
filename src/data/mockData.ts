import {
  DemoUser,
  DoctorItem,
  MedicineItem,
  TriageQueueItem,
  AppointmentItem,
  PharmacyRequest,
  HealthRecord,
  ImpactMetrics,
  PhysiologicalVitals,
  DiagnosticDocument,
  FullPrescription,
  ConsultationToken,
  SpecialistRequest,
  AppNotification,
  AuditLogEntry,
  CareJourneyStage,
  HealthFacility,
  ConsentItem,
  CarePlan,
  NcdRecord,
  TbTreatmentRecord
} from '../types';

export const DEMO_USERS: Record<string, DemoUser> = {
  patient: {
    name: 'Keshab Rout',
    email: 'patient@swasthyapath.demo',
    mobile: '+91 90000 10001',
    role: 'patient',
    portalTitle: 'Patient Portal',
    badge: 'Rural Citizen • Kalahandi, Odisha',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    location: 'Kalahandi, Odisha',
    patientId: 'RHB-OD-KLH-0941',
    age: 26,
    gender: 'Male',
    bloodGroup: 'B+',
    abhaId: '98-2143-8765-1094',
    allergies: 'No known drug allergies',
    conditions: 'None reported',
    emergencyContact: '+91 94371 88990 (Spouse)',
    block: 'Bhawanipatna'
  },
  doctor: {
    name: 'Dr. Ananya Mishra',
    email: 'doctor@swasthyapath.demo',
    mobile: '+91 90000 10002',
    role: 'doctor',
    portalTitle: 'Clinician Workspace',
    badge: 'Medical Officer • District Telehealth Hub',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
    location: 'District Headquarters Hospital (DHH) Bhawanipatna, Kalahandi'
  },
  pharmacy: {
    name: 'Maa Laxmi Pharmacy',
    email: 'pharmacy@swasthyapath.demo',
    mobile: '+91 90000 10003',
    role: 'pharmacy',
    portalTitle: 'Pharmacy Partner Hub',
    badge: 'Authorized Jan Aushadhi • Bhawanipatna',
    avatar: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=150&q=80',
    location: 'Near Town Hall & DHH Main Gate, Bhawanipatna, Kalahandi'
  },
  admin: {
    name: 'Kalahandi Health Administrator',
    email: 'admin@swasthyapath.demo',
    mobile: '+91 90000 10004',
    role: 'admin',
    portalTitle: 'District Health Administration Portal',
    badge: 'District Health Society • Kalahandi, Odisha',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    location: 'CDMO Complex, Bhawanipatna, Kalahandi'
  }
};

export const INITIAL_VITALS: PhysiologicalVitals = {
  temperatureF: 99.8,
  pulseBpm: 82,
  bpSystolic: 118,
  bpDiastolic: 78,
  spO2Percent: 98,
  respRate: 18,
  weightKg: 54,
  enteredBy: 'Patient-entered / manually entered',
  recordedAt: 'Today, 10:15 AM'
};

export const INITIAL_DOCUMENTS: DiagnosticDocument[] = [
  {
    id: 'doc-lab-01',
    title: 'Complete Blood Count (CBC) Panel',
    category: 'Lab Report',
    date: '30/08/2026',
    provider: 'DHH Bhawanipatna Pathology Lab',
    notes: 'Hemoglobin: 11.8 g/dL, Platelets: 2.1 Lakh, TLC: 7,400. Normal reference range.'
  },
  {
    id: 'doc-xray-02',
    title: 'Chest X-Ray PA View',
    category: 'X-Ray',
    date: '15/07/2026',
    provider: 'District Mobile Radiology Van',
    notes: 'Bilateral lung fields clear. No active infiltrates or consolidation observed.'
  },
  {
    id: 'doc-ref-03',
    title: 'ASHA Immunization & Vitals Referral Card',
    category: 'Referral',
    date: '20/05/2026',
    provider: 'Kalahandi Sub-Center Clinic',
    notes: 'Routine maternal & child health follow-up records verified.'
  }
];

export const INITIAL_PRESCRIPTIONS: FullPrescription[] = [
  {
    id: 'rx-001',
    prescriptionNumber: 'RX-KLH-2026-0881',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    doctorName: 'Dr. Ananya Mishra',
    doctorHospital: 'DHH Bhawanipatna Telehealth Unit',
    date: '28/09/2026',
    diagnosisSummary: 'Acute mild viral upper respiratory infection without emergency red-flags.',
    medicines: [
      {
        id: 'm1',
        name: 'Paracetamol',
        strength: '500mg',
        dosage: '1 tablet',
        frequency: 'Thrice daily after food (SOS for fever > 100°F)',
        duration: '3 days',
        instructions: 'Drink plenty of warm boiled water'
      },
      {
        id: 'm2',
        name: 'Oral Rehydration Salts (ORS)',
        strength: 'WHO Standard Sachet (20.5g)',
        dosage: '1 sachet dissolved in 1 Liter clean water',
        frequency: 'Sip throughout the day',
        duration: '2 days',
        instructions: 'Do not boil after mixing'
      }
    ],
    followUp: 'Teleconsultation follow-up in 3 days if temperature persists.',
    notes: 'Doctor authorized prescription. Please verify availability at Maa Manikeswari Jan Aushadhi Kendra.',
    digitalSignature: 'Verified by Dr. Ananya Mishra (Reg. No. MCI-ODI-48219)'
  }
];

export const INITIAL_RECORDS: HealthRecord[] = [
  {
    id: 'rec-001',
    patientId: 'RHB-OD-KLH-0941',
    type: 'consultation',
    at: '28/09/2026, 11:20 AM',
    timestamp: Date.now() - 172800000,
    doctorName: 'Dr. Ananya Mishra',
    symptoms: 'Fever and body weakness for two days',
    duration: '2–3 days',
    warningSign: 'None selected',
    pathway: 'clinician consultation',
    urgency: 'routine',
    notes: 'Teleconsultation completed. Prescribed hydration, rest, and Tab Paracetamol 500mg SOS.',
    followUpPlan: 'Routine monitoring',
    synced: true
  },
  {
    id: 'rec-002',
    patientId: 'RHB-OD-KLH-0941',
    type: 'prescription',
    at: '15/09/2026, 03:45 PM',
    timestamp: Date.now() - 1296000000,
    doctorName: 'Dr. Ananya Mishra',
    notes: 'Tab Paracetamol 500mg SOS, ORS solution 1 sachet in 1L clean water. Follow up if fever > 101°F.',
    pathway: 'clinician consultation',
    synced: true
  },
  {
    id: 'rec-003',
    patientId: 'RHB-OD-KLH-0941',
    type: 'lab',
    at: '30/08/2026, 09:30 AM',
    timestamp: Date.now() - 2592000000,
    doctorName: 'DHH Bhawanipatna Pathology',
    notes: 'Complete Blood Count (CBC) Panel: Hb 11.8 g/dL, Platelets 2.1L. Normal limits.',
    pathway: 'clinician consultation',
    synced: true
  },
  {
    id: 'rec-004',
    patientId: 'RHB-OD-KLH-0941',
    type: 'consultation',
    at: '20/08/2026, 10:15 AM',
    timestamp: Date.now() - 3456000000,
    doctorName: 'Dr. Rajesh Sahu',
    notes: 'Routine seasonal health screening. Blood pressure 118/76 mmHg. Advised dietary iron rich greens.',
    pathway: 'clinician consultation',
    synced: true
  }
];

export const INITIAL_DOCTORS: DoctorItem[] = [
  {
    id: 'doc-01',
    name: 'Dr. Ananya Mishra',
    specialty: 'General Medicine',
    hospital: 'District Headquarters Hospital (DHH) Bhawanipatna',
    nextSlot: 'Today • Available Now',
    languages: ['ଓଡ଼ିଆ (Odia)', 'हिन्दी (Hindi)', 'English'],
    rating: 4.9,
    available: true,
    experience: '9 yrs exp • MBBS, MD',
    fees: 'Free (Govt Telehealth Initiative)',
    estimatedWaitMin: 6,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-02',
    name: 'Dr. Rajesh Sahu',
    specialty: 'Internal Medicine',
    hospital: 'Sub-Divisional Hospital Dharamgarh',
    nextSlot: 'Today • 10:30 AM',
    languages: ['ଓଡ଼ିଆ (Odia)', 'English'],
    rating: 4.8,
    available: true,
    experience: '14 yrs exp • MBBS, DNB',
    fees: 'Free (Govt Telehealth Initiative)',
    estimatedWaitMin: 18,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-03',
    name: 'Dr. Priya Nayak',
    specialty: 'Paediatrics & Maternal Health',
    hospital: 'Community Health Center (CHC) Junagarh',
    nextSlot: 'Today • 11:15 AM',
    languages: ['ଓଡ଼ିଆ (Odia)', 'हिन्दी (Hindi)', 'English'],
    rating: 4.95,
    available: true,
    experience: '8 yrs exp • MBBS, MD Pediatrics',
    fees: 'Free (Govt Telehealth Initiative)',
    estimatedWaitMin: 12,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813620-4e38e5e8e89f?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-04',
    name: 'Dr. S. K. Behera',
    specialty: 'Dermatology & Skin Care',
    hospital: 'DHH Bhawanipatna Apex Clinic',
    nextSlot: 'Tomorrow • 09:30 AM',
    languages: ['ଓଡ଼ିଆ (Odia)', 'English'],
    rating: 4.75,
    available: false,
    experience: '11 yrs exp • MD Dermatology',
    fees: 'Free (Govt Telehealth Initiative)',
    estimatedWaitMin: 35,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_MEDICINES: MedicineItem[] = [
  {
    id: 'med-01',
    name: 'Paracetamol 500mg',
    category: 'Fever & Pain Relief',
    pharmacyName: 'Store A: Maa Manikeswari Jan Aushadhi Kendra',
    block: 'Bhawanipatna',
    address: 'Near Town Hall & DHH Main Gate, Bhawanipatna',
    phone: '+91 94370 12345',
    status: 'AVAILABLE',
    quantity: 240,
    unitPrice: '₹18 / strip of 10',
    distanceKm: 1.2,
    lastUpdated: '10 mins ago',
    isEssential: true,
    isOpen: true
  },
  {
    id: 'med-02',
    name: 'Amoxicillin 500mg',
    category: 'Prescription Antibiotic',
    pharmacyName: 'Maa Manikeswari Jan Aushadhi Kendra',
    block: 'Bhawanipatna',
    address: 'Near Town Hall & DHH Main Gate, Bhawanipatna',
    phone: '+91 94370 12345',
    status: 'LIMITED STOCK',
    quantity: 14,
    unitPrice: '₹65 / strip of 10',
    distanceKm: 1.2,
    lastUpdated: '35 mins ago',
    isEssential: true,
    isOpen: true
  },
  {
    id: 'med-03',
    name: 'ORS Sachets (WHO Formula)',
    category: 'Dehydration & Diarrhea Care',
    pharmacyName: 'Maa Manikeswari Jan Aushadhi Kendra',
    block: 'Bhawanipatna',
    address: 'Near Town Hall & DHH Main Gate, Bhawanipatna',
    phone: '+91 94370 12345',
    status: 'AVAILABLE',
    quantity: 180,
    unitPrice: '₹6 / sachet',
    distanceKm: 1.2,
    lastUpdated: '15 mins ago',
    isEssential: true,
    isOpen: true
  },
  {
    id: 'med-04',
    name: 'Cetirizine 10mg',
    category: 'Anti-allergy & Cold',
    pharmacyName: 'Maa Manikeswari Jan Aushadhi Kendra',
    block: 'Bhawanipatna',
    address: 'Near Town Hall & DHH Main Gate, Bhawanipatna',
    phone: '+91 94370 12345',
    status: 'OUT OF STOCK',
    quantity: 0,
    unitPrice: '₹22 / strip of 10',
    distanceKm: 1.2,
    lastUpdated: '1 hour ago',
    isEssential: false,
    isOpen: true
  },
  {
    id: 'med-05',
    name: 'Paracetamol 500mg',
    category: 'Fever & Pain Relief',
    pharmacyName: 'Store B: Junagarh Gramin Pharmacy',
    block: 'Junagarh',
    address: 'Hospital Road, Junagarh Market',
    phone: '+91 94372 67890',
    status: 'LIMITED STOCK',
    quantity: 8,
    unitPrice: '₹18 / strip of 10',
    distanceKm: 18.5,
    lastUpdated: '18 mins ago',
    isEssential: true,
    isOpen: true
  },
  {
    id: 'med-05-c',
    name: 'Paracetamol 500mg',
    category: 'Fever & Pain Relief',
    pharmacyName: 'Store C: Chhoriagarh Village Chemist',
    block: 'Bhawanipatna',
    address: 'Village Chowk, Chhoriagarh',
    phone: '+91 94374 55443',
    status: 'OUT OF STOCK',
    quantity: 0,
    unitPrice: '₹20 / strip of 10',
    distanceKm: 0.5,
    lastUpdated: '40 mins ago',
    isEssential: true,
    isOpen: true
  },
  {
    id: 'med-06',
    name: 'Amoxicillin 500mg',
    category: 'Prescription Antibiotic',
    pharmacyName: 'Dharamgarh Sub-Divisional Jan Aushadhi',
    block: 'Dharamgarh',
    address: 'Near Sub-Divisional Hospital, Dharamgarh',
    phone: '+91 94373 11223',
    status: 'AVAILABLE',
    quantity: 85,
    unitPrice: '₹68 / strip of 10',
    distanceKm: 42.0,
    lastUpdated: '2 hours ago',
    isEssential: true,
    isOpen: true
  },
  {
    id: 'med-07',
    name: 'ORS Sachets',
    category: 'Dehydration Care',
    pharmacyName: 'Kesinga Chemist & Druggist',
    block: 'Kesinga',
    address: 'Station Road, Kesinga Town',
    phone: '+91 94375 99887',
    status: 'AVAILABLE',
    quantity: 90,
    unitPrice: '₹6 / sachet',
    distanceKm: 34.0,
    lastUpdated: '1 hour ago',
    isEssential: true,
    isOpen: true
  },
  {
    id: 'med-08',
    name: 'Azithromycin 250mg',
    category: 'Respiratory Antibiotic',
    pharmacyName: 'Narla Jan Swasthya Kendra',
    block: 'Narla / Lanjigarh',
    address: 'Block Chowk, Narla Road',
    phone: '+91 94376 44332',
    status: 'LIMITED STOCK',
    quantity: 8,
    unitPrice: '₹72 / strip of 6',
    distanceKm: 28.0,
    lastUpdated: '20 mins ago',
    isEssential: true,
    isOpen: true
  }
];

export const INITIAL_TRIAGE_QUEUE: TriageQueueItem[] = [
  {
    id: 'triage-01',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    age: 26,
    gender: 'Male',
    village: 'Kalahandi, Odisha',
    symptoms: 'Fever and body weakness for two days',
    duration: '2 days',
    warningSign: 'None selected',
    urgency: 'routine',
    aiSummary: 'AI-assisted preliminary summary: Low-risk viral/respiratory symptom pattern. No emergency warning signs. Doctor must verify before making a clinical decision.',
    timestamp: 'Today • 04:10 PM',
    waitingTimeMin: 8,
    status: 'pending'
  },
  {
    id: 'triage-02',
    patientId: 'RHB-OD-KLH-0812',
    patientName: 'Demo Patient 02',
    age: 58,
    gender: 'Male',
    village: 'Junagarh Block, Kalahandi',
    symptoms: 'Sudden onset severe chest tightness and acute shortness of breath while resting',
    duration: 'Today (Past 2 hours)',
    warningSign: 'Severe difficulty breathing & chest pain',
    urgency: 'urgent',
    aiSummary: 'CRITICAL ESCALATION TRIGGERED: Red-flag cardio-respiratory warning signs present. Direct immediate transfer to Community Health Center (CHC) Emergency. Do not delay for teleconsultation.',
    timestamp: 'Today • 03:52 PM',
    waitingTimeMin: 2,
    status: 'escalated'
  },
  {
    id: 'triage-03',
    patientId: 'RHB-OD-KLH-0744',
    patientName: 'Saraswati Naik',
    age: 44,
    gender: 'Female',
    village: 'Dharamgarh, Kalahandi',
    symptoms: 'Mild knee stiffness and fatigue for over a week',
    duration: 'More than a week',
    warningSign: 'None selected',
    urgency: 'routine',
    aiSummary: 'Chronic musculoskeletal pattern. Stable vitals reported by ASHA worker. Scheduled for general medicine tele-review.',
    timestamp: 'Today • 02:30 PM',
    waitingTimeMin: 16,
    status: 'reviewed',
    doctorNotes: 'Prescribed warm compress and topical analgesics. Blood urea & uric acid test recommended at next mobile clinic.'
  }
];

export const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'apt-01',
    time: '4:30 PM',
    patientName: 'Keshab Rout (RHB-OD-KLH-0941)',
    type: 'Video Consultation',
    status: 'Scheduled',
    channel: 'Video Consultation',
    date: 'Today'
  },
  {
    id: 'apt-02',
    time: '5:00 PM',
    patientName: 'Demo Patient 02',
    type: 'Urgent Referral Coordination',
    status: 'In Progress',
    channel: 'Low-Bandwidth Audio',
    date: 'Today'
  },
  {
    id: 'apt-03',
    time: '5:30 PM',
    patientName: 'Saraswati Naik',
    type: 'Routine Chronic Review',
    status: 'Scheduled',
    channel: 'Video Consultation',
    date: 'Today'
  }
];

export const INITIAL_REQUESTS: PharmacyRequest[] = [
  {
    id: 'req-01',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    village: 'Bhawanipatna, Kalahandi',
    medicines: 'Paracetamol 500mg (1 strip), ORS Sachets (2 pkts)',
    status: 'Pending',
    timestamp: 'Today • 04:12 PM'
  },
  {
    id: 'req-02',
    patientId: 'RHB-OD-KLH-0744',
    patientName: 'Kalandi Charan',
    village: 'Kesinga Block, Kalahandi',
    medicines: 'Cetirizine 10mg (1 strip)',
    status: 'Confirmed Available',
    timestamp: 'Today • 02:40 PM'
  }
];

export const INITIAL_IMPACT_METRICS: ImpactMetrics = {
  tripsAvoided: 184,
  travelCostSavedRupees: 55200,
  appointmentsCompleted: 312,
  pharmacyStockChecks: 540,
  missedConsultationsReducedPercent: 78,
  avgNavigationMinutes: 6.4
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Consultation Token Generated',
    body: 'Demo notification: Your consultation token is A-024 with Dr. Ananya Mishra.',
    time: '5 mins ago',
    read: false,
    type: 'queue'
  },
  {
    id: 'notif-2',
    title: 'Doctor Ready',
    body: 'Demo notification: Dr. Ananya Mishra is ready for your teleconsultation bridge.',
    time: '2 mins ago',
    read: false,
    type: 'doctor'
  },
  {
    id: 'notif-3',
    title: 'Pharmacy Stock Update',
    body: 'Demo notification: Maa Manikeswari Jan Aushadhi confirmed Paracetamol 500mg in stock.',
    time: '15 mins ago',
    read: true,
    type: 'pharmacy'
  }
];

export const INITIAL_AUDIT_LOG: AuditLogEntry[] = [
  { id: 'aud-1', time: '10:32 AM', action: 'Patient joined consultation queue (Token A-024)', actor: 'Keshab Rout (Patient)' },
  { id: 'aud-2', time: '10:40 AM', action: 'Clinician accessed pre-intake structured summary', actor: 'Dr. Ananya Mishra' },
  { id: 'aud-3', time: '10:43 AM', action: 'Encrypted Telehealth video consultation session started', actor: 'System Bridge' },
  { id: 'aud-4', time: '10:56 AM', action: 'E-Prescription RX-KLH-2026-0881 digitally generated', actor: 'Dr. Ananya Mishra' },
  { id: 'aud-5', time: '10:58 AM', action: 'Consultation completed & synced to local health record', actor: 'System' }
];

export const INITIAL_SPECIALIST_REQUESTS: SpecialistRequest[] = [
  {
    id: 'spec-01',
    referringDoctor: 'Dr. Ananya Mishra',
    requestedSpecialist: 'Internal Medicine Specialist',
    reason: 'Persistent fever and body weakness requiring secondary expert opinion.',
    urgency: 'Routine',
    status: 'Requested',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    timestamp: 'Today, 10:45 AM'
  }
];

export const INITIAL_CARE_JOURNEY: CareJourneyStage[] = [
  { id: 1, title: 'Symptom Reported', status: 'completed', detail: 'Fever and body weakness for two days reported via intake' },
  { id: 2, title: 'Safety Check', status: 'completed', detail: 'Emergency red flags screened: None selected' },
  { id: 3, title: 'Doctor Consultation', status: 'completed', detail: 'Teleconsultation completed with Dr. Ananya Mishra' },
  { id: 4, title: 'E-Prescription', status: 'completed', detail: 'RX-KLH-2026-0881 generated by doctor' },
  { id: 5, title: 'Medicine Availability', status: 'completed', detail: 'Maa Manikeswari Jan Aushadhi stock verified (0.8km away)' },
  { id: 6, title: 'Care Follow-up', status: 'pending', detail: 'Routine monitoring & 3-day tele-review pending' }
];

export const INITIAL_FACILITIES: HealthFacility[] = [
  {
    id: 'fac-01',
    name: 'District Headquarters Hospital (DHH) Bhawanipatna',
    type: 'District Hospital',
    block: 'Bhawanipatna',
    address: 'Hospital Road, Bhawanipatna, Kalahandi, Odisha - 766001',
    services: ['24x7 Emergency Care', 'General Medicine', 'Paediatrics', 'Mother & Child Hospital', 'Dialysis Unit', 'Tele-OPD Node'],
    isOpen: true,
    teleconsultAvailable: true,
    distanceKm: 1.8,
    phone: '06670-230450',
    referralStatus: 'Accepting Referrals'
  },
  {
    id: 'fac-02',
    name: 'Community Health Centre (CHC) Junagarh',
    type: 'CHC',
    block: 'Junagarh',
    address: 'Near Old Bus Stand, Junagarh, Kalahandi - 766014',
    services: ['Emergency First-Aid', 'General OPD', 'Labor Room', 'Basic Lab Tests', 'ASHA Coordination', 'Telehealth Kiosk'],
    isOpen: true,
    teleconsultAvailable: true,
    distanceKm: 26.4,
    phone: '06672-243220',
    referralStatus: 'Accepting Referrals'
  },
  {
    id: 'fac-03',
    name: 'Sub-Divisional Hospital (SDH) Dharamgarh',
    type: 'District Hospital',
    block: 'Dharamgarh',
    address: 'Main Road, Dharamgarh, Kalahandi - 766015',
    services: ['Emergency Ward', 'Gynaecology', 'Surgery', 'Jan Aushadhi Kendra', 'Telemedicine Unit'],
    isOpen: true,
    teleconsultAvailable: true,
    distanceKm: 42.0,
    phone: '06672-242130',
    referralStatus: 'Accepting Referrals'
  },
  {
    id: 'fac-04',
    name: 'Primary Health Centre (PHC) Kesinga',
    type: 'PHC',
    block: 'Kesinga',
    address: 'Railway Colony Road, Kesinga, Kalahandi - 766012',
    services: ['Primary Care', 'Immunisation', 'NCD Screening', 'Malaria Rapid Testing', 'Maternal Health'],
    isOpen: true,
    teleconsultAvailable: true,
    distanceKm: 34.5,
    phone: '06670-222114',
    referralStatus: 'Accepting Referrals'
  },
  {
    id: 'fac-05',
    name: 'Maa Manikeswari Jan Aushadhi Kendra',
    type: 'Pharmacy',
    block: 'Bhawanipatna',
    address: 'Opposite DHH Gate, Bhawanipatna, Kalahandi',
    services: ['Affordable Generic Medicines', 'ORS & Electrolytes', 'Antibiotics', 'Chronic Care Drugs', 'Stock Verification'],
    isOpen: true,
    teleconsultAvailable: false,
    distanceKm: 0.8,
    phone: '06670-230912',
    referralStatus: 'Accepting Referrals'
  }
];

export const INITIAL_CONSENTS: ConsentItem[] = [
  {
    id: 'con-01',
    party: 'District Telehealth Clinician Pool (DHH Bhawanipatna)',
    dataType: 'Longitudinal EHR, Vitals & Consultation Notes',
    purpose: 'Active teleconsultation evaluation and prescription delivery',
    duration: '30 Days (Active care episode)',
    status: 'Granted',
    expiresAt: '30 Oct 2026'
  },
  {
    id: 'con-02',
    party: 'District Pathology & Diagnostic Imaging Wing',
    dataType: 'Lab Reports, CBC & Radiological X-Rays',
    purpose: 'Secondary clinical inspection and diagnostic confirmation',
    duration: '90 Days',
    status: 'Granted',
    expiresAt: '28 Dec 2026'
  },
  {
    id: 'con-03',
    party: 'Maa Laxmi & Maa Manikeswari Jan Aushadhi Pharmacies',
    dataType: 'Prescription Line Items Only (Zero Diagnostic Data Excluded)',
    purpose: 'Local medicine stock verification and hold reservation',
    duration: 'Per request (Single-use verification)',
    status: 'Granted',
    expiresAt: 'Per Request'
  }
];

export const INITIAL_CARE_PLANS: CarePlan[] = [
  {
    id: 'cp-01',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    doctorName: 'Dr. Ananya Mishra',
    diagnosis: 'Acute febrile viral episode with asthenia',
    followUpDate: 'in 3 days (03 Oct 2026)',
    followUpMode: 'Teleconsultation',
    instructions: 'Maintain adequate hydration with ORS, monitor body temperature twice daily, and avoid heavy field labor.',
    requiredTests: ['Repeat CBC if fever persists beyond 72h', 'Malaria Rapid Smear (if chills develop)'],
    medicinePlan: 'Tab Paracetamol 500mg SOS (Max 3/day) + WHO ORS Sachet 1L/day',
    warningSignsToWatch: ['SpO2 dropping below 94%', 'Persistent vomiting unable to hold fluids', 'Chest tightness or dizziness'],
    status: 'Active'
  }
];

export const INITIAL_NCD: NcdRecord = {
  condition: 'Hypertension',
  carePlan: 'Daily morning Blood Pressure monitoring • Low sodium intake (<5g/day) • 30 mins brisk walking',
  lastReading: '128/82 mmHg (Well Controlled)',
  targetGoal: '< 130/80 mmHg',
  adherencePercent: 96,
  nextFollowUp: 'in 14 days (14 Oct 2026)',
  status: 'Controlled'
};

export const INITIAL_TB: TbTreatmentRecord = {
  regimen: 'Fixed-Dose Combination (FDC) Category 1 (HRZE)',
  phase: 'Continuation Phase',
  adherencePercent: 94,
  dotsCenter: 'DHH Bhawanipatna DOTS Sub-Center',
  nextSputumTest: 'Due at Month 4 (12 Oct 2026)',
  status: 'On Track',
  treatmentMonthsCompleted: 3,
  totalMonths: 6
};
