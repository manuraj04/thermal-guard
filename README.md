<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Thermal Guard - Fire Risk Detection System

AI-powered thermal image analysis for fire risk detection using React + FastAPI + TensorFlow.

View your app in AI Studio: https://ai.studio/apps/drive/1yVvN6JW89AMXDEp1wSqb6hrjtMC5m6wE

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + TensorFlow/Keras + MobileNet
- **Model**: Thermal image classification (LOW/MEDIUM/HIGH risk)

## 🚀 Run Locally

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- pip

### 1. Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key
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
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell)**: `.\venv\Scripts\Activate.ps1`
   - **Windows (CMD)**: `.\venv\Scripts\activate.bat`
   - **Linux/Mac**: `source venv/bin/activate`

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Place your trained model file:
   - Add `thermal_mobilenet_model.h5` to `backend/models/`

6. Run the backend server:
   ```bash
   python main.py
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
│   ├── main.py                  # FastAPI application
│   ├── utils.py                 # Image processing utilities
│   ├── requirements.txt         # Python dependencies
│   └── models/                  # ML models
│       └── thermal_mobilenet_model.h5
├── package.json
├── vite.config.ts
└── README.md
```

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

