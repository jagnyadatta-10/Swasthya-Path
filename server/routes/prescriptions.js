import { Router } from 'express';
import db from '../db.js';

const router = Router();

// List prescriptions
router.get('/', (req, res) => {
  try {
    const { patient_id, doctor_id } = req.query;
    let query = 'SELECT * FROM prescriptions ORDER BY created_at DESC';
    let records;

    if (patient_id) {
      records = db.prepare('SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY created_at DESC').all(patient_id);
    } else if (doctor_id) {
      records = db.prepare('SELECT * FROM prescriptions WHERE doctor_id = ? ORDER BY created_at DESC').all(doctor_id);
    } else {
      records = db.prepare(query).all();
    }

    const parsed = records.map((r) => ({
      ...r,
      medicines: JSON.parse(r.medicines_json || '[]')
    }));

    return res.json(parsed);
  } catch (err) {
    console.error('Fetch prescriptions error:', err);
    return res.status(500).json({ error: 'Failed to fetch prescriptions' });
  }
});

// Get single prescription by ID or Number
router.get('/:id', (req, res) => {
  try {
    const record = db.prepare('SELECT * FROM prescriptions WHERE id = ? OR prescription_number = ?').get(req.params.id, req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    return res.json({
      ...record,
      medicines: JSON.parse(record.medicines_json || '[]')
    });
  } catch (err) {
    console.error('Fetch single prescription error:', err);
    return res.status(500).json({ error: 'Error fetching prescription' });
  }
});

// Create/Authorize new prescription
router.post('/', (req, res) => {
  try {
    const {
      id = `rx-KLH-${Date.now()}`,
      prescriptionNumber = `RX-KLH-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId,
      patientName,
      doctorId,
      doctorName,
      doctorHospital,
      date = new Date().toLocaleDateString('en-GB'),
      diagnosisSummary,
      medicines = [],
      followUp,
      notes,
      digitalSignature,
      status = 'finalized',
      syncStatus = 'synced'
    } = req.body;

    if (!patientId || !doctorId || !diagnosisSummary) {
      return res.status(400).json({ error: 'patientId, doctorId, and diagnosisSummary are required' });
    }

    const now = new Date().toISOString();

    const insert = db.prepare(`
      INSERT INTO prescriptions (
        id, prescription_number, patient_id, patient_name, doctor_id, doctor_name, doctor_hospital,
        date, diagnosis_summary, medicines_json, follow_up, notes, digital_signature, status, sync_status, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(prescription_number) DO UPDATE SET
        diagnosis_summary = excluded.diagnosis_summary,
        medicines_json = excluded.medicines_json,
        notes = excluded.notes,
        status = excluded.status,
        sync_status = excluded.sync_status
    `);

    insert.run(
      id,
      prescriptionNumber,
      patientId,
      patientName || 'Patient',
      doctorId,
      doctorName || 'Doctor',
      doctorHospital || 'District Hospital Kalahandi',
      date,
      diagnosisSummary,
      JSON.stringify(medicines),
      followUp || 'In 3 days',
      notes || '',
      digitalSignature || `Digitally Authorized by Dr. ${doctorName}`,
      status,
      syncStatus,
      now
    );

    // Record audit log
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, action, details, ip_address, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      `aud-${Date.now()}`,
      doctorId,
      doctorName,
      'PRESCRIPTION_ISSUED',
      `Issued Rx ${prescriptionNumber} for patient ${patientName}: ${diagnosisSummary}`,
      req.ip || '127.0.0.1',
      now
    );

    return res.status(201).json({
      message: 'Prescription saved and synchronized successfully',
      prescription: {
        id,
        prescriptionNumber,
        patientId,
        patientName,
        doctorId,
        doctorName,
        doctorHospital,
        date,
        diagnosisSummary,
        medicines,
        followUp,
        notes,
        digitalSignature,
        status,
        syncStatus,
        createdAt: now
      }
    });
  } catch (err) {
    console.error('Save prescription error:', err);
    return res.status(500).json({ error: 'Failed to issue prescription' });
  }
});

export default router;
