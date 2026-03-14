# ❄️ CryoGuard – AI Refrigerant Leak Prediction System

> A futuristic AI infrastructure intelligence platform that predicts refrigerant leaks before they occur.

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Python 3.9+**
- **Node.js 18+**
- **npm** or **yarn**

---

## 1️⃣ Train the AI Model

```bash
cd model
pip install scikit-learn numpy joblib
python train_model.py
```

This generates `model/leak_model.pkl` and `model/feature_importances.json`.

---

## 2️⃣ Start the FastAPI Backend

```bash
cd backend
pip install fastapi uvicorn scikit-learn numpy joblib pydantic
# Or: pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

✅ API runs at: `http://localhost:8000`  
📖 Docs at: `http://localhost:8000/docs`

**Endpoints:**
- `GET /` — Health check
- `POST /predict` — AI leak prediction
- `GET /buildings` — City building risk data

---

## 3️⃣ Start the Next.js Frontend

```bash
cd frontend
npm install
npm run dev
```

✅ App runs at: `http://localhost:3000`

> **Note:** If the backend isn't running, the frontend automatically falls back to a built-in client-side model — the demo works either way!

---

## 📁 Project Structure

```
cryoguard/
├── model/
│   ├── train_model.py          # Random Forest training script
│   ├── leak_model.pkl          # Trained model (generated)
│   └── feature_importances.json
│
├── backend/
│   ├── main.py                 # FastAPI application
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx        # Main page orchestrator
    │   │   ├── layout.tsx      # Root layout + fonts
    │   │   └── globals.css     # Global styles + animations
    │   ├── components/
    │   │   ├── Preloader.tsx   # Cinematic loading screen
    │   │   ├── Nav.tsx         # Sticky navigation
    │   │   ├── Hero.tsx        # Animated city skyline hero
    │   │   ├── ProblemSection.tsx  # Problem + AI pipeline viz
    │   │   ├── PredictionForm.tsx  # Interactive input form
    │   │   ├── Dashboard.tsx   # Animated analytics dashboard
    │   │   ├── CityMap.tsx     # Leaflet city risk map
    │   │   ├── ImpactSection.tsx   # Animated counters
    │   │   └── Footer.tsx
    │   └── lib/
    │       └── api.ts          # API client + mock fallback
    ├── package.json
    ├── tailwind.config.js
    ├── next.config.js
    └── tsconfig.json
```

---

## 🧠 AI Model Details

**Algorithm:** Random Forest Classifier (200 trees, max_depth=10)

**Input Features (7 parameters):**

| Feature | Range | Weight |
|---------|-------|--------|
| Equipment Age | 0–25 years | 25% |
| Compressor Runtime | 0–100% | 20% |
| Cooling Efficiency | 10–100% | 15% |
| Discharge Temperature | 30–130°C | 15% |
| Maintenance Interval | 1–30 months | 10% |
| Ambient Temperature | -10–55°C | 10% |
| Power Consumption | 0.5–20 kWh | 5% |

**Output:**
- Leak probability score (0–100%)
- Risk category: LOW / MEDIUM / HIGH
- Maintenance recommendation
- Feature contribution breakdown
- Analytics (energy loss, CO₂ impact, cost risk)

**Training:** 5,000 synthetic samples with realistic correlations  
**Accuracy:** ~91% on held-out test set

---

## 🎨 UI Features

- **Cinematic Preloader** — Animated network graph + progress bar
- **Hero Section** — Parallax city skyline with floating particles
- **Problem Section** — Animated stat cards + AI pipeline visualization
- **Prediction Form** — Interactive sliders with real-time input, AI loading screen
- **Analytics Dashboard** — Radial gauges, bar charts, radar chart, line trends
- **City Risk Map** — Leaflet map with color-coded building markers (dark theme)
- **Impact Section** — Animated counters from 0 → target value

---

## 🔧 Environment Variables

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Map | Leaflet + React-Leaflet |
| Backend | FastAPI + Python |
| ML Model | Scikit-learn Random Forest |
| Fonts | Rajdhani, JetBrains Mono, DM Sans |

---

## 🏆 Hackathon Demo Tips

1. Start with the **preloader** — it sets the atmosphere
2. Scroll through the **problem section** for context
3. Demo the **prediction form** with a high-risk scenario:
   - Equipment Age: 15 years
   - Compressor Runtime: 92%
   - Cooling Efficiency: 45%
   - Discharge Temp: 98°C
   - Maintenance Interval: 18 months
4. Show the **animated dashboard** appearing with gauges
5. Click buildings on the **city map** to show real-time risk
6. End on the **impact section** with animated counters

---

*Built for the Climate Tech Hackathon — CryoGuard AI*
