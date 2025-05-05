import express from 'express';
import { User } from '../models/User';
import { requireAdmin } from '../middleware/auth';

const router = express.Router();

// List users (pagination, search, filter)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role, status } = req.query;
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('-password');
    const total = await User.countDocuments(query);
    res.json({ users, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get user details
router.get('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Create user
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role, status, avatar } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const user = new User({ name, email, password, role, status, avatar });
    await user.save();
    res.status(201).json({ ...user.toObject(), password: undefined });
  } catch (error) {
    res.status(400).json({ error: 'Error creating user' });
  }
});

// Update user
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, email, role, status, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, status, avatar },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error updating user' });
  }
});

// Change user role
router.patch('/:id/role', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error updating user role' });
  }
});

// Change user status
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error updating user status' });
  }
});

// Reset user password
router.patch('/:id/password', requireAdmin, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.password = password;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (error) {
    res.status(400).json({ error: 'Error updating password' });
  }
});

// Hard delete user
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

export default router; 