import express from 'express';
import { Order } from '../models/Order';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all orders (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status, paymentStatus, startDate, endDate, sort } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const sortOptions: any = {};
    if (sort === 'date_asc') sortOptions.createdAt = 1;
    if (sort === 'date_desc') sortOptions.createdAt = -1;
    if (sort === 'total_asc') sortOptions.total = 1;
    if (sort === 'total_desc') sortOptions.total = -1;

    const orders = await Order.find(query)
      .sort(sortOptions)
      .populate('user', 'name email')
      .populate('items.product', 'name image price');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get user's orders (authenticated)
router.get('/my-orders', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user?.userId })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image price');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

// Get single order (admin or owner)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name image price');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is admin or order owner
    if (req.user?.role !== 'admin' && order.user._id.toString() !== req.user?.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
});

// Create order (authenticated)
router.post('/', requireAuth, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user?.userId,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Error creating order' });
  }
});

// Update order status (admin only)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, trackingNumber, notes },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Error updating order status' });
  }
});

// Update payment status (admin only)
router.patch('/:id/payment', requireAdmin, async (req, res) => {
  try {
    const { paymentStatus, paymentId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, paymentId },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Error updating payment status' });
  }
});

// Cancel order (admin or owner)
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user is admin or order owner
    if (req.user?.role !== 'admin' && order.user.toString() !== req.user?.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot cancel non-pending order' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: 'Error cancelling order' });
  }
});

// Get order statistics (admin only)
router.get('/stats/overview', requireAdmin, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
        },
      },
    ]);

    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const paymentStats = await Order.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      overview: stats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
      statusBreakdown: statusStats,
      paymentBreakdown: paymentStats,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order statistics' });
  }
});

// Revenue trend (admin only)
router.get('/stats/revenue-trend', requireAdmin, async (req, res) => {
  try {
    const days = 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);

    const trend = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['paid', 'shipped', 'delivered'] },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalRevenue: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching revenue trend' });
  }
});

// Top products (admin only)
router.get('/stats/top-products', requireAdmin, async (req, res) => {
  try {
    const top = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 0,
          productId: '$product._id',
          name: '$product.name',
          image: '$product.image',
          totalSold: 1,
          totalRevenue: 1,
        },
      },
    ]);
    res.json(top);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching top products' });
  }
});

export default router; 