import { Router } from 'express';
import db from '../db.js';

const router = Router();

// List consultations
router.get('/', (req, res) => {
  try {
    const { patient_id, doctor_id } = req.query;
    let query = 'SELECT * FROM consultations ORDER BY created_at DESC';
    let records;

    if (patient_id) {
      records = db.prepare('SELECT * FROM consultations WHERE patient_id = ? ORDER BY created_at DESC').all(patient_id);
    } else if (doctor_id) {
      records = db.prepare('SELECT * FROM consultations WHERE doctor_id = ? ORDER BY created_at DESC').all(doctor_id);
    } else {
      records = db.prepare(query).all();
    }
    return res.json(records);
  } catch (err) {
    console.error('Fetch consultations error:', err);
    return res.status(500).json({ error: 'Failed to fetch consultations' });
  }
});

// Create/Start consultation
router.post('/start', (req, res) => {
  try {
    const {
      roomId = `room-${Date.now()}`,
      doctorId,
      doctorName,
      patientId,
      patientName
    } = req.body;

    const id = `cons-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO consultations (id, room_id, doctor_id, doctor_name, patient_id, patient_name, status, start_time, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'in-progress', ?, ?)
    `).run(id, roomId, doctorId, doctorName, patientId, patientName, now, now);

    return res.status(201).json({ id, roomId, status: 'in-progress', startTime: now });
  } catch (err) {
    console.error('Start consultation error:', err);
    return res.status(500).json({ error: 'Failed to initiate consultation' });
  }
});

// Conclude consultation
router.post('/:id/conclude', (req, res) => {
  try {
    const { durationSeconds = 0, notes = '', followUpPlan = 'Routine monitoring' } = req.body;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE consultations
      SET status = 'completed', end_time = ?, duration_seconds = ?, notes = ?, follow_up_plan = ?
      WHERE id = ? OR room_id = ?
    `).run(now, durationSeconds, notes, followUpPlan, req.params.id, req.params.id);

    return res.json({ message: 'Consultation successfully concluded', status: 'completed' });
  } catch (err) {
    console.error('Conclude consultation error:', err);
    return res.status(500).json({ error: 'Failed to conclude consultation' });
  }
});

export default router;
