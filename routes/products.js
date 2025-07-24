const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../authMiddleware');

router.get('/', authenticateToken, async (req, res) => {
  const result = await db.query('SELECT * FROM products');
  res.json(result.rows);
});

router.post('/', authenticateToken, async (req, res) => {
  const { name, price, stock_quantity } = req.body;
  const result = await db.query(
    'INSERT INTO products (name, price, stock_quantity) VALUES ($1, $2, $3) RETURNING *',
    [name, price, stock_quantity]
  );
  res.json(result.rows[0]);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, price, stock_quantity } = req.body;
  const result = await db.query(
    'UPDATE products SET name = $1, price = $2, stock_quantity = $3 WHERE id = $4 RETURNING *',
    [name, price, stock_quantity, id]
  );
  res.json(result.rows[0]);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM products WHERE id = $1', [id]);
  res.sendStatus(204);
});

module.exports = router;
