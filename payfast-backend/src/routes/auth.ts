import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Register new user (admin only)
router.post('/register', requireAdmin, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    const user = new User({
      email,
      password,
      name,
      role: role || 'user',
    });

    await user.save();

    res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is inactive.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: 'Error logging in.' });
  }
});

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user?.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching user.' });
  }
});

// Get all users (admin only)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching users.' });
  }
});

// Update user status (admin only)
router.patch('/users/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error updating user status.' });
  }
});

export default router; 