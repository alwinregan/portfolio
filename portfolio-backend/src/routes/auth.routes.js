const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

router.post('/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { username: user.username, sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    res.json({ success: true, data: {
      access_token: token,
      user: { id: user._id, username: user.username, role: user.role },
    }});
  } catch (err) {
    next(err);
  }
});

router.post('/auth/register', async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, role: role || 'user' });
    res.status(201).json({ success: true, data: {
      message: 'User created successfully',
      user: { id: user._id, username: user.username, role: user.role },
    }});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
