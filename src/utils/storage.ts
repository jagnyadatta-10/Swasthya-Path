import {
  HealthRecord,
  MedicineItem,
  TriageQueueItem,
  AppointmentItem,
  PharmacyRequest,
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
  DoctorItem,
  DoctorLeave,
  PharmacyStoreStatus,
  SMSFallbackMessage,
  Role,
  DemoUser,
  LabTestItem,
  LabTestOrder,
  LabSample,
  ManagedUser,
  EmergencyCase,
  SystemHealthItem
} from '../types';
import {
  INITIAL_RECORDS,
  INITIAL_MEDICINES,
  INITIAL_TRIAGE_QUEUE,
  INITIAL_APPOINTMENTS,
  INITIAL_REQUESTS,
  INITIAL_IMPACT_METRICS,
  INITIAL_VITALS,
  INITIAL_DOCUMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOG,
  INITIAL_SPECIALIST_REQUESTS,
  INITIAL_CARE_JOURNEY,
  INITIAL_FACILITIES,
  INITIAL_CONSENTS,
  INITIAL_CARE_PLANS,
  INITIAL_NCD,
  INITIAL_TB,
  INITIAL_DOCTORS,
  INITIAL_DOCTOR_LEAVES,
  INITIAL_PHARMACY_STATUS,
  INITIAL_SMS_LOGS,
  DEMO_USERS,
  INITIAL_LAB_TESTS,
  INITIAL_LAB_ORDERS,
  INITIAL_LAB_SAMPLES,
  INITIAL_MANAGED_USERS,
  INITIAL_EMERGENCY_CASES,
  INITIAL_SYSTEM_HEALTH
} from '../data/mockData';

const KEYS = {
  SESSION: 'swasthya_active_session_v3',
  REGISTERED_USERS: 'swasthya_registered_users_v3',
  DOCTORS: 'swasthya_doctors_v3',
  DOCTOR_LEAVES: 'swasthya_doctor_leaves_v3',
  PHARMACY_STATUS: 'swasthya_pharmacy_status_v3',
  SMS_LOGS: 'swasthya_sms_logs_v3',
  SYNC_QUEUE: 'swasthya_sync_queue_v3',
  RECORDS: 'swasthya_records_v3',
  MEDICINES: 'swasthya_medicines_v3',
  TRIAGE: 'swasthya_triage_queue_v3',
  APPOINTMENTS: 'swasthya_appointments_v3',
  REQUESTS: 'swasthya_requests_v3',
  METRICS: 'swasthya_impact_metrics_v3',
  VITALS: 'swasthya_vitals_v3',
  DOCUMENTS: 'swasthya_documents_v3',
  PRESCRIPTIONS: 'swasthya_prescriptions_v3',
  NOTIFICATIONS: 'swasthya_notifications_v3',
  AUDIT: 'swasthya_audit_v3',
  SPECIALIST_REQUESTS: 'swasthya_specialist_v3',
  CARE_JOURNEY: 'swasthya_journey_v3',
  TOKEN: 'swasthya_token_v3',
  FACILITIES: 'swasthya_facilities_v3',
  CONSENTS: 'swasthya_consents_v3',
  CARE_PLANS: 'swasthya_care_plans_v3',
  NCD: 'swasthya_ncd_v3',
  TB: 'swasthya_tb_v3',
  LAB_TESTS: 'swasthya_lab_tests_v3',
  LAB_ORDERS: 'swasthya_lab_orders_v3',
  LAB_SAMPLES: 'swasthya_lab_samples_v3',
  MANAGED_USERS: 'swasthya_managed_users_v3',
  EMERGENCY_CASES: 'swasthya_emergency_cases_v3',
  SYSTEM_HEALTH: 'swasthya_system_health_v3'
};

export const storage = {
  // Records
  getRecords(): HealthRecord[] {
    try {
      const data = localStorage.getItem(KEYS.RECORDS);
      if (!data) {
        localStorage.setItem(KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS));
        return INITIAL_RECORDS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_RECORDS;
    }
  },

  saveRecord(record: Omit<HealthRecord, 'id' | 'at' | 'timestamp'> & Partial<HealthRecord>): HealthRecord {
    const list = this.getRecords();
    const newRecord: HealthRecord = {
      id: record.id || `rec-${Date.now()}`,
      patientId: record.patientId || 'RHB-OD-KLH-0941',
      at: record.at || new Date().toLocaleString('en-IN', {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
      timestamp: record.timestamp || Date.now(),
      type: record.type || 'symptom',
      symptoms: record.symptoms,
      duration: record.duration,
      warningSign: record.warningSign,
      pathway: record.pathway,
      urgency: record.urgency || 'routine',
      doctorName: record.doctorName,
      notes: record.notes,
      followUpPlan: record.followUpPlan,
      synced: record.synced !== undefined ? record.synced : true
    };
    list.unshift(newRecord);
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(list));
    return newRecord;
  },

  // Medicines
  getMedicines(): MedicineItem[] {
    try {
      const data = localStorage.getItem(KEYS.MEDICINES);
      if (!data) {
        localStorage.setItem(KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
        return INITIAL_MEDICINES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MEDICINES;
    }
  },

  updateMedicineStatus(id: string, status: MedicineItem['status'], quantity?: number): MedicineItem[] {
    const meds = this.getMedicines();
    const idx = meds.findIndex(m => m.id === id);
    if (idx !== -1) {
      meds[idx].status = status;
      if (quantity !== undefined) meds[idx].quantity = quantity;
      meds[idx].lastUpdated = 'Just now';
      localStorage.setItem(KEYS.MEDICINES, JSON.stringify(meds));
    }
    return meds;
  },

  // Triage Queue
  getTriageQueue(): TriageQueueItem[] {
    try {
      const data = localStorage.getItem(KEYS.TRIAGE);
      if (!data) {
        localStorage.setItem(KEYS.TRIAGE, JSON.stringify(INITIAL_TRIAGE_QUEUE));
        return INITIAL_TRIAGE_QUEUE;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TRIAGE_QUEUE;
    }
  },

  addToTriageQueue(item: Omit<TriageQueueItem, 'id' | 'timestamp' | 'status' | 'waitingTimeMin'>): TriageQueueItem {
    const queue = this.getTriageQueue();
    const newItem: TriageQueueItem = {
      ...item,
      id: `triage-${Date.now()}`,
      timestamp: 'Today • Just now',
      waitingTimeMin: 4,
      status: item.urgency === 'urgent' ? 'escalated' : 'pending'
    };
    queue.unshift(newItem);
    localStorage.setItem(KEYS.TRIAGE, JSON.stringify(queue));
    return newItem;
  },

  updateTriageStatus(id: string, status: TriageQueueItem['status'], doctorNotes?: string): TriageQueueItem[] {
    const queue = this.getTriageQueue();
    const idx = queue.findIndex(t => t.id === id);
    if (idx !== -1) {
      queue[idx].status = status;
      if (doctorNotes) queue[idx].doctorNotes = doctorNotes;
      localStorage.setItem(KEYS.TRIAGE, JSON.stringify(queue));
    }
    return queue;
  },

  // Appointments
  getAppointments(): AppointmentItem[] {
    try {
      const data = localStorage.getItem(KEYS.APPOINTMENTS);
      if (!data) {
        localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
        return INITIAL_APPOINTMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  },

  bookAppointment(patientName: string, doctorName: string, time: string): AppointmentItem {
    const list = this.getAppointments();
    const newItem: AppointmentItem = {
      id: `apt-${Date.now()}`,
      time,
      patientName: `${patientName} (${doctorName})`,
      type: 'Telehealth Consultation',
      status: 'Scheduled',
      channel: 'Video Consultation',
      date: 'Today'
    };
    list.push(newItem);
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(list));
    return newItem;
  },

  // Requests
  getRequests(): PharmacyRequest[] {
    try {
      const data = localStorage.getItem(KEYS.REQUESTS);
      if (!data) {
        localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
        return INITIAL_REQUESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REQUESTS;
    }
  },

  updateRequestStatus(id: string, status: PharmacyRequest['status']): PharmacyRequest[] {
    const list = this.getRequests();
    const idx = list.findIndex(r => r.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(KEYS.REQUESTS, JSON.stringify(list));
    }
    return list;
  },

  addPharmacyRequest(patientName: string, village: string, medicines: string, patientId = 'RHB-OD-KLH-0941'): PharmacyRequest {
    const list = this.getRequests();
    const newReq: PharmacyRequest = {
      id: `req-${Date.now()}`,
      patientId,
      patientName,
      village,
      medicines,
      status: 'Pending',
      timestamp: 'Today • Just now'
    };
    list.unshift(newReq);
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(list));
    return newReq;
  },

  // Consultation Token
  getActiveToken(): ConsultationToken | null {
    try {
      const data = localStorage.getItem(KEYS.TOKEN);
      if (!data) return {
        tokenNumber: 'A-024',
        queuePosition: 3,
        estimatedWaitMin: 12,
        status: 'Waiting',
        doctorName: 'Dr. Ananya Mishra',
        requestedSpecialty: 'General Medicine',
        joinedAt: 'Today, 10:32 AM'
      };
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  generateToken(doctorName: string, specialty = 'General Medicine'): ConsultationToken {
    const token: ConsultationToken = {
      tokenNumber: `A-0${Math.floor(Math.random() * 80 + 20)}`,
      queuePosition: Math.floor(Math.random() * 3 + 1),
      estimatedWaitMin: Math.floor(Math.random() * 10 + 5),
      status: 'Waiting',
      doctorName,
      requestedSpecialty: specialty,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    localStorage.setItem(KEYS.TOKEN, JSON.stringify(token));
    this.addNotification({
      title: `Token ${token.tokenNumber} Generated`,
      body: `Demo notification: Your consultation token is ${token.tokenNumber} with ${doctorName}. Estimated wait: ${token.estimatedWaitMin} mins.`,
      type: 'queue'
    });
    this.addAuditLog(`Patient joined queue for ${doctorName} (Token ${token.tokenNumber})`, 'Keshab Rout');
    return token;
  },

  clearActiveToken(): void {
    localStorage.removeItem(KEYS.TOKEN);
  },

  // Vitals
  getVitals(): PhysiologicalVitals {
    try {
      const data = localStorage.getItem(KEYS.VITALS);
      if (!data) {
        localStorage.setItem(KEYS.VITALS, JSON.stringify(INITIAL_VITALS));
        return INITIAL_VITALS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_VITALS;
    }
  },

  saveVitals(vitals: PhysiologicalVitals): PhysiologicalVitals {
    localStorage.setItem(KEYS.VITALS, JSON.stringify(vitals));
    return vitals;
  },

  // Diagnostic Documents
  getDocuments(): DiagnosticDocument[] {
    try {
      const data = localStorage.getItem(KEYS.DOCUMENTS);
      if (!data) {
        localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
        return INITIAL_DOCUMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DOCUMENTS;
    }
  },

  addDocument(doc: Omit<DiagnosticDocument, 'id'> & Partial<DiagnosticDocument>): DiagnosticDocument {
    const list = this.getDocuments();
    const newDoc: DiagnosticDocument = {
      ...doc,
      id: doc.id || `doc-${Date.now()}`
    };
    list.unshift(newDoc);
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(list));
    return newDoc;
  },

  updateDocumentStatus(id: string, status: DiagnosticDocument['status']): DiagnosticDocument[] {
    const list = this.getDocuments();
    const idx = list.findIndex(d => d.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(list));
    }
    return list;
  },

  // Prescriptions
  getPrescriptions(): FullPrescription[] {
    try {
      const data = localStorage.getItem(KEYS.PRESCRIPTIONS);
      if (!data) {
        localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
        return INITIAL_PRESCRIPTIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PRESCRIPTIONS;
    }
  },

  savePrescription(rx: Omit<FullPrescription, 'id' | 'prescriptionNumber' | 'date'> & Partial<FullPrescription>): FullPrescription {
    const list = this.getPrescriptions();
    const existingIndex = rx.id 
      ? list.findIndex(p => p.id === rx.id) 
      : rx.prescriptionNumber 
      ? list.findIndex(p => p.prescriptionNumber === rx.prescriptionNumber) 
      : -1;

    let finalRx: FullPrescription;

    if (existingIndex !== -1) {
      finalRx = {
        ...list[existingIndex],
        ...rx,
        id: list[existingIndex].id,
        prescriptionNumber: list[existingIndex].prescriptionNumber,
        date: rx.date || list[existingIndex].date,
        medicines: rx.medicines || list[existingIndex].medicines,
        diagnosisSummary: rx.diagnosisSummary !== undefined ? rx.diagnosisSummary : list[existingIndex].diagnosisSummary,
        followUp: rx.followUp !== undefined ? rx.followUp : list[existingIndex].followUp,
        notes: rx.notes !== undefined ? rx.notes : list[existingIndex].notes,
        status: rx.status || 'finalized',
        syncStatus: 'synced',
        updatedAt: new Date().toISOString(),
        version: (list[existingIndex].version || 1) + 1,
        digitalSignature: rx.digitalSignature || `Digitally Authorized by ${rx.doctorName || list[existingIndex].doctorName} (${new Date().toLocaleDateString('en-GB')})`
      };
      list[existingIndex] = finalRx;
      localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(list));
      this.addNotification({
        title: 'E-Prescription Updated',
        body: `E-Prescription ${finalRx.prescriptionNumber} for ${finalRx.patientName} was revised by ${finalRx.doctorName} and synced to records.`,
        type: 'prescription'
      });
      this.addAuditLog(`E-Prescription ${finalRx.prescriptionNumber} updated by ${finalRx.doctorName}`, finalRx.doctorName);
    } else {
      finalRx = {
        ...rx,
        id: rx.id || `rx-${Date.now()}`,
        prescriptionNumber: rx.prescriptionNumber || `RX-KLH-2026-0${Math.floor(Math.random() * 800 + 100)}`,
        date: rx.date || new Date().toLocaleDateString('en-GB'),
        patientId: rx.patientId || 'RHB-OD-KLH-0941',
        patientName: rx.patientName || 'Keshab Rout',
        doctorName: rx.doctorName || 'Dr. Ananya Mishra',
        doctorHospital: rx.doctorHospital || 'DHH Bhawanipatna Telehealth Unit',
        diagnosisSummary: rx.diagnosisSummary || 'Clinical tele-consultation evaluation complete.',
        medicines: rx.medicines || [],
        followUp: rx.followUp || 'Follow-up teleconsultation in 3 days if symptoms persist.',
        status: rx.status || 'finalized',
        syncStatus: 'synced',
        updatedAt: new Date().toISOString(),
        version: 1,
        digitalSignature: rx.digitalSignature || 'Digitally Authorized by Licensed Medical Officer'
      };
      list.unshift(finalRx);
      localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(list));
      this.addNotification({
        title: 'E-Prescription Available',
        body: `E-Prescription ${finalRx.prescriptionNumber} has been issued by ${finalRx.doctorName} and synced to patient records.`,
        type: 'prescription'
      });
      this.addAuditLog(`E-Prescription ${finalRx.prescriptionNumber} created`, finalRx.doctorName);
    }

    // Explicitly synchronize into longitudinal patient health records
    this.syncPrescriptionToPatientRecord(finalRx);

    return finalRx;
  },

  syncPrescriptionToPatientRecord(rx: FullPrescription) {
    try {
      const records = this.getRecords();
      const existingRecIndex = records.findIndex(
        r => r.id === `rec-rx-${rx.id}` || (r.type === 'prescription' && r.notes?.includes(rx.prescriptionNumber))
      );

      const medSummary = rx.medicines && rx.medicines.length > 0 
        ? rx.medicines.map(m => `${m.name} ${m.strength} (${m.dosage})`).join(', ')
        : 'Oral hydration and supportive tele-care';

      const recordEntry: HealthRecord = {
        id: `rec-rx-${rx.id}`,
        patientId: rx.patientId,
        doctorId: rx.doctorId || 'doc-01',
        doctorName: rx.doctorName,
        type: 'prescription',
        at: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
        timestamp: Date.now(),
        updatedAt: new Date().toISOString(),
        version: existingRecIndex !== -1 ? (records[existingRecIndex].version || 1) + 1 : 1,
        syncStatus: 'synced',
        synced: true,
        notes: `Rx ${rx.prescriptionNumber}: ${rx.diagnosisSummary}. Prescribed: ${medSummary}.${rx.notes ? ' Clinical note: ' + rx.notes : ''}`,
        followUpPlan: rx.followUp,
        pathway: 'clinician care plan & e-prescription',
        urgency: 'routine',
        prescriptionData: rx
      };

      if (existingRecIndex !== -1) {
        records[existingRecIndex] = { ...records[existingRecIndex], ...recordEntry };
      } else {
        records.unshift(recordEntry);
      }
      localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));

      // Also update Care Plan in storage so patient portal care plan matches
      const carePlans = this.getCarePlans();
      if (carePlans && carePlans.length > 0) {
        const cp = { ...carePlans[0] };
        cp.doctorName = rx.doctorName;
        cp.diagnosis = rx.diagnosisSummary;
        cp.instructions = rx.notes || cp.instructions;
        cp.medicinePlan = medSummary;
        cp.followUpDate = rx.followUp;
        carePlans[0] = cp;
        localStorage.setItem(KEYS.CARE_PLANS, JSON.stringify(carePlans));
      }
    } catch (e) {
      console.error('Failed to sync prescription to patient record:', e);
    }
  },

  // Notifications
  getNotifications(): AppNotification[] {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      if (!data) {
        localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
        return INITIAL_NOTIFICATIONS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  addNotification(n: Omit<AppNotification, 'id' | 'time' | 'read'>): AppNotification {
    const list = this.getNotifications();
    const item: AppNotification = {
      ...n,
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false
    };
    list.unshift(item);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
    return item;
  },

  markNotificationsRead() {
    const list = this.getNotifications().map(n => ({ ...n, read: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list));
  },

  // Audit Log
  getAuditLog(): AuditLogEntry[] {
    try {
      const data = localStorage.getItem(KEYS.AUDIT);
      if (!data) {
        localStorage.setItem(KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOG));
        return INITIAL_AUDIT_LOG;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_AUDIT_LOG;
    }
  },

  addAuditLog(action: string, actor: string) {
    const list = this.getAuditLog();
    const item: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action,
      actor
    };
    list.unshift(item);
    localStorage.setItem(KEYS.AUDIT, JSON.stringify(list));
  },

  // Specialist Requests (Doctor-to-Doctor)
  getSpecialistRequests(): SpecialistRequest[] {
    try {
      const data = localStorage.getItem(KEYS.SPECIALIST_REQUESTS);
      if (!data) {
        localStorage.setItem(KEYS.SPECIALIST_REQUESTS, JSON.stringify(INITIAL_SPECIALIST_REQUESTS));
        return INITIAL_SPECIALIST_REQUESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SPECIALIST_REQUESTS;
    }
  },

  addSpecialistRequest(req: Omit<SpecialistRequest, 'id' | 'timestamp' | 'status'>): SpecialistRequest {
    const list = this.getSpecialistRequests();
    const item: SpecialistRequest = {
      ...req,
      id: `spec-${Date.now()}`,
      timestamp: 'Today, Just now',
      status: 'Requested'
    };
    list.unshift(item);
    localStorage.setItem(KEYS.SPECIALIST_REQUESTS, JSON.stringify(list));
    this.addAuditLog(`Specialist opinion requested (${req.requestedSpecialist})`, req.referringDoctor);
    return item;
  },

  // Care Journey
  getCareJourney(): CareJourneyStage[] {
    try {
      const data = localStorage.getItem(KEYS.CARE_JOURNEY);
      if (!data) {
        localStorage.setItem(KEYS.CARE_JOURNEY, JSON.stringify(INITIAL_CARE_JOURNEY));
        return INITIAL_CARE_JOURNEY;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CARE_JOURNEY;
    }
  },

  // Metrics
  getMetrics(): ImpactMetrics {
    try {
      const data = localStorage.getItem(KEYS.METRICS);
      if (!data) {
        localStorage.setItem(KEYS.METRICS, JSON.stringify(INITIAL_IMPACT_METRICS));
        return INITIAL_IMPACT_METRICS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_IMPACT_METRICS;
    }
  },

  incrementMetric(key: keyof ImpactMetrics, delta = 1) {
    const m = this.getMetrics();
    if (typeof m[key] === 'number') {
      m[key] = (m[key] as number) + delta;
      localStorage.setItem(KEYS.METRICS, JSON.stringify(m));
    }
  },

  // Health Facilities
  getFacilities(): HealthFacility[] {
    try {
      const data = localStorage.getItem(KEYS.FACILITIES);
      if (!data) {
        localStorage.setItem(KEYS.FACILITIES, JSON.stringify(INITIAL_FACILITIES));
        return INITIAL_FACILITIES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_FACILITIES;
    }
  },

  // Consents
  getConsents(): ConsentItem[] {
    try {
      const data = localStorage.getItem(KEYS.CONSENTS);
      if (!data) {
        localStorage.setItem(KEYS.CONSENTS, JSON.stringify(INITIAL_CONSENTS));
        return INITIAL_CONSENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CONSENTS;
    }
  },

  toggleConsent(id: string): ConsentItem[] {
    const list = this.getConsents();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx].status = list[idx].status === 'Granted' ? 'Revoked' : 'Granted';
      localStorage.setItem(KEYS.CONSENTS, JSON.stringify(list));
      this.addAuditLog(`Consent status changed for ${list[idx].party} to ${list[idx].status}`, 'Keshab Rout');
    }
    return list;
  },

  // Care Plans
  getCarePlans(): CarePlan[] {
    try {
      const data = localStorage.getItem(KEYS.CARE_PLANS);
      if (!data) {
        localStorage.setItem(KEYS.CARE_PLANS, JSON.stringify(INITIAL_CARE_PLANS));
        return INITIAL_CARE_PLANS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_CARE_PLANS;
    }
  },

  saveCarePlan(cp: Omit<CarePlan, 'id'> & Partial<CarePlan>): CarePlan {
    const list = this.getCarePlans();
    const newPlan: CarePlan = {
      ...cp,
      id: cp.id || `cp-${Date.now()}`
    };
    list.unshift(newPlan);
    localStorage.setItem(KEYS.CARE_PLANS, JSON.stringify(list));
    this.addNotification({
      title: 'Care Plan & Follow-up Created',
      body: `Demo notification: Follow-up scheduled for ${newPlan.followUpDate} (${newPlan.followUpMode}).`,
      type: 'doctor'
    });
    this.addAuditLog(`Care Plan created with follow-up ${newPlan.followUpDate}`, newPlan.doctorName);
    return newPlan;
  },

  // NCD
  getNcd(): NcdRecord {
    try {
      const data = localStorage.getItem(KEYS.NCD);
      if (!data) {
        localStorage.setItem(KEYS.NCD, JSON.stringify(INITIAL_NCD));
        return INITIAL_NCD;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_NCD;
    }
  },

  saveNcd(ncd: NcdRecord): NcdRecord {
    localStorage.setItem(KEYS.NCD, JSON.stringify(ncd));
    return ncd;
  },

  // TB
  getTb(): TbTreatmentRecord {
    try {
      const data = localStorage.getItem(KEYS.TB);
      if (!data) {
        localStorage.setItem(KEYS.TB, JSON.stringify(INITIAL_TB));
        return INITIAL_TB;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_TB;
    }
  },

  saveTb(tb: TbTreatmentRecord): TbTreatmentRecord {
    localStorage.setItem(KEYS.TB, JSON.stringify(tb));
    return tb;
  },

  // Active Session Persistence
  getActiveSession(): DemoUser | null {
    try {
      const data = localStorage.getItem(KEYS.SESSION);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setActiveSession(user: DemoUser) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
    this.addAuditLog(`User session authenticated (${user.role}: ${user.name})`, user.name);
  },

  clearActiveSession() {
    const sess = this.getActiveSession();
    if (sess) {
      this.addAuditLog(`User logged out (${sess.role}: ${sess.name})`, sess.name);
    }
    localStorage.removeItem(KEYS.SESSION);
  },

  // Registered Users (Patient, Doctor, Pharmacy)
  getRegisteredUsers(): any[] {
    try {
      const data = localStorage.getItem(KEYS.REGISTERED_USERS);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  registerUser(userData: any): any {
    const list = this.getRegisteredUsers();
    const newUser = {
      ...userData,
      id: userData.id || `usr-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(newUser);
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(list));
    this.addNotification({
      title: 'Account Created',
      body: `Welcome to Swasthya Path, ${newUser.name || newUser.pharmacyName || 'User'}!`,
      type: 'doctor'
    });
    this.addAuditLog(`Registered new ${newUser.role} account`, newUser.name || 'System');
    return newUser;
  },

  authenticateUser(identifier: string, role: Role, password?: string): DemoUser | null {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPhone = cleanId.replace(/[^0-9]/g, '');

    // 1. Check dynamically registered users in local storage
    const registered = this.getRegisteredUsers();
    const matched = registered.find((u: any) => {
      const matchRole = u.role === role || (role === 'lab' && u.role === 'pathology') || (role === 'admin' && u.role === 'administrator');
      if (!matchRole) return false;
      const uPhone = (u.mobile || '').replace(/[^0-9]/g, '');
      const uEmail = (u.email || '').trim().toLowerCase();
      const uName = (u.name || '').trim().toLowerCase();
      const matchId = (cleanPhone.length >= 8 && uPhone.includes(cleanPhone)) || 
                      (uEmail && uEmail === cleanId) || 
                      (uName && uName === cleanId);
      return matchId;
    });

    if (matched) {
      if (password && matched.password && matched.password !== password) {
        return null; // Invalid password
      }
      return matched as DemoUser;
    }

    // 2. Check standard seeded district profiles (fallback if matching credentials entered)
    const seeded = DEMO_USERS[role];
    if (seeded) {
      const seededPhone = seeded.mobile.replace(/[^0-9]/g, '');
      const seededEmail = seeded.email.toLowerCase();
      const seededName = seeded.name.toLowerCase();
      const matchSeeded = (cleanPhone.length >= 8 && seededPhone.includes(cleanPhone)) || 
                          (seededEmail && seededEmail === cleanId) ||
                          (seededName && seededName === cleanId);
      if (matchSeeded) {
        if (!password || password === 'Demo@123' || password.length >= 4) {
          return seeded;
        }
      }
    }

    return null;
  },

  registerNewAccount(accountData: any): DemoUser {
    const list = this.getRegisteredUsers();
    const newUser: DemoUser = {
      role: accountData.role,
      name: accountData.name,
      email: accountData.email || `${accountData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@swasthyapath.in`,
      mobile: accountData.mobile,
      location: accountData.location || 'Kalahandi, Odisha',
      healthFacility: accountData.healthFacility || accountData.hospital || 'District Health Network',
      badge: accountData.role === 'doctor' ? `Reg. ${accountData.registrationNumber || 'OSMC'}` : accountData.role === 'pharmacy' ? 'Registered Jan Aushadhi' : accountData.role === 'lab' ? 'NABL Diagnostic Lab' : accountData.role === 'admin' ? 'District Administrator' : 'ABHA Verified Citizen',
      patientId: accountData.role === 'patient' ? (accountData.patientId || `RHB-OD-KLH-${Math.floor(1000 + Math.random() * 9000)}`) : undefined,
      age: accountData.age ? Number(accountData.age) : undefined,
      gender: accountData.gender,
      bloodGroup: accountData.bloodGroup,
      abhaId: accountData.abhaId,
      emergencyContact: accountData.emergencyContact,
      block: accountData.block || 'Bhawanipatna',
      registrationNumber: accountData.registrationNumber,
      specialty: accountData.specialty,
      qualification: accountData.qualification,
      designation: accountData.designation,
      password: accountData.password
    };

    list.unshift(newUser);
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(list));

    // Register in managed users directory for Administrator oversight
    this.saveManagedUser({
      id: `usr-${Date.now()}`,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      mobile: newUser.mobile,
      location: newUser.location,
      facilityName: newUser.healthFacility,
      verificationStatus: newUser.role === 'patient' ? 'VERIFIED' : 'VERIFICATION PENDING',
      accountStatus: 'Active',
      documentsSubmitted: accountData.registrationNumber ? [`License/ID: ${accountData.registrationNumber}`] : ['Identity Document', 'Mobile Verified'],
      registeredAt: 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastActive: 'Just now'
    });

    if (newUser.role === 'doctor') {
      this.saveDoctor({
        id: `doc-${Date.now()}`,
        name: newUser.name.startsWith('Dr.') ? newUser.name : `Dr. ${newUser.name}`,
        specialty: accountData.specialty || 'General Medicine',
        hospital: newUser.healthFacility || 'DHH Bhawanipatna',
        facility: newUser.healthFacility || 'DHH Bhawanipatna',
        status: 'Available',
        nextSlot: 'Available Now',
        nextAvailable: 'Available Now',
        languages: ['Odia', 'Hindi', 'English'],
        emergencyDuty: true,
        rating: 5.0,
        available: true,
        experience: accountData.qualification || 'MBBS',
        fees: 'Free (Govt Telehealth Service)'
      });
    }

    this.addAuditLog(`User registered as ${newUser.role.toUpperCase()}: ${newUser.name}`, newUser.name);
    this.addNotification({
      title: 'Account Registered',
      body: `Welcome to Swasthya Path, ${newUser.name}! Your ${newUser.role} portal is active.`,
      type: 'system'
    });

    return newUser;
  },

  // Doctors & Directory
  getDoctors(): DoctorItem[] {
    try {
      const data = localStorage.getItem(KEYS.DOCTORS);
      if (!data) {
        localStorage.setItem(KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
        return INITIAL_DOCTORS;
      }
      const parsed: DoctorItem[] = JSON.parse(data);
      return parsed.map(d => {
        const init = INITIAL_DOCTORS.find(item => item.id === d.id);
        return init ? { ...init, ...d, feedUrl: d.feedUrl || init.feedUrl, avatarUrl: d.avatarUrl || init.avatarUrl, gender: d.gender || init.gender } : d;
      });
    } catch {
      return INITIAL_DOCTORS;
    }
  },

  saveDoctor(doc: DoctorItem): DoctorItem {
    const list = this.getDoctors();
    const idx = list.findIndex(d => d.id === doc.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...doc };
    } else {
      list.push(doc);
    }
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(list));
    return doc;
  },

  // Doctor Scheduled Leaves
  getDoctorLeaves(): DoctorLeave[] {
    try {
      const data = localStorage.getItem(KEYS.DOCTOR_LEAVES);
      if (!data) {
        localStorage.setItem(KEYS.DOCTOR_LEAVES, JSON.stringify(INITIAL_DOCTOR_LEAVES));
        return INITIAL_DOCTOR_LEAVES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DOCTOR_LEAVES;
    }
  },

  saveDoctorLeave(leave: Omit<DoctorLeave, 'id' | 'createdAt'> & Partial<DoctorLeave>): DoctorLeave {
    const list = this.getDoctorLeaves();
    const newLeave: DoctorLeave = {
      ...leave,
      id: leave.id || `leave-${Date.now()}`,
      status: leave.status || 'Active',
      createdAt: new Date().toISOString()
    };
    list.unshift(newLeave);
    localStorage.setItem(KEYS.DOCTOR_LEAVES, JSON.stringify(list));

    // Update doctor's availability status in doctor directory
    const doctors = this.getDoctors();
    const docIdx = doctors.findIndex(d => d.id === newLeave.doctorId || d.name === newLeave.doctorName);
    if (docIdx !== -1) {
      doctors[docIdx].status = 'On Leave';
      doctors[docIdx].nextAvailable = newLeave.endDate;
      localStorage.setItem(KEYS.DOCTORS, JSON.stringify(doctors));
    }

    this.addNotification({
      title: 'Doctor Scheduled Leave',
      body: `${newLeave.doctorName} is on leave from ${newLeave.startDate} to ${newLeave.endDate}. Alternate: ${newLeave.replacementDoctor || 'General Medical Officer on call'}.`,
      type: 'doctor'
    });
    this.addAuditLog(`Scheduled leave for ${newLeave.doctorName} (${newLeave.startDate} to ${newLeave.endDate})`, newLeave.doctorName);

    // Generate SMS broadcast fallback notification
    this.sendSMS({
      toPhone: '9861000000',
      category: 'leave',
      content: `[HOLIDAY/LEAVE] Doctor: ${newLeave.doctorName} | Status: On Leave (${newLeave.startDate} to ${newLeave.endDate}) | Next Available: ${newLeave.endDate} | Alternative: ${newLeave.replacementDoctor || 'DHH Bhawanipatna OPD'}`
    });

    return newLeave;
  },

  // Pharmacy Store Status
  getPharmacyStatus(): PharmacyStoreStatus {
    try {
      const data = localStorage.getItem(KEYS.PHARMACY_STATUS);
      if (!data) {
        localStorage.setItem(KEYS.PHARMACY_STATUS, JSON.stringify(INITIAL_PHARMACY_STATUS));
        return INITIAL_PHARMACY_STATUS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_PHARMACY_STATUS;
    }
  },

  updatePharmacyStatus(updates: Partial<PharmacyStoreStatus>): PharmacyStoreStatus {
    const current = this.getPharmacyStatus();
    const updated: PharmacyStoreStatus = {
      ...current,
      ...updates,
      lastUpdated: 'Just now'
    };
    localStorage.setItem(KEYS.PHARMACY_STATUS, JSON.stringify(updated));
    this.addAuditLog(`Pharmacy store status updated: ${updated.status || 'Updated'}`, updated.pharmacyName || 'Pharmacy');
    return updated;
  },

  // SMS Fallback System
  getSMSLogs(): SMSFallbackMessage[] {
    try {
      const data = localStorage.getItem(KEYS.SMS_LOGS);
      if (!data) {
        localStorage.setItem(KEYS.SMS_LOGS, JSON.stringify(INITIAL_SMS_LOGS));
        return INITIAL_SMS_LOGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SMS_LOGS;
    }
  },

  sendSMS(msg: Omit<SMSFallbackMessage, 'id' | 'timestamp' | 'deliveryStatus'>): SMSFallbackMessage {
    const logs = this.getSMSLogs();
    const entry: SMSFallbackMessage = {
      ...msg,
      id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryStatus: 'Sent (Simulated Cellular Gateway)'
    };
    logs.unshift(entry);
    localStorage.setItem(KEYS.SMS_LOGS, JSON.stringify(logs));
    return entry;
  },

  // Lab Tests Catalogue
  getLabTests(): LabTestItem[] {
    try {
      const data = localStorage.getItem(KEYS.LAB_TESTS);
      if (!data) {
        localStorage.setItem(KEYS.LAB_TESTS, JSON.stringify(INITIAL_LAB_TESTS));
        return INITIAL_LAB_TESTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LAB_TESTS;
    }
  },

  saveLabTest(test: LabTestItem): LabTestItem {
    const list = this.getLabTests();
    const idx = list.findIndex(t => t.id === test.id);
    if (idx !== -1) {
      list[idx] = test;
    } else {
      list.push(test);
    }
    localStorage.setItem(KEYS.LAB_TESTS, JSON.stringify(list));
    this.addAuditLog(`Test catalogue updated: ${test.name}`, 'Pathology Lab');
    return test;
  },

  updateLabTest(id: string, updates: Partial<LabTestItem>): LabTestItem[] {
    const list = this.getLabTests();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem(KEYS.LAB_TESTS, JSON.stringify(list));
      this.addAuditLog(`Updated lab test item: ${list[idx].name}`, 'Pathology Lab');
    }
    return list;
  },

  // Lab Test Orders
  getLabOrders(): LabTestOrder[] {
    try {
      const data = localStorage.getItem(KEYS.LAB_ORDERS);
      if (!data) {
        localStorage.setItem(KEYS.LAB_ORDERS, JSON.stringify(INITIAL_LAB_ORDERS));
        return INITIAL_LAB_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LAB_ORDERS;
    }
  },

  addLabOrder(order: Partial<LabTestOrder>): LabTestOrder {
    const list = this.getLabOrders();
    const newOrder: LabTestOrder = {
      ...order,
      id: order.id || `ord-${Date.now()}`,
      orderDate: order.orderDate || 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: order.status || 'Requested',
      urgency: order.urgency || 'Routine',
      patientId: order.patientId || 'RHB-OD-KLH-0941',
      patientName: order.patientName || 'Keshab Rout',
      patientAge: order.patientAge || 45,
      patientGender: order.patientGender || 'Male',
      testId: order.testId || 'test-cbc',
      testName: order.testName || 'Complete Blood Count (CBC)',
      category: order.category || 'Hematology'
    };
    list.unshift(newOrder);
    localStorage.setItem(KEYS.LAB_ORDERS, JSON.stringify(list));

    // Also automatically create sample slot
    const samples = this.getLabSamples();
    const newSample: LabSample = {
      id: `smp-${Date.now()}`,
      sampleBarcode: `SP-KLH-${Math.floor(100000 + Math.random() * 900000)}`,
      orderId: newOrder.id,
      patientId: newOrder.patientId,
      patientName: newOrder.patientName,
      testName: newOrder.testName,
      sampleType: 'Whole Blood (EDTA)',
      status: 'Awaiting Collection'
    };
    samples.unshift(newSample);
    localStorage.setItem(KEYS.LAB_SAMPLES, JSON.stringify(samples));

    this.addNotification({
      title: 'Lab Test Requested',
      body: `Test request created for ${newOrder.patientName} (${newOrder.testName}). Sample barcode: ${newSample.sampleBarcode}.`,
      type: 'system'
    });
    this.addAuditLog(`Lab test order created: ${newOrder.testName} for ${newOrder.patientName}`, newOrder.doctorName || 'Doctor');
    return newOrder;
  },

  updateLabOrderStatus(orderId: string, status: LabTestOrder['status'], extra?: Partial<LabTestOrder>): LabTestOrder[] {
    const list = this.getLabOrders();
    const idx = list.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], status, ...extra };
      localStorage.setItem(KEYS.LAB_ORDERS, JSON.stringify(list));
      this.addAuditLog(`Order ${orderId} status changed to ${status}`, 'Pathology Lab');

      // Update sample status if applicable
      const samples = this.getLabSamples();
      const sampleIdx = samples.findIndex(s => s.orderId === orderId);
      if (sampleIdx !== -1) {
        if (status === 'Sample Collected') {
          samples[sampleIdx].status = 'Collected';
          samples[sampleIdx].collectedAt = 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (status === 'Sample Received') {
          samples[sampleIdx].status = 'Received';
          samples[sampleIdx].receivedAt = 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (status === 'Processing') {
          samples[sampleIdx].status = 'Processing';
        } else if (status === 'Released') {
          samples[sampleIdx].status = 'Completed';
        }
        localStorage.setItem(KEYS.LAB_SAMPLES, JSON.stringify(samples));
      }
    }
    return list;
  },

  // Lab Samples
  getLabSamples(): LabSample[] {
    try {
      const data = localStorage.getItem(KEYS.LAB_SAMPLES);
      if (!data) {
        localStorage.setItem(KEYS.LAB_SAMPLES, JSON.stringify(INITIAL_LAB_SAMPLES));
        return INITIAL_LAB_SAMPLES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_LAB_SAMPLES;
    }
  },

  saveLabSample(sample: LabSample): LabSample {
    const list = this.getLabSamples();
    const idx = list.findIndex(s => s.id === sample.id);
    if (idx !== -1) {
      list[idx] = sample;
    } else {
      list.unshift(sample);
    }
    localStorage.setItem(KEYS.LAB_SAMPLES, JSON.stringify(list));
    return sample;
  },

  updateLabSampleStatus(sampleId: string, status: LabSample['status'], rejectionReason?: string): LabSample[] {
    const list = this.getLabSamples();
    const idx = list.findIndex(s => s.id === sampleId);
    if (idx !== -1) {
      list[idx].status = status;
      if (rejectionReason) list[idx].rejectionReason = rejectionReason;
      if (status === 'Collected' && !list[idx].collectedAt) {
        list[idx].collectedAt = 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      if (status === 'Received' && !list[idx].receivedAt) {
        list[idx].receivedAt = 'Today • ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      localStorage.setItem(KEYS.LAB_SAMPLES, JSON.stringify(list));
      this.addAuditLog(`Sample ${list[idx].sampleBarcode} status set to ${status}${rejectionReason ? ` (${rejectionReason})` : ''}`, 'Pathology Lab');
    }
    return list;
  },

  // Release and Sync Lab Report
  releaseLabReport(doc: DiagnosticDocument): DiagnosticDocument {
    const docs = this.getDocuments();
    const existingIndex = docs.findIndex(d => d.id === doc.id);

    const releasedDoc: DiagnosticDocument = {
      ...doc,
      verificationStatus: 'Released',
      status: 'Ready',
      releasedAt: doc.releasedAt || new Date().toISOString(),
      authorizedVerifier: doc.authorizedVerifier || 'Dr. Saroj K. Sahu, MD (Pathology)',
      version: (doc.version || 1)
    };

    if (existingIndex !== -1) {
      docs[existingIndex] = releasedDoc;
    } else {
      docs.unshift(releasedDoc);
    }
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(docs));

    // Update associated order status if found
    if (doc.orderId) {
      this.updateLabOrderStatus(doc.orderId, 'Released', { reportId: doc.id });
    } else {
      // Look up by patient and test name
      const orders = this.getLabOrders();
      const orderMatch = orders.find(o => o.patientId === doc.patientId && (o.testName === doc.title || o.testName === doc.testCategory));
      if (orderMatch) {
        this.updateLabOrderStatus(orderMatch.id, 'Released', { reportId: doc.id });
      }
    }

    // Sync to patient longitudinal health record
    this.syncLabReportToPatientRecord(releasedDoc);

    // Notify patient & doctor
    this.addNotification({
      title: 'Lab Report Verified & Released',
      body: `Diagnostic Report for ${releasedDoc.patientName} (${releasedDoc.title}) is verified by ${releasedDoc.authorizedVerifier} and synced to medical records.`,
      type: 'system'
    });

    this.addAuditLog(`Lab report verified & released: ${releasedDoc.title} for ${releasedDoc.patientName}`, releasedDoc.authorizedVerifier || 'Pathologist');

    // SMS fallback alert
    this.sendSMS({
      toPhone: '9861000000',
      category: 'telehealth',
      content: `[SWASTHYA PATH LAB] Report Released: ${releasedDoc.title} for ${releasedDoc.patientName}. Verified by ${releasedDoc.authorizedVerifier}. Available on your portal.`
    });

    return releasedDoc;
  },

  syncLabReportToPatientRecord(doc: DiagnosticDocument) {
    try {
      const records = this.getRecords();
      const existingRecIndex = records.findIndex(
        r => r.id === `rec-lab-${doc.id}` || (r.type === 'diagnostic' && r.notes?.includes(doc.title))
      );
      const paramSummary = doc.parameters && doc.parameters.length > 0
        ? doc.parameters.map(p => `${p.name}: ${p.result} ${p.unit || ''} [${p.status || (p.isAbnormal ? 'Abnormal' : 'Normal')}]`).join('; ')
        : doc.findings || 'Report released by pathology lab';

      const hasAbnormal = doc.parameters?.some(p => p.status === 'High' || p.status === 'Low');

      const recordEntry: HealthRecord = {
        id: `rec-lab-${doc.id}`,
        patientId: doc.patientId || 'RHB-OD-KLH-0941',
        at: doc.date || new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
        timestamp: Date.now(),
        type: 'diagnostic',
        pathway: doc.testCategory || 'Diagnostic Lab Investigation',
        urgency: hasAbnormal ? 'urgent' : 'routine',
        doctorName: doc.doctorName || 'Dr. Ananya Mishra',
        notes: `[LAB REPORT RELEASED] Test: ${doc.title} | Facility: ${doc.labName} | Status: Released | Verifier: ${doc.authorizedVerifier || 'Pathologist'}. Parameters: ${paramSummary}. NOTE: Laboratory results should be interpreted by a qualified healthcare professional.`,
        followUpPlan: 'Laboratory results should be interpreted by a qualified healthcare professional during doctor consultation.',
        synced: true
      };

      if (existingRecIndex !== -1) {
        records[existingRecIndex] = { ...records[existingRecIndex], ...recordEntry };
      } else {
        records.unshift(recordEntry);
      }
      localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
    } catch (err) {
      console.error('Error syncing lab report to record:', err);
    }
  },

  // Managed Users (Admin Portal)
  getManagedUsers(): ManagedUser[] {
    try {
      const data = localStorage.getItem(KEYS.MANAGED_USERS);
      if (!data) {
        localStorage.setItem(KEYS.MANAGED_USERS, JSON.stringify(INITIAL_MANAGED_USERS));
        return INITIAL_MANAGED_USERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_MANAGED_USERS;
    }
  },

  saveManagedUser(user: ManagedUser): ManagedUser {
    const list = this.getManagedUsers();
    const idx = list.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      list[idx] = user;
    } else {
      list.unshift(user);
    }
    localStorage.setItem(KEYS.MANAGED_USERS, JSON.stringify(list));
    this.addAuditLog(`User profile updated: ${user.name} (${user.role})`, 'Administrator');
    return user;
  },

  updateUserVerification(userId: string, verificationStatus: ManagedUser['verificationStatus'], accountStatus?: ManagedUser['accountStatus'], rejectionReason?: string): ManagedUser[] {
    const list = this.getManagedUsers();
    const idx = list.findIndex(u => u.id === userId);
    if (idx !== -1) {
      list[idx].verificationStatus = verificationStatus;
      if (accountStatus) list[idx].accountStatus = accountStatus;
      if (rejectionReason !== undefined) list[idx].rejectionReason = rejectionReason;
      localStorage.setItem(KEYS.MANAGED_USERS, JSON.stringify(list));
      this.addAuditLog(`User ${list[idx].name} verification changed to ${verificationStatus} (${accountStatus || list[idx].accountStatus})`, 'Administrator');
      this.addNotification({
        title: 'User Verification Status Updated',
        body: `${list[idx].name}'s verification status is now ${verificationStatus}.`,
        type: 'system'
      });
    }
    return list;
  },

  updateAccountStatus(userId: string, accountStatus: ManagedUser['accountStatus']): ManagedUser[] {
    const list = this.getManagedUsers();
    const idx = list.findIndex(u => u.id === userId);
    if (idx !== -1) {
      list[idx].accountStatus = accountStatus;
      localStorage.setItem(KEYS.MANAGED_USERS, JSON.stringify(list));
      this.addAuditLog(`Account status for ${list[idx].name} updated to ${accountStatus}`, 'Administrator');
    }
    return list;
  },

  // Emergency Cases (Admin Escalation Center)
  getEmergencyCases(): EmergencyCase[] {
    try {
      const data = localStorage.getItem(KEYS.EMERGENCY_CASES);
      if (!data) {
        localStorage.setItem(KEYS.EMERGENCY_CASES, JSON.stringify(INITIAL_EMERGENCY_CASES));
        return INITIAL_EMERGENCY_CASES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_EMERGENCY_CASES;
    }
  },

  addEmergencyCase(item: Omit<EmergencyCase, 'id' | 'escalatedAt'> & Partial<EmergencyCase>): EmergencyCase {
    const list = this.getEmergencyCases();
    const newCase: EmergencyCase = {
      ...item,
      id: item.id || `emg-${Date.now()}`,
      escalatedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: item.status || 'NEW',
      priority: item.priority || 'CRITICAL',
      patientId: item.patientId || 'RHB-OD-KLH-9999',
      patientName: item.patientName || 'Emergency Patient',
      age: item.age || 40,
      gender: item.gender || 'Unknown',
      village: item.village || 'Kalahandi',
      warningSigns: item.warningSigns || 'Acute red flag alert',
      symptoms: item.symptoms || 'Severe distress'
    };
    list.unshift(newCase);
    localStorage.setItem(KEYS.EMERGENCY_CASES, JSON.stringify(list));
    this.addAuditLog(`Emergency case created: ${newCase.id} (${newCase.patientName})`, 'Emergency System');
    this.addNotification({
      title: '🚨 New Emergency Escalation',
      body: `Emergency case logged for ${newCase.patientName}. Warning: ${newCase.warningSigns}.`,
      type: 'system'
    });
    return newCase;
  },

  updateEmergencyCaseStatus(caseId: string, status: EmergencyCase['status'], assignedDoctor?: string, notes?: string): EmergencyCase[] {
    const list = this.getEmergencyCases();
    const idx = list.findIndex(c => c.id === caseId);
    if (idx !== -1) {
      list[idx].status = status;
      if (assignedDoctor) list[idx].assignedDoctor = assignedDoctor;
      if (notes) list[idx].notes = notes;
      localStorage.setItem(KEYS.EMERGENCY_CASES, JSON.stringify(list));
      this.addAuditLog(`Emergency case ${caseId} updated to status ${status}`, 'Administrator');
    }
    return list;
  },

  // System Health
  getSystemHealth(): SystemHealthItem[] {
    try {
      const data = localStorage.getItem(KEYS.SYSTEM_HEALTH);
      if (!data) {
        localStorage.setItem(KEYS.SYSTEM_HEALTH, JSON.stringify(INITIAL_SYSTEM_HEALTH));
        return INITIAL_SYSTEM_HEALTH;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SYSTEM_HEALTH;
    }
  },

  updateSystemHealth(serviceName: string, status: SystemHealthItem['status'], latencyMs?: number): SystemHealthItem[] {
    const list = this.getSystemHealth();
    const idx = list.findIndex(s => s.service === serviceName);
    if (idx !== -1) {
      list[idx].status = status;
      if (latencyMs !== undefined) list[idx].latencyMs = latencyMs;
      list[idx].lastChecked = 'Just now';
      localStorage.setItem(KEYS.SYSTEM_HEALTH, JSON.stringify(list));
    }
    return list;
  },

  // Reset all
  resetAll() {
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS));
    localStorage.setItem(KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
    localStorage.setItem(KEYS.TRIAGE, JSON.stringify(INITIAL_TRIAGE_QUEUE));
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(KEYS.METRICS, JSON.stringify(INITIAL_IMPACT_METRICS));
    localStorage.setItem(KEYS.VITALS, JSON.stringify(INITIAL_VITALS));
    localStorage.setItem(KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(INITIAL_PRESCRIPTIONS));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(KEYS.AUDIT, JSON.stringify(INITIAL_AUDIT_LOG));
    localStorage.setItem(KEYS.SPECIALIST_REQUESTS, JSON.stringify(INITIAL_SPECIALIST_REQUESTS));
    localStorage.setItem(KEYS.CARE_JOURNEY, JSON.stringify(INITIAL_CARE_JOURNEY));
    localStorage.setItem(KEYS.FACILITIES, JSON.stringify(INITIAL_FACILITIES));
    localStorage.setItem(KEYS.CONSENTS, JSON.stringify(INITIAL_CONSENTS));
    localStorage.setItem(KEYS.CARE_PLANS, JSON.stringify(INITIAL_CARE_PLANS));
    localStorage.setItem(KEYS.NCD, JSON.stringify(INITIAL_NCD));
    localStorage.setItem(KEYS.TB, JSON.stringify(INITIAL_TB));
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    localStorage.setItem(KEYS.DOCTOR_LEAVES, JSON.stringify(INITIAL_DOCTOR_LEAVES));
    localStorage.setItem(KEYS.PHARMACY_STATUS, JSON.stringify(INITIAL_PHARMACY_STATUS));
    localStorage.setItem(KEYS.SMS_LOGS, JSON.stringify(INITIAL_SMS_LOGS));
    localStorage.setItem(KEYS.LAB_TESTS, JSON.stringify(INITIAL_LAB_TESTS));
    localStorage.setItem(KEYS.LAB_ORDERS, JSON.stringify(INITIAL_LAB_ORDERS));
    localStorage.setItem(KEYS.LAB_SAMPLES, JSON.stringify(INITIAL_LAB_SAMPLES));
    localStorage.setItem(KEYS.MANAGED_USERS, JSON.stringify(INITIAL_MANAGED_USERS));
    localStorage.setItem(KEYS.EMERGENCY_CASES, JSON.stringify(INITIAL_EMERGENCY_CASES));
    localStorage.setItem(KEYS.SYSTEM_HEALTH, JSON.stringify(INITIAL_SYSTEM_HEALTH));
    localStorage.removeItem(KEYS.SESSION);
  }
};

