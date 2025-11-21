"""
FastAPI Backend for Thermal Guard
Analyzes thermal images using MobileNet model to detect fire risk levels
"""
import os
from pathlib import Path
from typing import Dict, Any
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# TensorFlow/Keras imports
try:
    from tensorflow import keras
except ImportError:
    import keras

from utils import decode_base64_image, preprocess_image, convert_to_pil


# Initialize FastAPI app
app = FastAPI(
    title="Thermal Guard API",
    description="Fire risk detection from thermal images",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_PATH = Path(__file__).parent / "models" / "thermal_mobilenet_model.h5"
CLASSES = ["LOW", "MEDIUM", "HIGH"]
IMAGE_SIZE = (224, 224)

# Global model variable
model = None


def load_model():
    """Load the MobileNet model from disk"""
    global model
    if model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Model file not found at {MODEL_PATH}. "
                "Please ensure thermal_mobilenet_model.h5 is in the models directory."
            )
        model = keras.models.load_model(str(MODEL_PATH))
        print(f"✓ Model loaded successfully from {MODEL_PATH}")
    return model


def map_to_cause_action(risk: str) -> tuple[str, str]:
    """
    Map risk level to likely cause and suggested action
    
    Args:
        risk: Risk level ("LOW", "MEDIUM", "HIGH")
    
    Returns:
        Tuple of (likely_cause, suggested_action)
    """
    risk_mapping = {
        "LOW": {
            "cause": "Normal operating temperature. No anomalies detected.",
            "action": "Continue routine monitoring. No immediate action required."
        },
        "MEDIUM": {
            "cause": "Elevated temperature detected. Possible causes: equipment overload, poor ventilation, or developing hotspot.",
            "action": "Investigate the heat source. Increase monitoring frequency. Check for obstructions or equipment malfunctions. Consider preventive maintenance."
        },
        "HIGH": {
            "cause": "Critical temperature detected. Potential fire hazard. Possible causes: electrical fault, combustion, or severe equipment failure.",
            "action": "IMMEDIATE ACTION REQUIRED: Evacuate the area if safe to do so. Alert emergency services. Activate fire suppression systems. Do not approach the heat source."
        }
    }
    
    info = risk_mapping.get(risk, risk_mapping["LOW"])
    return info["cause"], info["action"]


# Request/Response models
class ImageAnalysisRequest(BaseModel):
    image_base64: str = Field(..., description="Base64 encoded image or data URL")


class ImageAnalysisResponse(BaseModel):
    risk: str = Field(..., description="Risk level: LOW, MEDIUM, or HIGH")
    probabilities: Dict[str, float] = Field(..., description="Probability for each risk class")
    likely_cause: str = Field(..., description="Likely cause of the detected risk level")
    suggested_action: str = Field(..., description="Recommended action to take")
    confidence: float = Field(..., description="Confidence score (0-100) for the prediction")


@app.on_event("startup")
async def startup_event():
    """Load model on application startup"""
    try:
        load_model()
    except FileNotFoundError as e:
        print(f"⚠ Warning: {e}")
        print("The API will start but /analyze_image endpoint will fail until model is available.")


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "service": "Thermal Guard API",
        "status": "running",
        "model_loaded": model is not None,
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_status": "loaded" if model is not None else "not_loaded"
    }


@app.post("/analyze_image", response_model=ImageAnalysisResponse)
async def analyze_image(request: ImageAnalysisRequest) -> ImageAnalysisResponse:
    """
    Analyze thermal image for fire risk detection
    
    Args:
        request: ImageAnalysisRequest containing base64 encoded image
    
    Returns:
        ImageAnalysisResponse with risk level, probabilities, and recommendations
    """
    try:
        # Ensure model is loaded
        current_model = load_model()
        
        # Decode and convert image
        image = convert_to_pil(request.image_base64)
        
        # Preprocess image for model
        processed_image = preprocess_image(image, target_size=IMAGE_SIZE)
        
        # Run prediction
        predictions = current_model.predict(processed_image, verbose=0)
        
        # Get probabilities for each class
        probabilities_array = predictions[0]
        
        # Create probabilities dictionary
        probabilities = {
            class_name: float(prob) 
            for class_name, prob in zip(CLASSES, probabilities_array)
        }
        
        # Get the class with highest probability
        max_prob_index = np.argmax(probabilities_array)
        risk_level = CLASSES[max_prob_index]
        confidence = float(probabilities_array[max_prob_index] * 100)
        
        # Get cause and action
        likely_cause, suggested_action = map_to_cause_action(risk_level)
        
        return ImageAnalysisResponse(
            risk=risk_level,
            probabilities=probabilities,
            likely_cause=likely_cause,
            suggested_action=suggested_action,
            confidence=confidence
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing image: {str(e)}"
        )


if __name__ == "__main__":
    # Get port from environment variable or use default
    port = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Starting Thermal Guard API on port {port}")
    print(f"📍 API Documentation: http://localhost:{port}/docs")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )
