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
  TbTreatmentRecord
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
  INITIAL_TB
} from '../data/mockData';

const KEYS = {
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
  TB: 'swasthya_tb_v3'
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

    if (existingIndex !== -1) {
      const updatedRx: FullPrescription = {
        ...list[existingIndex],
        ...rx,
        id: list[existingIndex].id,
        prescriptionNumber: list[existingIndex].prescriptionNumber,
        date: rx.date || list[existingIndex].date,
        medicines: rx.medicines || list[existingIndex].medicines,
        diagnosisSummary: rx.diagnosisSummary !== undefined ? rx.diagnosisSummary : list[existingIndex].diagnosisSummary,
        followUp: rx.followUp !== undefined ? rx.followUp : list[existingIndex].followUp,
        notes: rx.notes !== undefined ? rx.notes : list[existingIndex].notes,
        digitalSignature: rx.digitalSignature || `Digitally Revised by ${rx.doctorName || list[existingIndex].doctorName} (${new Date().toLocaleDateString('en-GB')})`
      };
      list[existingIndex] = updatedRx;
      localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(list));
      this.addNotification({
        title: 'E-Prescription Updated',
        body: `E-Prescription ${updatedRx.prescriptionNumber} for ${updatedRx.patientName} was revised by ${updatedRx.doctorName}.`,
        type: 'prescription'
      });
      this.addAuditLog(`E-Prescription ${updatedRx.prescriptionNumber} revised by ${updatedRx.doctorName}`, updatedRx.doctorName);
      return updatedRx;
    }

    const newRx: FullPrescription = {
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
      digitalSignature: rx.digitalSignature || 'Digitally Authorized by Licensed Clinician'
    };
    list.unshift(newRx);
    localStorage.setItem(KEYS.PRESCRIPTIONS, JSON.stringify(list));
    this.addNotification({
      title: 'E-Prescription Available',
      body: `Demo notification: E-Prescription ${newRx.prescriptionNumber} has been issued by ${newRx.doctorName}.`,
      type: 'prescription'
    });
    this.addAuditLog(`E-Prescription ${newRx.prescriptionNumber} created`, newRx.doctorName);
    return newRx;
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
  }
};
