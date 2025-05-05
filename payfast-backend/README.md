# Payfast Backend for Gennessence Water

A secure Node.js/Express backend for Payfast payment integration. Designed for Render.com deployment and cross-platform hydration apps.

---

## 📁 Folder Structure
```
payfast-backend/
  ├── src/
  │   ├── index.ts           # Main Express server
  │   └── utils/payfast.ts   # Signature utility
  ├── package.json
  ├── tsconfig.json
  ├── render.yaml            # Render.com deployment config
  ├── .env.example           # Example environment variables
```

---

## ⚡ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/gennessence-app.git
   cd gennessence-app/payfast-backend
   ```
2. **Install dependencies**
   ```bash
   yarn install
   ```
3. **Create your .env file** (see `.env.example`)
   ```env
   PAYFAST_MERCHANT_ID=your_merchant_id
   PAYFAST_MERCHANT_KEY=your_merchant_key
   PAYFAST_PASSPHRASE=your_passphrase # optional
   PORT=8080
   ```
4. **Build and run locally**
   ```bash
   yarn build
   yarn start
   # or for dev: yarn dev
   ```
5. **Test health endpoint**
   ```bash
   curl http://localhost:8080/
   # Should return: Payfast backend is running.
   ```

---

## 🛠️ API Endpoints

### `GET /`
- Health check. Returns a simple message.

### `POST /api/payfast/create-payment`
- **Body:** `{ amount, itemName, returnUrl, cancelUrl, notifyUrl }`
- **Returns:** `{ url: "https://www.payfast.co.za/eng/process?...&signature=..." }`
- **Purpose:** Generates a signed Payfast payment URL for redirect.

### `POST /api/payfast/notify`
- **Body:** Payfast POSTs payment status here.
- **Purpose:** (Stub) In production, validate signature, source IP, and update order/payment status.

---

## 🔑 Environment Variables
- `PAYFAST_MERCHANT_ID` (required)
- `PAYFAST_MERCHANT_KEY` (required)
- `PAYFAST_PASSPHRASE` (optional, if set in Payfast dashboard)
- `PORT` (default: 8080)

---

## 🚀 Deploying to Render.com
1. Push your backend folder to GitHub.
2. Connect your repo to [Render.com](https://render.com/).
3. Render will auto-detect `render.yaml` and set up the service.
4. Set your environment variables in the Render dashboard (never commit secrets).
5. Deploy! Your backend will be live at `https://your-service.onrender.com/`.

---

## 🧪 Example Tests

**Health check:**
```bash
curl https://your-service.onrender.com/
```

**Create payment:**
```bash
curl -X POST https://your-service.onrender.com/api/payfast/create-payment \
  -H "Content-Type: application/json" \
  -d '{"amount": 100, "itemName": "Test Product", "returnUrl": "https://yourapp.com/success", "cancelUrl": "https://yourapp.com/cancel", "notifyUrl": "https://your-backend.com/api/payfast/notify"}'
```

---

## 🔒 Security Notes
- **Never expose your merchant key or passphrase in frontend code.**
- Always use HTTPS for all endpoints.
- Validate all incoming data and Payfast notifications.
- Store secrets in environment variables only.

---

## 📄 License
[MIT](LICENSE) (or your preferred license) 