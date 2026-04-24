from pydantic import BaseModel, Field


class CropRequest(BaseModel):
    N: float = Field(..., ge=0, le=200, description="Nitrogen content")
    P: float = Field(..., ge=0, le=200, description="Phosphorus content")
    K: float = Field(..., ge=0, le=250, description="Potassium content")
    temperature: float = Field(..., ge=-10, le=60)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14)
    rainfall: float = Field(..., ge=0, le=500)


class CropPrediction(BaseModel):
    crop: str
    confidence: float


class CropResponse(BaseModel):
    best_crop: str
    top_recommendations: list[CropPrediction]
