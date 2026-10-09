import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get lab orders
router.get('/orders', (req, res) => {
  try {
    const { patient_id, status } = req.query;
    let query = 'SELECT * FROM lab_orders';
    const params = [];

    if (patient_id && status) {
      query += ' WHERE patient_id = ? AND status = ?';
      params.push(patient_id, status);
    } else if (patient_id) {
      query += ' WHERE patient_id = ?';
      params.push(patient_id);
    } else if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const records = db.prepare(query).all(...params);

    const parsed = records.map((r) => ({
      ...r,
      parameters: JSON.parse(r.parameters_json || '[]')
    }));

    return res.json(parsed);
  } catch (err) {
    console.error('Fetch lab orders error:', err);
    return res.status(500).json({ error: 'Failed to fetch lab orders' });
  }
});

// Create lab order
router.post('/orders', (req, res) => {
  try {
    const {
      patientId,
      patientName,
      doctorId,
      doctorName,
      testId,
      testName,
      sampleType,
      priority = 'routine'
    } = req.body;

    const id = `lab-ord-${Date.now()}`;
    const orderNumber = `LAB-KLH-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const barcode = `BC-KLH-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO lab_orders (
        id, order_number, patient_id, patient_name, doctor_id, doctor_name,
        test_id, test_name, sample_type, priority, status, collection_status, barcode, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ordered', 'pending', ?, ?)
    `).run(id, orderNumber, patientId, patientName, doctorId, doctorName, testId, testName, sampleType, priority, barcode, now);

    return res.status(201).json({
      message: 'Lab order generated',
      order: { id, orderNumber, barcode, status: 'ordered', collection_status: 'pending' }
    });
  } catch (err) {
    console.error('Create lab order error:', err);
    return res.status(500).json({ error: 'Failed to create lab test order' });
  }
});

// Update order status & release report
router.patch('/orders/:id', (req, res) => {
  try {
    const { status, collectionStatus, reportSummary, parameters } = req.body;

    const existing = db.prepare('SELECT * FROM lab_orders WHERE id = ? OR order_number = ?').get(req.params.id, req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Lab order not found' });
    }

    db.prepare(`
      UPDATE lab_orders
      SET status = COALESCE(?, status),
          collection_status = COALESCE(?, collection_status),
          report_summary = COALESCE(?, report_summary),
          parameters_json = COALESCE(?, parameters_json)
      WHERE id = ?
    `).run(
      status || null,
      collectionStatus || null,
      reportSummary || null,
      parameters ? JSON.stringify(parameters) : null,
      existing.id
    );

    return res.json({ message: 'Lab order updated successfully' });
  } catch (err) {
    console.error('Update lab order error:', err);
    return res.status(500).json({ error: 'Failed to update lab order' });
  }
});

export default router;
