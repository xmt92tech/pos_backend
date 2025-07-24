const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  const result = await db.query('SELECT * FROM category_type');
  res.json(result.rows);
});

router.post('/', authenticateToken, async (req, res) => {
  const { category_name, category_type, description } = req.body;
  const result = await db.query(
    'INSERT INTO category_type ( category_name, category_type, description) VALUES ($1, $2, $3) RETURNING *',
    [ category_name, category_type, description]
  );
  res.json(result.rows[0]);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { category_name, category_type, description } = req.body;
  const result = await db.query(
    'UPDATE category_type SET category_name = $1, category_type = $2, description = $3 WHERE id = $4 RETURNING *',
    [category_name, category_type, description, id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM category_type WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;
