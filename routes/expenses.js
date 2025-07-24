const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  const result = await db.query('SELECT * FROM expenses');
  res.json(result.rows);
});

router.post('/', authenticateToken, async (req, res) => {
  const { category_id, amount, expense_date, description } = req.body;
  const result = await db.query(
    'INSERT INTO expenses (category_id, amount, expense_date, description) VALUES ($1, $2, $3, $4) RETURNING *',
    [category_id, amount, expense_date, description]
  );
  res.json(result.rows[0]);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { category_id, amount, expense_date, description } = req.body;
  const result = await db.query(
    'UPDATE expenses SET category_id = $1, amount = $2, expense_date = $3, description = $4 WHERE id = $5 RETURNING *',
    [category_id, amount, expense_date, description, id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM expenses WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;
