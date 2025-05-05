import express from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { Product } from '../models/Product';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { search, status, sort } = req.query;
    const query: any = {};

    if (search) {
      query.$text = { $search: search as string };
    }

    if (status) {
      query.status = status;
    }

    const sortOptions: any = {};
    if (sort === 'price_asc') sortOptions.price = 1;
    if (sort === 'price_desc') sortOptions.price = -1;
    if (sort === 'ph_asc') sortOptions.ph = 1;
    if (sort === 'ph_desc') sortOptions.ph = -1;

    const products = await Product.find(query).sort(sortOptions);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Create product (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error creating product' });
  }
});

// Update product (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: 'Error updating product' });
  }
});

// Delete product (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// Import products from CSV (admin only)
router.post('/import', requireAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const csv = req.file.buffer.toString('utf-8');
    const records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const products = await Promise.all(
      records.map(async (record: any) => {
        const product = new Product({
          name: record.name,
          description: record.description,
          ph: parseFloat(record.ph),
          size: parseInt(record.size),
          price: parseFloat(record.price),
          image: record.image,
          benefits: record.benefits.split(',').map((b: string) => b.trim()),
          stock: parseInt(record.stock),
          status: record.status || 'active',
        });
        return product.save();
      })
    );

    res.status(201).json({ message: `${products.length} products imported successfully` });
  } catch (error) {
    res.status(400).json({ error: 'Error importing products' });
  }
});

// Export products to CSV (admin only)
router.get('/export/csv', requireAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    const csv = products.map(product => ({
      name: product.name,
      description: product.description,
      ph: product.ph,
      size: product.size,
      price: product.price,
      image: product.image,
      benefits: product.benefits.join(','),
      stock: product.stock,
      status: product.status,
    }));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Error exporting products' });
  }
});

export default router; 