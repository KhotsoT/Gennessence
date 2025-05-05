# Gennessence Water App

A luxury, cross-platform hydration and premium water brand experience.

---

## ✨ Project Vision
Gennessence Water is a modern, luxury hydration companion for discerning users. Track your daily water plan, discover the benefits of premium pH-balanced waters, and shop with confidence—all in a pixel-perfect, mobile-first app designed for web, Android, and iOS.

---

## 🚀 Features
- **Personalized Hydration Plan:**
  - 8-step daily schedule, dynamic and interactive
  - Progress tracking, streaks, and missed glass reminders
- **Luxury Product Benefits:**
  - Beautiful, color-coded cards for each water type (by pH)
  - 5+ benefits per product, with luxury/lifestyle focus
- **Modern Cart & Checkout:**
  - Add products, view cart, and prepare for seamless checkout
- **Dynamic Daily Tips:**
  - Rotating hydration tips, quotes, and streak encouragement
- **FAQ & Guidance:**
  - Expert hydration advice, meal/medication alignment, and more
- **Buy Grid:**
  - Quick access to all water types for purchase
- **Responsive, Cross-Platform:**
  - Works on web, Android, and iOS (via Capacitor)
  - Consistent, luxury UI/UX everywhere
- **Payfast-Ready:**
  - Architecture prepared for secure Payfast payment integration

## 👑 Admin Features
- **Secure Admin Portal:**
  - JWT-based authentication
  - Role-based access control
  - Luxury, responsive admin dashboard
- **Product Management:**
  - CRUD operations for all water products
  - Bulk upload via CSV
  - Image management
  - Real-time inventory tracking
- **Order Management:**
  - View and manage all orders
  - Status updates (pending, paid, shipped, delivered)
  - Order details and history
  - Export order data
- **User Management:**
  - View and manage user accounts
  - Role management
  - User activity tracking
- **Analytics Dashboard:**
  - Sales metrics and trends
  - Product performance
  - User growth and engagement
  - Custom date range reports
- **System Settings:**
  - Environment configuration
  - Payment gateway settings
  - System logs and monitoring

---

## 🛠️ Tech Stack
- **React** (with Vite for fast builds)
- **styled-components** (luxury, maintainable styling)
- **React Router** (SPA navigation)
- **Capacitor** (native Android/iOS builds, device APIs)
- **Yarn** (dependency management)
- **No Expo, No Tailwind** (per project requirements)

---

## ⚡ Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/gennessence-app.git
cd gennessence-app
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Run the App (Web)
```bash
yarn dev
```

### 4. Build for Production
```bash
yarn build
```

### 5. Run on Android/iOS (via Capacitor)
```bash
yarn build
npx cap sync
npx cap open android   # or npx cap open ios
```

---

## 📱 Deployment
- **Web:** Deploy the `dist/` folder to Vercel, Netlify, or your preferred host.
- **Android/iOS:** Use Capacitor to build and deploy to Google Play and App Store. See [Capacitor docs](https://capacitorjs.com/docs) for details.

---

## 💳 Payfast Integration (South Africa)
- **Status:** Placeholder (integration-ready)
- **Next Steps:**
  1. Register for a Payfast merchant account
  2. Obtain sandbox credentials
  3. Implement secure payment form and server-side verification
  4. Use [Payfast docs](https://developers.payfast.co.za/docs#introduction) for REST API or redirect integration
  5. Test in sandbox, then switch to production keys
- **Security:** Never expose secret keys in the frontend. Use a secure backend for payment verification.
- **Note:** The app is architected for easy Payfast integration—see `/src/services/payfast.ts` (to be created) for scaffolding.

---

## 🤝 Contributing
Pull requests are welcome! Please:
- Fork the repo
- Create a feature branch
- Follow code style and cross-platform guidelines
- Submit a clear PR description

---

## 📄 License
[MIT](LICENSE) (or your preferred license)

---

## 📬 Contact
- **Brand:** Gennessence Water
- **Email:** [your@email.com](mailto:your@email.com)
- **Instagram:** [@gennessencewater](https://instagram.com/gennessencewater)

---

> Designed for a new era of hydration. Luxury, science, and wellness—every sip, every day.
