<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Thermal Guard - Fire Risk Detection System

AI-powered thermal image analysis for fire risk detection using React + FastAPI + TensorFlow Lite.

View your app in AI Studio: https://ai.studio/apps/drive/1yVvN6JW89AMXDEp1wSqb6hrjtMC5m6wE

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/manuraj04/thermal-guard)
[![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/manuraj04/thermal-guard)

## 🏗️ Architecture

- **Frontend**: React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS (CDN)
- **Backend**: FastAPI 0.121 + TensorFlow 2.20 + TFLite Interpreter
- **Model**: MobileNet TFLite (224x224 input, 3 classes: LOW/MEDIUM/HIGH risk)
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend) or Docker

## 🚀 Run Locally

### Prerequisites
- Node.js 18+ or 20+
- Python 3.12.10 (⚠️ Not 3.14 - TensorFlow not yet compatible)
- pip

### 1. Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```bash
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. Run the frontend:
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

### 2. Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell)**: `.\.venv\Scripts\Activate.ps1`
   - **Windows (CMD)**: `.\.venv\Scripts\activate.bat`
   - **Linux/Mac**: `source .venv/bin/activate`

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Ensure model file exists:
   - Model file: `backend/models/mobilenet_thermal_model.tflite` (should already be present)

6. Run the backend server:
   ```bash
   cd ..
   python backend/main.py
   ```
   
   The API will be available at `http://localhost:8000`
   - API Docs: `http://localhost:8000/docs`
   - Health Check: `http://localhost:8000/health`

## 📁 Project Structure

```
thermal-guard/
├── src/                          # Frontend source
│   ├── components/              # React components
│   │   ├── Navbar.tsx
│   │   └── ui/                  # UI components
│   ├── App.tsx                  # Main app component
│   ├── types.ts                 # TypeScript types
│   └── vite-env.d.ts           # Vite env types
├── backend/                     # Backend API
│   ├── main.py                  # FastAPI application with TFLite
│   ├── utils.py                 # Image processing utilities
│   ├── requirements.txt         # Python dependencies
│   ├── Procfile                # Railway/Heroku deployment
│   └── models/                  # ML models
│       └── mobilenet_thermal_model.tflite
├── package.json
├── vite.config.ts
├── vercel.json                 # Vercel deployment config
├── railway.json                # Railway deployment config
├── render.yaml                 # Render deployment config
├── docker-compose.yml          # Docker orchestration
├── Dockerfile.backend          # Backend container
├── Dockerfile.frontend         # Frontend container
├── DEPLOYMENT.md               # Detailed deployment guide
├── DEPLOYMENT_CHECKLIST.md     # Step-by-step checklist
├── deploy.ps1                  # Windows deployment script
└── README.md
```

## 🚀 Deployment

### Quick Deploy (Recommended)

**Option 1: One-Click Deploy**
- [![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/manuraj04/thermal-guard) for frontend
- [![Deploy to Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/manuraj04/thermal-guard) for backend

**Option 2: Automated Script (Windows)**
```powershell
.\deploy.ps1
```

**Option 3: Docker**
```bash
docker-compose up --build
```

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Deployment Platforms Supported
- ✅ **Vercel** (Frontend) - Recommended, free tier
- ✅ **Railway** (Backend) - Recommended, easy Python deployment
- ✅ **Render** (Full Stack) - Single platform solution
- ✅ **Netlify** (Frontend) - Alternative to Vercel
- ✅ **Docker** (Self-hosted) - Full control
- ✅ **AWS/GCP/Azure** (Enterprise) - Scalable production

## 🔌 API Integration

The frontend connects to the backend via:

**Endpoint**: `POST /analyze_image`

**Request**:
```json
{
  "image_base64": "data:image/png;base64,iVBORw0KG..."
}
```

**Response**:
```json
{
  "risk": "MEDIUM",
  "probabilities": {
    "LOW": 0.15,
    "MEDIUM": 0.72,
    "HIGH": 0.13
  },
  "likely_cause": "Elevated temperature detected...",
  "suggested_action": "Investigate the heat source...",
  "confidence": 72.5
}
```

## 🎯 Features

- 📸 **Camera Capture**: Take thermal images directly from your device
- 📤 **Image Upload**: Upload existing thermal images
- 🤖 **AI Analysis**: Automatic risk level detection (LOW/MEDIUM/HIGH)
- 📊 **Detailed Results**: Confidence scores, likely causes, and action recommendations
- 📜 **History Tracking**: Keep records of all analyses
- ✍️ **Manual Records**: Add manual inspection entries

## 🔧 Development

- Frontend dev server: `npm run dev`
- Backend dev server: `python main.py` (auto-reload enabled)
- Build frontend: `npm run build`
- Preview production build: `npm run preview`

