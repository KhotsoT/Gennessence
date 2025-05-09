import express from 'express';
import Cart from '../models/Cart';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// GET /api/cart - get current user's cart
router.get('/', requireAuth, async (req: any, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      // Create empty cart if none exists
      const newCart = await Cart.create({ user: req.user._id, items: [] });
      return res.json(newCart);
    }
    res.json(cart);
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart - set/update current user's cart
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid cart items format' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = items;
      await cart.save();
    } else {
      cart = await Cart.create({ user: req.user._id, items });
    }
    res.json(cart);
  } catch (err) {
    console.error('Cart update error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// DELETE /api/cart - clear current user's cart
router.delete('/', requireAuth, async (req: any, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Cart clear error:', err);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

export default router; 