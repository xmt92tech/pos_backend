const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

// Get all suppliers
router.get('/', authenticateToken, async (req, res) => {
  const result = await db.query('SELECT * FROM suppliers ORDER BY id');
  res.json(result.rows);
});

// Add new supplier
router.post('/', authenticateToken, async (req, res) => {
  const { name, email, contact_info } = req.body;
  const result = await db.query(
    'INSERT INTO suppliers (name, email, contact_info) VALUES ($1, $2, $3) RETURNING *',
    [name, email, contact_info]
  );
  res.json(result.rows[0]);
});

// Update supplier
router.put('/:id', authenticateToken, async (req, res) => {
  const { name, email, contact_info } = req.body;
  const { id } = req.params;
  const result = await db.query(
    'UPDATE suppliers SET name = $1, email = $2, contact_info = $3 WHERE id = $4 RETURNING *',
    [name, email, contact_info, id]
  );
  res.json(result.rows[0]);
});

// Delete supplier
router.delete('/:id', authenticateToken, async (req, res) => {
  await db.query('DELETE FROM suppliers WHERE id = $1', [req.params.id]);
  res.sendStatus(204);
});

module.exports = router;
