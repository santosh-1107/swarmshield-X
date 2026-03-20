# 🧠 SwarmShield X - Frontend

**AI-powered predictive income protection for gig workers**

A mobile-first fintech application built with React, TypeScript, and Tailwind CSS v4.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📱 Features

### Implemented Screens

| Screen | Description |
|--------|-------------|
| **Login** | Phone number + OTP authentication |
| **Dashboard** | Risk overview, stats grid, weekly activity chart |
| **Map View** | Zone visualization with color-coded risk markers |
| **Payouts** | Claim history, pending claims, claim functionality |
| **Profile** | User stats and policy information |
| **Settings** | Notification toggles, plan management |
| **Support** | FAQs and contact information |
| **Change Plan** | Plan selection and upgrade flow |
| **Payment Method** | Card management, add new payment method |
| **Cancel Policy** | Subscription cancellation with confirmation |
| **Terms of Service** | Full legal terms text |
| **Privacy Policy** | Data handling documentation |

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI framework |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 8.x | Build tool |
| **Tailwind CSS** | 4.x | Styling |
| **Lucide React** | Latest | Icons |

---

## 📂 Project Structure

```
frontend/
├── src/
│   ├── App.tsx          # Main application (all screens)
│   ├── index.css        # Tailwind CSS imports
│   ├── main.tsx         # React entry point
│   └── assets/          # SVG assets
├── public/              # Static assets
├── index.html           # HTML entry
├── vite.config.ts       # Vite configuration with Tailwind
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies
```

---

## 🔒 Adversarial Defense & Anti-Spoofing Strategy

### 🚨 Context

The system operates in a hostile environment where bad actors attempt to exploit the payout mechanism.

**Threat Model:**

| Attack Type | Description |
|-------------|-------------|
| **GPS Spoofing** | Fake location in high-risk zone |
| **Fake Inactivity** | Pretend disruption when actually not working |
| **Coordinated Fraud** | Multiple users colluding to create false consensus |
| **Trigger Manipulation** | Artificially lowering demand to trigger payouts |

### Multi-Layer Defense System

```
Layer 1: Signal Validation (External Data)
├── Weather API confirms event
├── Traffic API confirms disruption
└── Platform API confirms demand drop

Layer 2: Swarm Intelligence (Collective Validation)
├── 60%+ workers affected in zone
├── Geographic distribution of claims
└── Temporal pattern analysis

Layer 3: Behavioral Analysis (Individual Anomaly)
├── Historical claiming pattern
├── Activity velocity change
└── Consistency with work hours

Layer 4: Trust Score (Historical Credibility)
├── User's track record
├── Claim history over time
└── Platform verification status
```

### Fraud Ring Detection

**Detection Signals:**
- **Geographic Clustering:** >5 users claiming within 100m radius
- **Temporal Synchronization:** >10 claims within 2 minutes
- **Behavioral Correlation:** >80% overlap in claim patterns
- **Network Analysis:** Shared device/payment methods

### Trust Score System

| Score Range | Label | Payout Speed | Verification |
|-------------|-------|--------------|--------------|
| 0.9 – 1.0 | Platinum | Instant | Minimal |
| 0.7 – 0.89 | Gold | 5 min | Light |
| 0.5 – 0.69 | Silver | 15 min | Standard |
| 0.3 – 0.49 | Bronze | 1 hour | Enhanced |
| 0.0 – 0.29 | Flagged | Blocked | Manual |

### Why This Works

- **Scalable:** Most fraud caught at Layer 1 (fast, cheap)
- **Manipulation Resistant:** External API validation + swarm intelligence
- **Fair:** Legitimate users get instant payouts, suspicious cases reviewed
- **Transparent:** Clear rejection reasons, appeals process available

---

## 🎨 Design Principles

- **Mobile-first:** Optimized for 420px max-width screens
- **Premium aesthetic:** Apple Wallet / Google Pay level design
- **Card-based layout:** Clean, organized content presentation
- **Responsive spacing:** Consistent padding and margins
- **Gradient accents:** Modern visual hierarchy

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.x",
    "tailwindcss": "^4.x",
    "typescript": "^5.x",
    "vite": "^8.x"
  }
}
```

---

## 🌐 API Reference (Mock)

Currently using mock data. Future integration planned for:

| API | Purpose |
|-----|---------|
| OpenWeatherMap | Weather data |
| IMD (India Meteorology) | Severe weather alerts |
| Swiggy/Zomato APIs | Demand/order data |
| Razorpay/Stripe | Payment processing |

---

## 📞 Support

For questions or issues, please reach out to the development team.

---

**Built with ❤️ for gig workers everywhere**

*SwarmShield X — Predict. Prevent. Protect.*
