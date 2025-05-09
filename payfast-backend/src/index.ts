import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { generatePayfastSignature } from './utils/payfast';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import cartRoutes from './routes/cart';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gennessence')
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cart', cartRoutes);

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.send('Gennessence backend is running.');
});

// Create Payfast payment URL (redirect method)
app.post('/api/payfast/create-payment', (req: Request, res: Response) => {
  const { amount, itemName, returnUrl, cancelUrl, notifyUrl } = req.body;
  if (!amount || !itemName || !returnUrl || !cancelUrl || !notifyUrl) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const params: Record<string, string> = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID || '',
    merchant_key: process.env.PAYFAST_MERCHANT_KEY || '',
    amount: Number(amount).toFixed(2),
    item_name: itemName,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
  };
  if (process.env.PAYFAST_PASSPHRASE) {
    params.signature = generatePayfastSignature(params, process.env.PAYFAST_PASSPHRASE);
  } else {
    params.signature = generatePayfastSignature(params);
  }
  const payfastUrl = `https://www.payfast.co.za/eng/process?${new URLSearchParams(params).toString()}`;
  res.json({ url: payfastUrl });
});

// Product catalog upload endpoint
app.post('/api/products/upload', upload.single('file'), (req: Request & { file?: Express.Multer.File }, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  try {
    const csv = req.file.buffer.toString('utf-8');
    const records = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    res.json({ products: records });
  } catch (err) {
    res.status(400).json({ error: 'Invalid CSV file.' });
  }
});

// Payfast notify handler (stub)
app.post('/api/payfast/notify', (req: Request, res: Response) => {
  // In production: validate signature, source IP, update order/payment status
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Gennessence backend listening on port ${PORT}`);
}); 