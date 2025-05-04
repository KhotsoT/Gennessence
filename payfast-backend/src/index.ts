import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generatePayfastSignature } from './utils/payfast';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req: Request, res: Response) => {
  res.send('Payfast backend is running.');
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

// Payfast notify handler (stub)
app.post('/api/payfast/notify', (req: Request, res: Response) => {
  // In production: validate signature, source IP, update order/payment status
  console.log('Payfast notify received:', req.body);
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Payfast backend listening on port ${PORT}`);
}); 