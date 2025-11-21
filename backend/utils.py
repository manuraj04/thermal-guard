"""
Utility functions for image processing and preprocessing
"""
import base64
import re
from io import BytesIO
from typing import Any
import numpy as np


def decode_base64_image(image_data: str) -> Any:
    """
    Decode base64 string or data URL to PIL Image
    
    Args:
        image_data: Base64 string or data URL (e.g., "data:image/png;base64,...")
    
    Returns:
        PIL Image object
    """
    from PIL import Image
    # Check if it's a data URL and extract the base64 part
    if image_data.startswith('data:'):
        # Match pattern: data:image/[type];base64,[base64string]
        match = re.match(r'data:image/\w+;base64,(.+)', image_data)
        if match:
            image_data = match.group(1)
    
    # Decode base64 string
    image_bytes = base64.b64decode(image_data)
    
    # Convert to PIL Image
    image = Image.open(BytesIO(image_bytes))
    
    return image

def preprocess_image(image: Any, target_size: tuple = (224, 224)) -> np.ndarray:
    """
    Preprocess PIL Image for MobileNet model input
    
    Args:
        image: PIL Image object
        target_size: Target size for the model (width, height)
    
    Returns:
        Preprocessed numpy array ready for model prediction
    """
    from PIL import Image
    # Convert to RGB if necessary (in case of RGBA or grayscale)
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to target size
    image = image.resize(target_size, Image.Resampling.LANCZOS)
    
    # Convert to numpy array
    img_array = np.array(image, dtype=np.float32)
    
    # Normalize pixel values to [0, 1] range (MobileNet preprocessing)
    img_array = img_array / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array
    return img_array
def convert_to_pil(image_data: str) -> Any:
    """
    Convenience function to convert base64/data URL directly to PIL Image
    
    Args:
        image_data: Base64 string or data URL
    
    Returns:
        PIL Image object
    """
    return decode_base64_image(image_data)
