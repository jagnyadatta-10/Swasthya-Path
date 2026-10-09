export type Role = 'patient' | 'doctor' | 'pharmacy' | 'admin' | 'lab' | 'administrator' | 'pathology';

export type Language = 'English' | 'ଓଡ଼ିଆ' | 'हिन्दी';

export type NetworkQuality = 'good' | 'limited' | 'offline';

export type CareCategory = 'low' | 'intermediate' | 'emergency';

export interface DemoUser {
  name: string;
  email: string;
  mobile: string;
  role: Role;
  portalTitle?: string;
  badge?: string;
  avatar?: string;
  location: string;
  healthFacility?: string;
  patientId?: string; // e.g. RHB-OD-KLH-0941
  age?: number;
  gender?: string;
  bloodGroup?: string;
  abhaId?: string;
  allergies?: string;
  conditions?: string;
  emergencyContact?: string;
  block?: string;
  registrationNumber?: string;
  specialty?: string;
  qualification?: string;
  designation?: string;
  password?: string;
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

export type UrgencyLevel = 'routine' | 'moderate' | 'urgent' | 'emergency';

export interface PhysiologicalVitals {
  temperatureF?: number;
  pulseBpm?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  spO2Percent?: number;
  respRate?: number;
  weightKg?: number;
  enteredBy: 'Patient-entered / manually entered' | 'Connected Device' | string;
  recordedAt: string;
}

export interface DiagnosticTestParameter {
  name: string;
  result: string;
  unit?: string;
  refRange: string;
  isAbnormal?: boolean;
  status?: 'Normal' | 'High' | 'Low' | string;
}

export interface DiagnosticDocument {
  id: string;
  title: string;
  category: 'Lab Report' | 'X-Ray' | 'CT' | 'MRI' | 'Prescription' | 'Referral';
  testCategory?: string;
  doctorName?: string;
  findings?: string;
  date: string;
  provider: string;
  thumbnail?: string;
  notes?: string;
  patientId?: string;
  patientName?: string;
  status?: 'Ready' | 'Verified' | 'Pending Review' | 'Critical Flag';
  verificationStatus?: 'Draft' | 'Under Review' | 'Verified' | 'Released' | 'Corrected' | 'Cancelled';
  version?: number;
  previousVersionData?: {
    notes?: string;
    parameters?: DiagnosticTestParameter[];
    correctedAt?: string;
  };
  correctionReason?: string;
  authorizedVerifier?: string;
  releasedAt?: string;
  fileUrl?: string;
  sampleType?: string;
  sampleBarcode?: string;
  orderId?: string;
  labName?: string;
  technicianName?: string;
  doctorInCharge?: string;
  criticalAlert?: boolean;
  parameters?: DiagnosticTestParameter[];
  syncedAbha?: boolean;
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
  doctorId?: string;
  doctorName: string;
  doctorHospital: string;
  date: string;
  diagnosisSummary: string;
  medicines: PrescriptionMedicine[];
  followUp: string;
  notes?: string;
  digitalSignature: string;
  status?: 'draft' | 'finalized';
  syncStatus?: 'synced' | 'pending' | 'offline-cached';
  updatedAt?: string;
  version?: number;
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

export interface DoctorLeave {
  id: string;
  doctorId: string;
  doctorName: string;
  startDate: string;
  endDate: string;
  reason: string;
  replacementDoctor?: string;
  replacementDoctorId?: string;
  replacementDoctorName?: string;
  status: 'Active' | 'Scheduled' | 'Completed';
  createdAt: string;
}

export interface AudioTranslationMessage {
  id: string;
  sender: 'patient' | 'doctor';
  originalText: string;
  sourceLang: Language;
  translatedText: string;
  targetLang: Language;
  timestamp: string;
  medicalTermsPreserved?: string[];
}

export interface PharmacyStoreStatus {
  pharmacyName?: string;
  ownerContact?: string;
  status?: string;
  isOpen: boolean;
  isHoliday: boolean;
  isEmergencyClosure: boolean;
  operatingHours: string;
  holidayNotice?: string;
  lastUpdated: string;
}

export interface SMSFallbackMessage {
  id: string;
  toPhone?: string;
  recipientMobile?: string;
  category?: string;
  type?: 'doctor_availability' | 'pharmacy_stock' | 'holiday_leave' | 'emergency';
  body?: string;
  content?: string;
  sentAt?: string;
  timestamp?: string;
  deliveryStatus?: string;
  isSimulated?: boolean;
}

export interface PatientRegistrationData {
  mobile: string;
  name: string;
  age: number;
  gender: string;
  preferredLanguage: Language;
  location: string;
  emergencyContact: string;
  consentGranted: boolean;
  mayIssueNoticeConfirmed: boolean;
}

export interface DoctorRegistrationData {
  mobile: string;
  name: string;
  qualification: string;
  licenseNumber: string;
  specialty: string;
  hospital: string;
  workingHours: string;
  languages: string[];
  emergencyAvailable: boolean;
  leaveSchedule?: string;
  consentGranted: boolean;
}

export interface PharmacyRegistrationData {
  mobile: string;
  pharmacyName: string;
  ownerContact: string;
  address: string;
  block: KalahandiBlock;
  operatingHours: string;
  holidaySchedule: string;
  initialStockSetup: boolean;
  consentGranted: boolean;
}

export interface HealthRecord {
  id: string;
  patientId?: string;
  doctorId?: string;
  type: 'symptom' | 'prescription' | 'stock-update' | 'consultation' | 'lab' | 'diagnostic';
  at: string;
  timestamp: number;
  updatedAt?: string;
  version?: number;
  syncStatus?: 'synced' | 'pending' | 'offline-cached';
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
  prescriptionData?: FullPrescription;
}

export interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  facility?: string;
  nextSlot: string;
  languages: string[];
  rating: number;
  available: boolean;
  status?: string;
  nextAvailable?: string;
  emergencyDuty?: boolean;
  experience: string;
  fees: string;
  avatarUrl?: string;
  feedUrl?: string;
  gender?: 'male' | 'female';
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
  genericName?: string;
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

export type UserVerificationStatus = 'REGISTERED' | 'VERIFICATION PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type AccountStatus = 'Active' | 'Suspended' | 'Pending';

export interface ManagedUser {
  id: string;
  name: string;
  role: Role;
  email: string;
  mobile: string;
  location: string;
  verificationStatus: UserVerificationStatus;
  accountStatus: AccountStatus;
  documentsSubmitted?: string[];
  specialization?: string;
  licenseNumber?: string;
  registeredAt: string;
  lastActive: string;
  facilityName?: string;
  rejectionReason?: string;
}

export type EmergencyCaseStatus = 'NEW' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'IN_PROGRESS' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';

export interface EmergencyCase {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  village: string;
  warningSigns: string;
  symptoms: string;
  status: EmergencyCaseStatus;
  assignedDoctor?: string;
  assignedFacility?: string;
  escalatedAt: string;
  priority: 'HIGH' | 'CRITICAL';
  notes?: string;
}

export interface LabTestItem {
  id: string;
  name: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Serology' | 'Pathology' | 'Radiology';
  description: string;
  sampleType: string;
  preparation: string;
  turnaroundTime: string;
  turnaroundHours: number;
  priceRupees: number;
  isAvailable: boolean;
  referenceRanges: { parameter: string; range: string; unit: string }[];
}

export type LabOrderStatus = 'Requested' | 'Accepted' | 'Sample Collected' | 'Sample Received' | 'Processing' | 'Report Verified' | 'Released' | 'Cancelled';

export interface LabTestOrder {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientVillage?: string;
  doctorId?: string;
  doctorName?: string;
  testId: string;
  testName: string;
  category: string;
  orderDate: string;
  status: LabOrderStatus;
  sampleId?: string;
  collectionTimestamp?: string;
  receivedTimestamp?: string;
  reportId?: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  notes?: string;
}

export type LabSampleStatus = 'Awaiting Collection' | 'Collected' | 'Received' | 'Processing' | 'Completed' | 'Rejected';

export interface LabSample {
  id: string;
  sampleBarcode: string;
  orderId: string;
  patientId: string;
  patientName: string;
  testName: string;
  sampleType: string;
  status: LabSampleStatus;
  rejectionReason?: string;
  collectedAt?: string;
  receivedAt?: string;
}

export interface SystemHealthItem {
  service: string;
  category: string;
  status: 'Healthy' | 'Degraded' | 'Offline' | 'Simulated' | 'Checked';
  latencyMs?: number;
  lastChecked: string;
  notes: string;
}

