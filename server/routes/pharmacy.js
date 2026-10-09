import { Router } from 'express';
import db from '../db.js';

const router = Router();

// Get inventory
router.get('/inventory', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM pharmacy_inventory ORDER BY name ASC').all();
    return res.json(items);
  } catch (err) {
    console.error('Fetch inventory error:', err);
    return res.status(500).json({ error: 'Failed to fetch pharmacy inventory' });
  }
});

// Update stock
router.patch('/inventory/:id/stock', (req, res) => {
  try {
    const { delta, newQuantity } = req.body;
    const item = db.prepare('SELECT * FROM pharmacy_inventory WHERE id = ?').get(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Medicine not found' });
    }

    let updatedQuantity = item.stock_quantity;
    if (newQuantity !== undefined) {
      updatedQuantity = Number(newQuantity);
    } else if (delta !== undefined) {
      updatedQuantity += Number(delta);
    }

    db.prepare('UPDATE pharmacy_inventory SET stock_quantity = ? WHERE id = ?').run(updatedQuantity, item.id);
    return res.json({ id: item.id, stock_quantity: updatedQuantity });
  } catch (err) {
    console.error('Update stock error:', err);
    return res.status(500).json({ error: 'Failed to update stock quantity' });
  }
});

// Dispense prescription
router.post('/dispense', (req, res) => {
  try {
    const { prescriptionNumber, items = [] } = req.body;

    const dispenseTransaction = db.transaction(() => {
      for (const it of items) {
        if (it.medicineId && it.quantity) {
          db.prepare('UPDATE pharmacy_inventory SET stock_quantity = MAX(0, stock_quantity - ?) WHERE id = ?').run(it.quantity, it.medicineId);
        }
      }

      if (prescriptionNumber) {
        db.prepare("UPDATE prescriptions SET status = 'dispensed' WHERE prescription_number = ?").run(prescriptionNumber);
      }
    });

    dispenseTransaction();

    return res.json({ message: 'Medicines dispensed and inventory synchronized' });
  } catch (err) {
    console.error('Dispense error:', err);
    return res.status(500).json({ error: 'Failed to complete dispense transaction' });
  }
});

export default router;
