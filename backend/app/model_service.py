from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = BASE_DIR / "data" / "Crop_recommendation.csv"
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "crop_rf_model.joblib"
FEATURES = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
TARGET = "label"


class CropModelService:
    def __init__(self) -> None:
        self.model = None
        self.features = FEATURES

    def load_or_train(self) -> None:
        MODELS_DIR.mkdir(parents=True, exist_ok=True)

        if MODEL_PATH.exists():
            self.model = joblib.load(MODEL_PATH)
            return

        if not DATA_PATH.exists():
            raise FileNotFoundError(
                f"Dataset not found at {DATA_PATH}. Add Crop_recommendation.csv to backend/data/."
            )

        df = pd.read_csv(DATA_PATH)
        x = df[FEATURES]
        y = df[TARGET]

        x_train, _, y_train, _ = train_test_split(
            x, y, test_size=0.25, random_state=42, stratify=y
        )

        model = RandomForestClassifier(
            n_estimators=300,
            max_depth=None,
            min_samples_split=2,
            min_samples_leaf=1,
            random_state=42,
            n_jobs=-1,
        )
        model.fit(x_train, y_train)
        joblib.dump(model, MODEL_PATH)
        self.model = model

    def predict_top_k(self, payload: dict[str, float], k: int = 3) -> tuple[str, list[dict[str, float | str]]]:
        if self.model is None:
            self.load_or_train()

        row = np.array([[payload[f] for f in FEATURES]], dtype=float)
        probabilities = self.model.predict_proba(row)[0]
        classes = self.model.classes_

        top_indices = np.argsort(probabilities)[::-1][:k]
        top_results: list[dict[str, float | str]] = []
        for idx in top_indices:
            top_results.append(
                {
                    "crop": str(classes[idx]),
                    "confidence": round(float(probabilities[idx]), 4),
                }
            )

        best_crop = top_results[0]["crop"]
        return best_crop, top_results
