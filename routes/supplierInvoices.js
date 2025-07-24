const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Get all invoices with supplier name
router.get('/', authenticateToken, async (req, res) => {
  const result = await db.query(`
    SELECT i.*, s.name AS supplier_name
    FROM supplier_invoices i
    JOIN suppliers s ON i.supplier_id = s.id
    ORDER BY i.id
  `);
  res.json(result.rows);
});

// Create invoice
router.post('/', authenticateToken, async (req, res) => {
  const { supplier_id, amount, issued_date, due_date, description } = req.body;
  const result = await db.query(
    `INSERT INTO supplier_invoices 
     (supplier_id, amount, issued_date, due_date, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [supplier_id, amount, issued_date, due_date, description]
  );
  res.json(result.rows[0]);
});

// Update invoice
router.put('/:id', authenticateToken, async (req, res) => {
  const { supplier_id, amount, issued_date, due_date, description } = req.body;
  const { id } = req.params;
  const result = await db.query(
    `UPDATE supplier_invoices SET
     supplier_id = $1, amount = $2, issued_date = $3, due_date = $4, description = $5
     WHERE id = $6 RETURNING *`,
    [supplier_id, amount, issued_date, due_date, description, id]
  );
  res.json(result.rows[0]);
});

// Delete invoice
router.delete('/:id', authenticateToken, async (req, res) => {
  await db.query('DELETE FROM supplier_invoices WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
