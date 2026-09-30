export type Role = 'patient' | 'doctor' | 'pharmacy' | 'admin';

export type Language = 'English' | 'ଓଡ଼ିଆ' | 'हिन्दी';

export type NetworkQuality = 'good' | 'limited' | 'offline';

export type CareCategory = 'low' | 'intermediate' | 'emergency';

export interface DemoUser {
  name: string;
  email: string;
  mobile: string;
  role: Role;
  portalTitle: string;
  badge: string;
  avatar: string;
  location: string;
  patientId?: string; // e.g. RHB-OD-KLH-0941
  age?: number;
  gender?: string;
  bloodGroup?: string;
  abhaId?: string;
  allergies?: string;
  conditions?: string;
  emergencyContact?: string;
  block?: string;
}

export interface HealthFacility {
  id: string;
  name: string;
  type: 'District Hospital' | 'CHC' | 'PHC' | 'Private Facility' | 'Pharmacy' | 'Diagnostic Center';
  block: string;
  address: string;
  services: string[];
  isOpen: boolean;
  teleconsultAvailable: boolean;
  distanceKm: number;
  phone: string;
  referralStatus: 'Accepting Referrals' | 'Busy' | 'Emergency Only';
}

export interface ConsentItem {
  id: string;
  party: string;
  dataType: string;
  purpose: string;
  duration: string;
  status: 'Granted' | 'Revoked';
  expiresAt: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  followUpDate: string;
  followUpMode: 'Teleconsultation' | 'Physical PHC Review' | 'Specialist Referral';
  instructions: string;
  requiredTests: string[];
  referralFacility?: string;
  medicinePlan: string;
  warningSignsToWatch: string[];
  status: 'Active' | 'Due' | 'Missed' | 'Completed';
}

export interface NcdRecord {
  condition: 'Hypertension' | 'Diabetes' | 'Both';
  carePlan: string;
  lastReading: string;
  targetGoal: string;
  adherencePercent: number;
  nextFollowUp: string;
  status: 'Controlled' | 'Borderline' | 'Needs Review';
}

export interface TbTreatmentRecord {
  regimen: string;
  phase: 'Intensive Phase' | 'Continuation Phase';
  adherencePercent: number;
  dotsCenter: string;
  nextSputumTest: string;
  status: 'On Track' | 'Pending Review';
  treatmentMonthsCompleted: number;
  totalMonths: number;
}

export type WarningSignId = 'no' | 'breathing' | 'chest' | 'unconscious' | 'bleeding' | 'stroke';

export type UrgencyLevel = 'routine' | 'moderate' | 'urgent';

export interface PhysiologicalVitals {
  temperatureF?: number;
  pulseBpm?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  spO2Percent?: number;
  respRate?: number;
  weightKg?: number;
  enteredBy: 'Patient-entered / manually entered' | 'Connected Device';
  recordedAt: string;
}

export interface DiagnosticDocument {
  id: string;
  title: string;
  category: 'Lab Report' | 'X-Ray' | 'CT' | 'MRI' | 'Prescription' | 'Referral';
  date: string;
  provider: string;
  thumbnail?: string;
  notes?: string;
}

export interface PrescriptionMedicine {
  id: string;
  name: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface FullPrescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  doctorHospital: string;
  date: string;
  diagnosisSummary: string;
  medicines: PrescriptionMedicine[];
  followUp: string;
  notes?: string;
  digitalSignature: string;
}

export interface ConsultationToken {
  tokenNumber: string; // e.g. A-024
  queuePosition: number;
  estimatedWaitMin: number;
  status: 'Waiting' | 'Called' | 'Consultation' | 'Completed';
  doctorName: string;
  requestedSpecialty: string;
  joinedAt: string;
}

export interface SpecialistRequest {
  id: string;
  referringDoctor: string;
  requestedSpecialist: string;
  reason: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  status: 'Requested' | 'Accepted' | 'In Consultation' | 'Completed';
  patientId: string;
  patientName: string;
  timestamp: string;
}

export interface HealthRecord {
  id: string;
  patientId?: string;
  type: 'symptom' | 'prescription' | 'stock-update' | 'consultation' | 'lab';
  at: string;
  timestamp: number;
  symptoms?: string;
  duration?: string;
  warningSign?: string;
  pathway?: string;
  urgency?: UrgencyLevel;
  doctorName?: string;
  notes?: string;
  followUpPlan?: string;
  synced?: boolean;
  documents?: DiagnosticDocument[];
}

export interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  nextSlot: string;
  languages: string[];
  rating: number;
  available: boolean;
  experience: string;
  fees: string;
  avatarUrl?: string;
  estimatedWaitMin?: number;
}

export type KalahandiBlock =
  | 'All Blocks'
  | 'Bhawanipatna'
  | 'Junagarh'
  | 'Dharamgarh'
  | 'Kesinga'
  | 'Narla / Lanjigarh';

export interface MedicineItem {
  id: string;
  name: string;
  category: string;
  pharmacyName: string;
  block: KalahandiBlock;
  address: string;
  phone: string;
  status: 'AVAILABLE' | 'LIMITED STOCK' | 'OUT OF STOCK';
  quantity: number;
  unitPrice: string;
  distanceKm: number;
  lastUpdated: string;
  isEssential: boolean;
  isOpen: boolean;
}

export interface TriageQueueItem {
  id: string;
  patientId?: string;
  patientName: string;
  age: number;
  gender: string;
  village: string;
  symptoms: string;
  duration: string;
  warningSign: string;
  urgency: UrgencyLevel;
  aiSummary: string;
  timestamp: string;
  waitingTimeMin: number;
  status: 'pending' | 'reviewed' | 'escalated' | 'completed';
  doctorNotes?: string;
}

export interface AppointmentItem {
  id: string;
  time: string;
  patientName: string;
  type: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  channel: 'Video Consultation' | 'Low-Bandwidth Audio';
  date: string;
}

export interface PharmacyRequest {
  id: string;
  patientId?: string;
  patientName: string;
  village: string;
  medicines: string;
  status: 'Pending' | 'Confirmed Available' | 'Reserved';
  timestamp: string;
}

export interface ImpactMetrics {
  tripsAvoided: number;
  travelCostSavedRupees: number;
  appointmentsCompleted: number;
  pharmacyStockChecks: number;
  missedConsultationsReducedPercent: number;
  avgNavigationMinutes: number;
}

export interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'queue' | 'doctor' | 'prescription' | 'pharmacy' | 'system';
}

export interface AuditLogEntry {
  id: string;
  time: string;
  action: string;
  actor: string;
}

export interface CareJourneyStage {
  id: number;
  title: string;
  status: 'completed' | 'current' | 'pending';
  detail: string;
}
