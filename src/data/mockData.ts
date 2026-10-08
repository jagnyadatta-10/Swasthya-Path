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
  TbTreatmentRecord,
  DoctorLeave,
  PharmacyStoreStatus,
  SMSFallbackMessage,
  ManagedUser,
  EmergencyCase,
  LabTestItem,
  LabTestOrder,
  LabSample,
  SystemHealthItem
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
  },
  lab: {
    name: 'DHH Central Diagnostic & Pathology Center',
    email: 'lab@swasthyapath.demo',
    mobile: '+91 90000 10005',
    role: 'lab',
    portalTitle: 'Medical Diagnostic Dashboard',
    badge: 'District Health Diagnostic Unit • Kalahandi',
    avatar: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=150&q=80',
    location: 'District Headquarters Hospital (DHH) Pathology Wing, Bhawanipatna, Kalahandi'
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
    provider: 'DHH Bhawanipatna Central Pathology Lab',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    status: 'Verified',
    labName: 'DHH Bhawanipatna Central Pathology Lab',
    technicianName: 'Bipin Bihari Das, Sr. MLT',
    doctorInCharge: 'Dr. M. K. Rath (MD Pathology)',
    notes: 'Hemoglobin: 12.8 g/dL, Platelets: 2.1 Lakh, TLC: 7,400. Normal reference range. No abnormal blasts seen.',
    parameters: [
      { name: 'Hemoglobin (Hb)', result: '12.8', unit: 'g/dL', refRange: '12.0 - 16.5' },
      { name: 'Total Leukocyte Count (TLC)', result: '7,400', unit: '/cumm', refRange: '4,000 - 11,000' },
      { name: 'Platelet Count', result: '2.10', unit: 'Lakhs/cumm', refRange: '1.50 - 4.50' },
      { name: 'Neutrophils', result: '62', unit: '%', refRange: '40 - 75' },
      { name: 'Lymphocytes', result: '30', unit: '%', refRange: '20 - 45' },
      { name: 'ESR (Westergren)', result: '14', unit: 'mm/1st hr', refRange: '0 - 20' }
    ],
    syncedAbha: true
  },
  {
    id: 'doc-xray-02',
    title: 'Chest X-Ray PA View (Digital Scan)',
    category: 'X-Ray',
    date: '15/07/2026',
    provider: 'District Mobile Radiology Van',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    status: 'Verified',
    labName: 'District Mobile Radiology Unit',
    technicianName: 'Sanjay Kumar Sahoo, Rad Tech',
    doctorInCharge: 'Dr. P. C. Mohapatra (Radiologist)',
    notes: 'Bilateral lung fields clear. Costophrenic angles normal. Normal cardiothoracic ratio.'
  },
  {
    id: 'doc-ref-03',
    title: 'ASHA Immunization & Vitals Referral Card',
    category: 'Referral',
    date: '20/05/2026',
    provider: 'Kalahandi Sub-Center Clinic',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    status: 'Verified',
    labName: 'Sub-Center Health Wellness Clinic',
    technicianName: 'Savitri Majhi (ASHA / ANM)',
    notes: 'Routine health screening and baseline vitals validated.'
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
    specialty: 'General Medicine & Tele-Triage',
    hospital: 'District Headquarters Hospital (DHH) Bhawanipatna',
    facility: 'District Headquarters Hospital (DHH) Bhawanipatna',
    nextSlot: 'Today • Available Now',
    languages: ['English', 'ଓଡ଼ିଆ (Odia)', 'हिन्दी (Hindi)'],
    rating: 4.9,
    available: true,
    status: 'Available',
    nextAvailable: 'Available Now',
    emergencyDuty: true,
    experience: '9 yrs exp • MBBS, MD (General Medicine)',
    fees: 'Free (Govt Telehealth Service)',
    estimatedWaitMin: 6,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-02',
    name: 'Dr. S. K. Patnaik',
    specialty: 'Paediatrics (Child Doctor)',
    hospital: 'DHH Bhawanipatna Mother & Child Wing',
    facility: 'DHH Bhawanipatna Mother & Child Wing',
    nextSlot: 'Today • 11:15 AM',
    languages: ['ଓଡ଼ିଆ (Odia)', 'English'],
    rating: 4.8,
    available: true,
    status: 'Available',
    nextAvailable: '11:15 AM',
    emergencyDuty: false,
    experience: '11 yrs exp • MBBS, MD (Pediatrics)',
    fees: 'Free (Govt Telehealth Service)',
    estimatedWaitMin: 14,
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-03',
    name: 'Dr. Meenakshi Sahu',
    specialty: "Obstetrics & Gynaecology (Women's Health)",
    hospital: 'Community Health Centre (CHC) Junagarh',
    facility: 'Community Health Centre (CHC) Junagarh',
    nextSlot: 'Today • 12:00 PM',
    languages: ['ଓଡ଼ିଆ (Odia)', 'हिन्दी (Hindi)', 'English'],
    rating: 4.9,
    available: true,
    status: 'Available',
    nextAvailable: '12:00 PM',
    emergencyDuty: true,
    experience: '12 yrs exp • MBBS, MS (OBG)',
    fees: 'Free (Govt Telehealth Service)',
    estimatedWaitMin: 18,
    avatarUrl: 'https://images.unsplash.com/photo-1594824813620-4e38e5e8e89f?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-04',
    name: 'Dr. B. K. Jena',
    specialty: 'Dermatology & Skin Care',
    hospital: 'CHC Kesinga Telehealth Sub-Unit',
    facility: 'CHC Kesinga Telehealth Sub-Unit',
    nextSlot: 'Today • 02:30 PM',
    languages: ['ଓଡ଼ିଆ (Odia)', 'English'],
    rating: 4.6,
    available: true,
    status: 'Available',
    nextAvailable: '02:30 PM',
    emergencyDuty: false,
    experience: '8 yrs exp • MBBS, DVD (Dermatology)',
    fees: 'Free (Govt Telehealth Service)',
    estimatedWaitMin: 25,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-05',
    name: 'Dr. Subhashree Dash',
    specialty: 'Psychiatry & Mental Well-being',
    hospital: 'District Mental Health Clinic, DHH Bhawanipatna',
    facility: 'District Mental Health Clinic, DHH Bhawanipatna',
    nextSlot: 'Tomorrow • 10:00 AM',
    languages: ['ଓଡ଼ିଆ (Odia)', 'हिन्दी (Hindi)', 'English'],
    rating: 4.8,
    available: true,
    status: 'Available',
    nextAvailable: 'Tomorrow • 10:00 AM',
    emergencyDuty: false,
    experience: '7 yrs exp • MBBS, MD (Psychiatry)',
    fees: 'Free (Govt Telehealth Service)',
    estimatedWaitMin: 30,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'doc-06',
    name: 'Dr. Ramesh Chandra Hota',
    specialty: 'Internal Medicine (On Leave)',
    hospital: 'Sub-Divisional Hospital (SDH) Dharamgarh',
    facility: 'Sub-Divisional Hospital (SDH) Dharamgarh',
    nextSlot: 'Unavailable • On Scheduled Leave',
    languages: ['ଓଡ଼ିଆ (Odia)', 'English'],
    rating: 4.7,
    available: false,
    status: 'On Leave',
    nextAvailable: '12/10/2026',
    emergencyDuty: false,
    experience: '14 yrs exp • MBBS, MD (Medicine)',
    fees: 'Free (Govt Telehealth Service)',
    estimatedWaitMin: 0
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

export const INITIAL_DOCTOR_LEAVES: DoctorLeave[] = [
  {
    id: 'leave-01',
    doctorId: 'doc-06',
    doctorName: 'Dr. Ramesh Chandra Hota',
    startDate: '08/10/2026',
    endDate: '12/10/2026',
    reason: 'State Health Mission Training & District Deputation',
    replacementDoctorId: 'doc-01',
    replacementDoctorName: 'Dr. Ananya Mishra (Covering general telehealth emergencies)',
    status: 'Active',
    createdAt: '06/10/2026'
  }
];

export const INITIAL_PHARMACY_STATUS: PharmacyStoreStatus = {
  isOpen: true,
  isHoliday: false,
  isEmergencyClosure: false,
  operatingHours: '08:00 AM – 09:30 PM (Daily)',
  holidayNotice: '',
  lastUpdated: 'Today • 08:00 AM'
};

export const INITIAL_SMS_LOGS: SMSFallbackMessage[] = [
  {
    id: 'sms-01',
    recipientMobile: '+91 90000 10001',
    type: 'doctor_availability',
    body: 'SWASTHYA PATH DOCTOR AVAILABILITY: Dr. Ananya Mishra (General Medicine, DHH Bhawanipatna). Status: Available Now. Next Slot: 10:30 AM.',
    sentAt: 'Today, 09:15 AM',
    isSimulated: true
  },
  {
    id: 'sms-02',
    recipientMobile: '+91 90000 10001',
    type: 'pharmacy_stock',
    body: 'SWASTHYA PATH PHARMACY STOCK: Tab Paracetamol 500mg at Maa Laxmi Pharmacy, Bhawanipatna is AVAILABLE (240 units, Rs 18). Verified 15 mins ago.',
    sentAt: 'Today, 09:20 AM',
    isSimulated: true
  },
  {
    id: 'sms-03',
    recipientMobile: '+91 90000 10001',
    type: 'holiday_leave',
    body: 'SWASTHYA PATH DOCTOR NOTICE: Dr. Ramesh Chandra Hota is on Scheduled Leave till 12 Oct. Alternate Clinician: Dr. Ananya Mishra is available.',
    sentAt: 'Today, 09:25 AM',
    isSimulated: true
  }
];

export const INITIAL_LAB_TESTS: LabTestItem[] = [
  {
    id: 'test-cbc',
    name: 'Complete Blood Count (CBC) Panel with Automated Differential',
    category: 'Hematology',
    description: 'Comprehensive evaluation of RBC, WBC, Platelets, and Hemoglobin for anemia, sepsis, or leukemia detection.',
    sampleType: 'Whole Blood (EDTA Vacutainer)',
    preparation: 'No fasting required. Avoid strenuous exercise prior to collection.',
    turnaroundTime: '2 hours',
    turnaroundHours: 2,
    priceRupees: 0,
    isAvailable: true,
    referenceRanges: [
      { parameter: 'Hemoglobin (Hb)', range: '12.0 - 16.5', unit: 'g/dL' },
      { parameter: 'Total Leukocyte Count (TLC)', range: '4,000 - 11,000', unit: '/cumm' },
      { parameter: 'Platelet Count', range: '1.50 - 4.50', unit: 'Lakhs/cumm' },
      { parameter: 'Neutrophils', range: '40 - 75', unit: '%' },
      { parameter: 'Lymphocytes', range: '20 - 45', unit: '%' },
      { parameter: 'Eosinophils', range: '01 - 06', unit: '%' },
      { parameter: 'ESR (Westergren)', range: '0 - 20', unit: 'mm/1st hr' }
    ]
  },
  {
    id: 'test-truenat',
    name: 'Sputum TrueNat MTB / Acid Fast Bacilli (AFB) Molecular Assay',
    category: 'Microbiology',
    description: 'Chip-based automated micro-PCR for detection of Mycobacterium tuberculosis and Rifampicin resistance.',
    sampleType: 'Early Morning Sputum (Sterile Container)',
    preparation: 'Deep cough early morning sample prior to mouthwash or breakfast.',
    turnaroundTime: '4 hours',
    turnaroundHours: 4,
    priceRupees: 0,
    isAvailable: true,
    referenceRanges: [
      { parameter: 'Acid Fast Bacilli (ZN Smear)', range: 'Negative (0 AFB/100 fields)', unit: '' },
      { parameter: 'TrueNat MTB DNA', range: 'Not Detected', unit: '' },
      { parameter: 'Rifampicin Resistance Gene (rpoB)', range: 'Not Detected', unit: '' }
    ]
  },
  {
    id: 'test-malaria',
    name: 'Peripheral Blood Smear Examination for Malaria Parasite (MP / QBC)',
    category: 'Hematology',
    description: 'Direct microscopic smear and rapid antigen testing for Plasmodium falciparum and vivax.',
    sampleType: 'Capillary / Venous Blood',
    preparation: 'No prior preparation required. Preferred during febrile spikes.',
    turnaroundTime: '1 hour',
    turnaroundHours: 1,
    priceRupees: 0,
    isAvailable: true,
    referenceRanges: [
      { parameter: 'Plasmodium falciparum (Antigen)', range: 'Negative', unit: '' },
      { parameter: 'Plasmodium vivax (Antigen)', range: 'Negative', unit: '' },
      { parameter: 'Smear Examination for MP', range: 'Not Detected', unit: '' },
      { parameter: 'Parasite Density Index', range: '0', unit: 'parasites/µL' }
    ]
  },
  {
    id: 'test-glucose',
    name: 'Blood Glucose Evaluation Panel (Fasting & Post-Prandial)',
    category: 'Biochemistry',
    description: 'Plasma glucose quantitation for diabetes screening and glycemic monitoring in rural clinics.',
    sampleType: 'Fluoride Plasma / Serum',
    preparation: '8 to 10 hours overnight fasting for Fasting sample; 2 hours after meal for PP.',
    turnaroundTime: '2 hours',
    turnaroundHours: 2,
    priceRupees: 25,
    isAvailable: true,
    referenceRanges: [
      { parameter: 'Fasting Blood Glucose', range: '70 - 100', unit: 'mg/dL' },
      { parameter: 'Post-Prandial Glucose (PPBS)', range: '< 140', unit: 'mg/dL' },
      { parameter: 'Random Blood Glucose (RBS)', range: '70 - 140', unit: 'mg/dL' }
    ]
  },
  {
    id: 'test-lft',
    name: 'Liver Function Test (LFT) Comprehensive Panel',
    category: 'Biochemistry',
    description: 'Enzyme and protein markers assessing hepatic clearance and hepatocellular integrity.',
    sampleType: 'Serum (Clot Activator)',
    preparation: '4 hours minimum fasting. Avoid alcohol and hepatotoxic drugs.',
    turnaroundTime: '6 hours',
    turnaroundHours: 6,
    priceRupees: 180,
    isAvailable: true,
    referenceRanges: [
      { parameter: 'Total Bilirubin', range: '0.2 - 1.2', unit: 'mg/dL' },
      { parameter: 'Direct Bilirubin', range: '0.0 - 0.3', unit: 'mg/dL' },
      { parameter: 'SGOT / AST', range: '10 - 40', unit: 'U/L' },
      { parameter: 'SGPT / ALT', range: '07 - 56', unit: 'U/L' },
      { parameter: 'Alkaline Phosphatase (ALP)', range: '44 - 147', unit: 'U/L' },
      { parameter: 'Total Protein', range: '6.0 - 8.3', unit: 'g/dL' },
      { parameter: 'Serum Albumin', range: '3.5 - 5.0', unit: 'g/dL' }
    ]
  },
  {
    id: 'test-kft',
    name: 'Kidney Function Test (KFT / RFT) Renal Profile',
    category: 'Biochemistry',
    description: 'Glomerular filtration and renal clearance assessment including urea and creatinine.',
    sampleType: 'Serum',
    preparation: 'Maintain normal hydration. Avoid heavy meat intake 24h prior.',
    turnaroundTime: '4 hours',
    turnaroundHours: 4,
    priceRupees: 140,
    isAvailable: true,
    referenceRanges: [
      { parameter: 'Serum Urea', range: '15 - 45', unit: 'mg/dL' },
      { parameter: 'Serum Creatinine', range: '0.6 - 1.2', unit: 'mg/dL' },
      { parameter: 'Blood Urea Nitrogen (BUN)', range: '07 - 20', unit: 'mg/dL' },
      { parameter: 'Serum Uric Acid', range: '3.5 - 7.2', unit: 'mg/dL' }
    ]
  },
  {
    id: 'test-urm',
    name: 'Urine Routine & Microscopic Examination (U/R/M)',
    category: 'Pathology',
    description: 'Physical, chemical, and microscopic examination of urine for renal, metabolic, and urinary tract disorders.',
    sampleType: 'Clean Catch Midstream Urine',
    preparation: 'First morning urine preferred in sterile container after perineal cleansing.',
    turnaroundTime: '1 hour',
    turnaroundHours: 1,
    priceRupees: 35,
    isAvailable: true,
    referenceRanges: [
      { parameter: 'Color / Appearance', range: 'Pale Yellow / Clear', unit: '' },
      { parameter: 'Specific Gravity', range: '1.005 - 1.030', unit: '' },
      { parameter: 'pH', range: '4.6 - 8.0', unit: '' },
      { parameter: 'Protein (Albumin)', range: 'Nil', unit: '' },
      { parameter: 'Sugar (Glucose)', range: 'Nil', unit: '' },
      { parameter: 'Pus Cells', range: '0 - 4', unit: '/HPF' },
      { parameter: 'RBCs', range: 'Nil', unit: '/HPF' }
    ]
  }
];

export const INITIAL_LAB_ORDERS: LabTestOrder[] = [
  {
    id: 'ord-01',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    patientAge: 26,
    patientGender: 'Male',
    patientVillage: 'Karlamunda Block, Kalahandi',
    doctorId: 'doc-01',
    doctorName: 'Dr. Ananya Mishra',
    testId: 'test-cbc',
    testName: 'Complete Blood Count (CBC) Panel',
    category: 'Hematology',
    orderDate: 'Today, 09:30 AM',
    status: 'Released',
    sampleId: 'smp-01',
    collectionTimestamp: 'Today, 09:45 AM',
    receivedTimestamp: 'Today, 10:00 AM',
    reportId: 'doc-lab-cbc-01',
    urgency: 'Routine',
    notes: 'Rule out infection and evaluate persistent mild fatigue.'
  },
  {
    id: 'ord-02',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    patientAge: 26,
    patientGender: 'Male',
    patientVillage: 'Karlamunda Block, Kalahandi',
    doctorId: 'doc-01',
    doctorName: 'Dr. Ananya Mishra',
    testId: 'test-malaria',
    testName: 'Peripheral Blood Smear for Malaria',
    category: 'Hematology',
    orderDate: 'Today, 10:00 AM',
    status: 'Report Verified',
    sampleId: 'smp-02',
    collectionTimestamp: 'Today, 10:15 AM',
    receivedTimestamp: 'Today, 10:30 AM',
    reportId: 'doc-lab-mal-01',
    urgency: 'Urgent',
    notes: 'Patient resides in endemic block. Reported evening chills.'
  },
  {
    id: 'ord-03',
    patientId: 'RHB-OD-KLH-0412',
    patientName: 'Saraswati Naik',
    patientAge: 44,
    patientGender: 'Female',
    patientVillage: 'Junagarh, Kalahandi',
    doctorId: 'doc-02',
    doctorName: 'Dr. Ramesh Chandra Hota',
    testId: 'test-truenat',
    testName: 'Sputum TrueNat MTB / Acid Fast Bacilli',
    category: 'Microbiology',
    orderDate: 'Yesterday, 04:15 PM',
    status: 'Processing',
    sampleId: 'smp-03',
    collectionTimestamp: 'Today, 08:00 AM',
    receivedTimestamp: 'Today, 08:45 AM',
    urgency: 'Routine',
    notes: 'Chronic cough > 3 weeks. Follow up sputum testing.'
  },
  {
    id: 'ord-04',
    patientId: 'RHB-OD-KLH-1102',
    patientName: 'Mohan Majhi',
    patientAge: 58,
    patientGender: 'Male',
    patientVillage: 'Dharamgarh, Kalahandi',
    doctorId: 'doc-03',
    doctorName: 'Dr. S. K. Patnaik',
    testId: 'test-glucose',
    testName: 'Blood Glucose Evaluation Panel',
    category: 'Biochemistry',
    orderDate: 'Today, 08:30 AM',
    status: 'Sample Received',
    sampleId: 'smp-04',
    collectionTimestamp: 'Today, 09:00 AM',
    receivedTimestamp: 'Today, 09:30 AM',
    urgency: 'Routine',
    notes: 'Routine NCD diabetes monitoring.'
  },
  {
    id: 'ord-05',
    patientId: 'RHB-OD-KLH-0881',
    patientName: 'Parvati Gouda',
    patientAge: 32,
    patientGender: 'Female',
    patientVillage: 'Narla, Kalahandi',
    doctorId: 'doc-01',
    doctorName: 'Dr. Ananya Mishra',
    testId: 'test-urm',
    testName: 'Urine Routine & Microscopic Examination',
    category: 'Pathology',
    orderDate: 'Today, 11:00 AM',
    status: 'Accepted',
    urgency: 'Routine',
    notes: 'Dysuria and lower abdominal discomfort.'
  }
];

export const INITIAL_LAB_SAMPLES: LabSample[] = [
  {
    id: 'smp-01',
    sampleBarcode: 'SMP-KLH-2026-0941-CBC',
    orderId: 'ord-01',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    testName: 'Complete Blood Count (CBC)',
    sampleType: 'Whole Blood (EDTA)',
    status: 'Completed',
    collectedAt: 'Today, 09:45 AM',
    receivedAt: 'Today, 10:00 AM'
  },
  {
    id: 'smp-02',
    sampleBarcode: 'SMP-KLH-2026-0941-MAL',
    orderId: 'ord-02',
    patientId: 'RHB-OD-KLH-0941',
    patientName: 'Keshab Rout',
    testName: 'Malaria Antigen & Smear',
    sampleType: 'Whole Blood (EDTA)',
    status: 'Completed',
    collectedAt: 'Today, 10:15 AM',
    receivedAt: 'Today, 10:30 AM'
  },
  {
    id: 'smp-03',
    sampleBarcode: 'SMP-KLH-2026-0412-TB',
    orderId: 'ord-03',
    patientId: 'RHB-OD-KLH-0412',
    patientName: 'Saraswati Naik',
    testName: 'TrueNat Sputum MTB',
    sampleType: 'Sputum',
    status: 'Processing',
    collectedAt: 'Today, 08:00 AM',
    receivedAt: 'Today, 08:45 AM'
  },
  {
    id: 'smp-04',
    sampleBarcode: 'SMP-KLH-2026-1102-GLU',
    orderId: 'ord-04',
    patientId: 'RHB-OD-KLH-1102',
    patientName: 'Mohan Majhi',
    testName: 'Blood Glucose Panel',
    sampleType: 'Fluoride Plasma',
    status: 'Received',
    collectedAt: 'Today, 09:00 AM',
    receivedAt: 'Today, 09:30 AM'
  }
];

export const INITIAL_MANAGED_USERS: ManagedUser[] = [
  {
    id: 'usr-pat-01',
    name: 'Keshab Rout',
    role: 'patient',
    email: 'patient@swasthyapath.demo',
    mobile: '+91 90000 10001',
    location: 'Karlamunda Block, Kalahandi, Odisha',
    verificationStatus: 'VERIFIED',
    accountStatus: 'Active',
    registeredAt: '2026-01-14',
    lastActive: 'Just now',
    facilityName: 'DHH Bhawanipatna Tele-Clinic'
  },
  {
    id: 'usr-pat-02',
    name: 'Saraswati Naik',
    role: 'patient',
    email: 'saraswati.naik@ruralhealth.od',
    mobile: '+91 94371 90212',
    location: 'Junagarh, Kalahandi, Odisha',
    verificationStatus: 'VERIFIED',
    accountStatus: 'Active',
    registeredAt: '2026-02-03',
    lastActive: 'Yesterday',
    facilityName: 'CHC Junagarh'
  },
  {
    id: 'usr-doc-01',
    name: 'Dr. Ananya Mishra',
    role: 'doctor',
    email: 'doctor@swasthyapath.demo',
    mobile: '+91 90000 10002',
    location: 'District Headquarters Hospital (DHH) Bhawanipatna',
    verificationStatus: 'VERIFIED',
    accountStatus: 'Active',
    specialization: 'General Medicine & Tele-Triage',
    licenseNumber: 'OSMC/2019/8472',
    documentsSubmitted: ['Medical Council Registration (OSMC)', 'MBBS Degree Certificate', 'Aadhaar / ABHA ID'],
    registeredAt: '2025-11-10',
    lastActive: 'Active on Duty',
    facilityName: 'DHH Bhawanipatna'
  },
  {
    id: 'usr-doc-02',
    name: 'Dr. Ramesh Chandra Hota',
    role: 'doctor',
    email: 'ramesh.hota@dhhkalahandi.gov.in',
    mobile: '+91 94370 11200',
    location: 'Community Health Centre (CHC) Junagarh',
    verificationStatus: 'VERIFIED',
    accountStatus: 'Active',
    specialization: 'Pediatrics & Maternal Health',
    licenseNumber: 'OSMC/2014/3190',
    documentsSubmitted: ['OSMC Specialist Registration', 'MD Pediatrics Degree'],
    registeredAt: '2025-12-01',
    lastActive: 'On Scheduled Leave',
    facilityName: 'CHC Junagarh'
  },
  {
    id: 'usr-doc-03',
    name: 'Dr. Subhashree Senapati',
    role: 'doctor',
    email: 'subhashree.senapati@kalahandi.med',
    mobile: '+91 94388 44021',
    location: 'Sub-Divisional Hospital (SDH) Dharamgarh',
    verificationStatus: 'VERIFICATION PENDING',
    accountStatus: 'Pending',
    specialization: 'Obstetrics & Gynecology',
    licenseNumber: 'OSMC/2021/9921',
    documentsSubmitted: ['OSMC Registration Slip', 'PG Diploma Obstetrics'],
    registeredAt: '2026-10-02',
    lastActive: 'Awaiting Document Review',
    facilityName: 'SDH Dharamgarh'
  },
  {
    id: 'usr-pharma-01',
    name: 'Maa Laxmi Pharmacy',
    role: 'pharmacy',
    email: 'pharmacy@swasthyapath.demo',
    mobile: '+91 90000 10003',
    location: 'Near Town Hall & DHH Main Gate, Bhawanipatna',
    verificationStatus: 'VERIFIED',
    accountStatus: 'Active',
    licenseNumber: 'KLH-2024-8192-RET',
    documentsSubmitted: ['Retail Drug License Form 20B/21B', 'Registered Pharmacist Regn OSMC'],
    registeredAt: '2025-10-18',
    lastActive: 'Broadcasting Live Inventory',
    facilityName: 'Jan Aushadhi Partner Network'
  },
  {
    id: 'usr-pharma-02',
    name: 'Pradhan Mantri Jan Aushadhi Kendra Junagarh',
    role: 'pharmacy',
    email: 'janaushadhi.junagarh@pmsbi.org',
    mobile: '+91 98610 88291',
    location: 'Hospital Road, Junagarh, Kalahandi',
    verificationStatus: 'VERIFICATION PENDING',
    accountStatus: 'Pending',
    licenseNumber: 'PMBJP-OD-KLH-11',
    documentsSubmitted: ['PMBJP Allotment Letter', 'State Drug Control Authority License'],
    registeredAt: '2026-10-04',
    lastActive: 'Awaiting Verification',
    facilityName: 'PMBJP Network'
  },
  {
    id: 'usr-lab-01',
    name: 'DHH Central Diagnostic & Pathology Center',
    role: 'lab',
    email: 'lab@swasthyapath.demo',
    mobile: '+91 90000 10005',
    location: 'DHH Pathology Wing, Bhawanipatna, Kalahandi',
    verificationStatus: 'VERIFIED',
    accountStatus: 'Active',
    licenseNumber: 'NABL-MC-2024-41',
    documentsSubmitted: ['NABL Accreditation Certificate ISO 15189', 'NABH Facility Compliance', 'ABDM M3 Milestone Proof'],
    registeredAt: '2025-09-01',
    lastActive: 'Online & Processing Samples',
    facilityName: 'District Headquarters Hospital (DHH)'
  },
  {
    id: 'usr-lab-02',
    name: 'Junagarh CHC Clinical Laboratory',
    role: 'lab',
    email: 'lab.junagarh@health.kalahandi.gov.in',
    mobile: '+91 94372 66019',
    location: 'CHC Junagarh Diagnostic Wing, Kalahandi',
    verificationStatus: 'VERIFICATION PENDING',
    accountStatus: 'Pending',
    licenseNumber: 'DHS-LAB-2023-09',
    documentsSubmitted: ['District Health Society Clinical Establishment Registration'],
    registeredAt: '2026-09-28',
    lastActive: 'Awaiting Document Review',
    facilityName: 'CHC Junagarh'
  },
  {
    id: 'usr-admin-01',
    name: 'Kalahandi Health Administrator',
    role: 'admin',
    email: 'admin@swasthyapath.demo',
    mobile: '+91 90000 10004',
    location: 'CDMO Complex, Bhawanipatna, Kalahandi',
    verificationStatus: 'VERIFIED',
    accountStatus: 'Active',
    registeredAt: '2025-08-01',
    lastActive: 'Active Session',
    facilityName: 'CDMO Directorate Kalahandi'
  }
];

export const INITIAL_EMERGENCY_CASES: EmergencyCase[] = [
  {
    id: 'emg-01',
    patientId: 'RHB-OD-KLH-1802',
    patientName: 'Bimal Majhi',
    age: 52,
    gender: 'Male',
    village: 'Karlamunda Block',
    warningSigns: 'Severe chest tightness radiating to left shoulder with cold diaphoresis',
    symptoms: 'Acute crushing retrosternal chest pain (1.5 hours duration)',
    status: 'IN_PROGRESS',
    assignedDoctor: 'Dr. Ananya Mishra',
    assignedFacility: 'DHH Bhawanipatna Emergency Trauma Care',
    escalatedAt: 'Today, 09:12 AM',
    priority: 'CRITICAL',
    notes: 'Awaiting ECG arrival via telemedicine node. CHC 108 ambulance dispatched.'
  },
  {
    id: 'emg-02',
    patientId: 'RHB-OD-KLH-2109',
    patientName: 'Rupa Sabar',
    age: 28,
    gender: 'Female',
    village: 'Thuamul Rampur (Remote Ghat Section)',
    warningSigns: 'High spiking fever (104.2 F) with severe drowsiness and neck stiffness',
    symptoms: 'High fever, projectile vomiting, impaired consciousness (2 days)',
    status: 'ASSIGNED',
    assignedDoctor: 'Dr. Ramesh Chandra Hota',
    assignedFacility: 'CHC Thuamul Rampur Stabilization Unit',
    escalatedAt: 'Today, 08:45 AM',
    priority: 'HIGH',
    notes: 'Suspected cerebral malaria or acute meningitis. Stabilizing IV access.'
  },
  {
    id: 'emg-03',
    patientId: 'RHB-OD-KLH-3044',
    patientName: 'Dhanu Bag',
    age: 64,
    gender: 'Male',
    village: 'Kesinga Block',
    warningSigns: 'Acute respiratory distress with peripheral cyanosis (SpO2 86% on room air)',
    symptoms: 'Progressive severe breathlessness, wheezing, orthopnea',
    status: 'ESCALATED',
    assignedDoctor: 'Dr. Ananya Mishra',
    assignedFacility: 'DHH Bhawanipatna High Dependency Unit (HDU)',
    escalatedAt: 'Today, 07:30 AM',
    priority: 'CRITICAL',
    notes: 'Exacerbation of COPD/Cardiac asthma. Oxygen concentrator deployed.'
  }
];

export const INITIAL_SYSTEM_HEALTH: SystemHealthItem[] = [
  {
    service: 'Core Platform Backend API Gateway',
    category: 'Infrastructure',
    status: 'Healthy',
    latencyMs: 14,
    lastChecked: 'Just now',
    notes: 'Edge routing active. Zero dropped connections across Kalahandi district.'
  },
  {
    service: 'Local Longitudinal Health Database (IndexedDB)',
    category: 'Data Storage',
    status: 'Healthy',
    latencyMs: 4,
    lastChecked: 'Just now',
    notes: 'Local client-side caching synchronized. Cryptographic record versioning active.'
  },
  {
    service: 'Role-Based Authentication & Session Guard',
    category: 'Security',
    status: 'Healthy',
    latencyMs: 9,
    lastChecked: 'Just now',
    notes: '5-role access boundary enforced. Zero unauthorized privilege escalations.'
  },
  {
    service: 'SMS Fallback & OTP Dispatch Gateway',
    category: 'Connectivity',
    status: 'Simulated',
    latencyMs: 120,
    lastChecked: 'Just now',
    notes: 'Running on simulated telecom modem. Production SMS provider (CDAC / NIC SMS) requires live SMPP credentials.'
  },
  {
    service: 'Real-Time Tele-Triage Broadcast Service',
    category: 'Notifications',
    status: 'Healthy',
    latencyMs: 18,
    lastChecked: 'Just now',
    notes: 'Low-latency in-app message bus operational across doctor & pharmacy queues.'
  },
  {
    service: 'Clinical Red-Flag & AI Intake Assistant',
    category: 'AI Services',
    status: 'Healthy',
    latencyMs: 45,
    lastChecked: 'Just now',
    notes: 'Safety-gated heuristic red flag detection active. All recommendations require doctor validation.'
  },
  {
    service: 'WebRTC Low-Bandwidth Teleconsultation Room',
    category: 'Telemedicine',
    status: 'Simulated',
    latencyMs: 60,
    lastChecked: 'Just now',
    notes: 'Local video and Odia/Hindi AI audio translation simulated. TURN/STUN relay server configured.'
  },
  {
    service: 'Jan Aushadhi Pharmacy Inventory Sync Engine',
    category: 'Pharmacy',
    status: 'Healthy',
    latencyMs: 22,
    lastChecked: 'Just now',
    notes: 'Real-time stock change broadcasting active with low-bandwidth 2G delta compression.'
  },
  {
    service: 'Pathology Registry & ABHA Milestone 3 Sync',
    category: 'Diagnostic Lab',
    status: 'Healthy',
    latencyMs: 31,
    lastChecked: 'Just now',
    notes: 'Verified bidirectional sync with longitudinal health records and doctor consultation cards.'
  }
];

