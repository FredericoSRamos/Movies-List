const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [id] = await db('users').insert({ username, password: hashedPassword });
    const token = jwt.sign({ id: id, username: username }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(201).json({ token, userId: id, username: username });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(409).json({ error: 'Nome de usuário já existe.' });
    }
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }

  const user = await db('users').where({ username }).first();
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expira em 1 dia
  });

  res.json({ token, userId: user.id, username: user.username });
});

module.exports = router;