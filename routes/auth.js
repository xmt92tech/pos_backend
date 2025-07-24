const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const result = await db.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hash]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

  if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ token });
});

module.exports = router;
