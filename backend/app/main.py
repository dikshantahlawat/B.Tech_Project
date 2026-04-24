from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .model_service import CropModelService
from .schemas import CropRequest, CropResponse


app = FastAPI(
    title="Crop Recommendation API",
    version="1.0.0",
    description="Predicts the best crop from soil and weather inputs.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_service = CropModelService()


@app.on_event("startup")
def startup_event() -> None:
    model_service.load_or_train()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict", response_model=CropResponse)
def predict_crop(payload: CropRequest) -> CropResponse:
    best_crop, top_recommendations = model_service.predict_top_k(payload.model_dump(), k=3)
    return CropResponse(best_crop=best_crop, top_recommendations=top_recommendations)


@app.get("/model-info")
def model_info() -> dict[str, object]:
    return {
        "model": "RandomForestClassifier",
        "features": ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"],
        "notes": "Model is auto-trained from backend/data/Crop_recommendation.csv if no saved model exists.",
    }
