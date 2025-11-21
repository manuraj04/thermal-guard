"""
Utility functions for image decoding and preprocessing for TFLite MobileNet
"""

import base64
import re
from io import BytesIO
from typing import Tuple
import numpy as np
from PIL import Image


def decode_base64_image(image_data: str) -> Image.Image:
    """
    Decode base64 string or data URL to PIL Image.

    Args:
        image_data (str): Base64 string or data URL like "data:image/jpeg;base64,..."

    Returns:
        PIL.Image object in RGB mode
    """
    # If it's a data URL, remove the header
    if image_data.startswith("data:"):
        match = re.match(r"data:image\/\w+;base64,(.+)", image_data)
        if match:
            image_data = match.group(1)

    # Decode base64 → raw bytes
    image_bytes = base64.b64decode(image_data)

    # Convert to PIL Image
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    return image


def convert_to_pil(image_data: str) -> Image.Image:
    """
    Alias for decode_base64_image for easier use in main.py
    """
    return decode_base64_image(image_data)


def preprocess_image(
    image: Image.Image,
    target_size: Tuple[int, int] = (224, 224),
    normalize: bool = True
) -> np.ndarray:
    """
    Preprocess a PIL Image for TFLite MobileNet.

    Args:
        image: PIL.Image in RGB
        target_size: (width, height)
        normalize: If True → float32 normalized [0,1]

    Returns:
        NumPy array of shape (1, H, W, 3)
    """
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Resize using high-quality resampling
    image = image.resize(target_size, Image.Resampling.LANCZOS)

    arr = np.asarray(image).astype("float32")

    if normalize:
        arr = arr / 255.0  # float32 normalized

    arr = np.expand_dims(arr, axis=0)  # shape: (1, H, W, 3)
    return arr
