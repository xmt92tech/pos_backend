const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  const result = await db.query('SELECT * FROM orders');
  res.json(result.rows);
});

router.post('/', authenticateToken, async (req, res) => {
  const { customer_id, total } = req.body;
  const result = await db.query(
    'INSERT INTO orders (customer_id, total) VALUES ($1, $2) RETURNING *',
    [customer_id, total]
  );
  res.json(result.rows[0]);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { customer_id, total } = req.body;
  const result = await db.query(
    'UPDATE orders SET customer_id = $1, total = $2 WHERE id = $3 RETURNING *',
    [customer_id, total, id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM orders WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;
