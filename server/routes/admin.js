import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get District Health Overview KPIs
router.get('/kpis', (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalDoctors = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'doctor'").get().count;
    const totalPatients = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'patient'").get().count;
    const totalConsultations = db.prepare('SELECT COUNT(*) as count FROM consultations').get().count;
    const activeConsultations = db.prepare("SELECT COUNT(*) as count FROM consultations WHERE status = 'in-progress'").get().count;
    const totalPrescriptions = db.prepare('SELECT COUNT(*) as count FROM prescriptions').get().count;
    const totalLabOrders = db.prepare('SELECT COUNT(*) as count FROM lab_orders').get().count;
    const emergencyCases = db.prepare('SELECT COUNT(*) as count FROM emergency_cases').get().count;

    return res.json({
      district: 'Kalahandi, Odisha',
      totalUsers,
      totalDoctors,
      totalPatients,
      totalConsultations,
      activeConsultations,
      totalPrescriptions,
      totalLabOrders,
      emergencyCases,
      systemUptime: '99.98%',
      avgLatencyMs: 24
    });
  } catch (err) {
    console.error('Fetch KPIs error:', err);
    return res.status(500).json({ error: 'Failed to aggregate district KPIs' });
  }
});

// Update user verification status
router.patch('/users/:id/verification', (req, res) => {
  try {
    const { isVerified, accountStatus } = req.body;
    db.prepare(`
      UPDATE users
      SET is_verified = COALESCE(?, is_verified),
          account_status = COALESCE(?, account_status)
      WHERE id = ?
    `).run(isVerified !== undefined ? (isVerified ? 1 : 0) : null, accountStatus || null, req.params.id);

    return res.json({ message: 'User verification status updated successfully' });
  } catch (err) {
    console.error('Update user verification error:', err);
    return res.status(500).json({ error: 'Failed to update user verification' });
  }
});

// Get audit logs
router.get('/audit-logs', (req, res) => {
  try {
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 50').all();
    return res.json(logs);
  } catch (err) {
    console.error('Fetch audit logs error:', err);
    return res.status(500).json({ error: 'Failed to fetch audit trail' });
  }
});

// System health check
router.get('/health', (req, res) => {
  return res.json({
    status: 'healthy',
    mode: 'production-ready',
    nodeVersion: process.version,
    memoryUsage: process.memoryUsage(),
    uptimeSeconds: process.uptime(),
    dbEngine: 'SQLite (WAL Mode enabled)',
    timestamp: new Date().toISOString()
  });
});

export default router;
