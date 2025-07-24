const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  const result = await db.query('SELECT * FROM customers');
  res.json(result.rows);
});

router.post('/', authenticateToken, async (req, res) => {
  const { name, phone, email } = req.body;
  const result = await db.query(
    'INSERT INTO customers (name, phone, email) VALUES ($1, $2, $3) RETURNING *',
    [name, phone, email]
  );
  res.json(result.rows[0]);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, phone, email } = req.body;
  const result = await db.query(
    'UPDATE customers SET name = $1, phone = $2, email = $3 WHERE id = $4 RETURNING *',
    [name, phone, email, id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM customers WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;
