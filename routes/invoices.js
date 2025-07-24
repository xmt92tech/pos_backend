const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Customer invoices
router.get('/', authenticateToken, async (req, res) => {
  const result = await db.query('SELECT * FROM customer_invoices');
  res.json(result.rows);
});

// Create invoice
router.post('/', authenticateToken, async (req, res) => {
  const { customer_id, amount, issued_date, due_date, description } = req.body;
  const result = await db.query(
    'INSERT INTO customer_invoices (customer_id, amount, issued_date, due_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [customer_id, amount, issued_date, due_date, description]
  );
  res.json(result.rows[0]);
});

// Update invoice
router.put('/:id', authenticateToken, async (req, res) => {
  const { amount, issued_date, due_date, description } = req.body;
  const { id } = req.params;
  const result = await db.query(
    `UPDATE customer_invoices SET
     amount = $1, issued_date = $2, due_date = $3, description = $4
     WHERE id = $5 RETURNING *`,
    [amount, issued_date, due_date, description, id]
  );
  res.json(result.rows[0]);
});

// Delete invoice
router.delete('/:id', authenticateToken, async (req, res) => {
  await db.query('DELETE FROM customer_invoices WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
