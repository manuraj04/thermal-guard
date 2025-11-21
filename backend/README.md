# Thermal Guard Backend

FastAPI backend for analyzing thermal images using MobileNet deep learning model.

## Setup

1. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment**:
   - Windows (PowerShell):
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - Windows (CMD):
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Place your model file**:
   - Ensure `mobilenet_thermal_model.tflite` is in the `models/` directory

## Running the Server

```bash
python main.py
```

Or with custom port:
```bash
PORT=8080 python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

### `POST /analyze_image`

Analyze a thermal image for fire risk detection.

**Request Body**:
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

### `GET /`
Health check and API information

### `GET /health`
Detailed health status including model loading status

### `GET /docs`
Interactive API documentation (Swagger UI)

### `GET /redoc`
Alternative API documentation (ReDoc)

## Risk Levels

- **LOW**: Normal operating temperature, no action needed
- **MEDIUM**: Elevated temperature, investigation recommended
- **HIGH**: Critical temperature, immediate action required

## Architecture

- **FastAPI**: Modern, fast web framework
- **TensorFlow/Keras**: Deep learning model inference
- **TensorFlow Lite**: Lightweight model format for efficient inference
- **MobileNet**: Lightweight CNN architecture (224x224 input)
- **PIL/Pillow**: Image processing
- **NumPy**: Array operations

## File Structure

```
backend/
├── main.py              # FastAPI application
├── utils.py             # Image processing utilities
├── requirements.txt     # Python dependencies
├── models/
│   └── mobilenet_thermal_model.tflite  # TFLite model
└── README.md           # This file
```

## Notes

- The model expects 224x224 RGB images
- Images are automatically resized and normalized
- CORS is enabled for all origins (configure for production)
- The API runs on `0.0.0.0` to accept connections from any interface
