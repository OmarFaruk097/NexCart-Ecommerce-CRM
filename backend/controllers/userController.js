const db = require('../config/db');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    await db.initDb();
    const { rows } = await db.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials (user not found)' });
    }

    const user = rows[0];

    // In a real app, you should use bcrypt to compare hashed passwords!
    // For this prototype, we're doing a plain text check.
    if (password === user.password) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: user.token || 'fake-jwt-token-12345',
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials (wrong password)' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  try {
    await db.initDb();
    // Check if user exists
    const { rows: existingUsers } = await db.pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert new user
    // In a real app, hash the password using bcrypt before saving!
    const token = 'fake-jwt-token-' + Date.now();
    const { rows: inserted } = await db.pool.query(
      'INSERT INTO users (name, email, password, token) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, password, token]
    );

    res.status(201).json({
      _id: inserted[0].id,
      name: name,
      email: email,
      token: token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

module.exports = {
  loginUser,
  registerUser
};
