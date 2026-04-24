# Hybrid Farm Support System

This repository contains a complete full-stack crop recommendation system for the Hybrid Farm Support System:

- A machine learning notebook and dataset
- A FastAPI backend that predicts crops from soil/weather inputs
- A React frontend for user-friendly prediction

The app takes the following inputs:

- `N` (Nitrogen)
- `P` (Phosphorus)
- `K` (Potassium)
- `temperature`
- `humidity`
- `ph`
- `rainfall`

And returns:

- Best recommended crop
- Top 3 crop recommendations with confidence

## Repository Structure

```text
Hybrid Farm Support System/
|-- backend/
|   |-- app/
|   |   |-- main.py
|   |   |-- model_service.py
|   |   |-- schemas.py
|   |   `-- __init__.py
|   |-- data/
|   |   `-- Crop_recommendation.csv
|   |-- models/
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|-- notebooks/
|   `-- Crop_Recommendation_Testing_Final.ipynb
|-- .gitignore
`-- README.md
```

## Prerequisites

Install these before running:

1. Python 3.10+
2. Node.js 18+ and npm
3. Git

## 1) Clone the Repository

```bash
git clone https://github.com/dikshantahlawat/B.Tech_Project.git
cd B.Tech_Project
```

## 2) Run Backend (FastAPI)

Open terminal 1:

```bash
cd backend
python -m venv .venv
```

Activate environment:

- Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

- Windows CMD:

```cmd
.venv\Scripts\activate.bat
```

- macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start backend server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend URLs:

- API base: `http://127.0.0.1:8000`
- Health check: `http://127.0.0.1:8000/health`
- Swagger docs: `http://127.0.0.1:8000/docs`

Note:

- On first startup, the backend auto-trains and saves a RandomForest model from `backend/data/Crop_recommendation.csv` if no saved model is found.

## 3) Run Frontend (React + Vite)

Open terminal 2:

```bash
cd frontend
npm install
```

Create `.env` file in `frontend/` (optional, default already points to localhost):

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Run frontend:

```bash
npm run dev
```

Open:

- `http://127.0.0.1:5173`

## 4) Use the Web App

1. Enter values for N, P, K, temperature, humidity, ph, and rainfall.
2. Click `Get Recommendation`.
3. View:
	 - Best crop
	 - Top 3 crops with confidence bars

## 5) Notebook

Notebook is included at:

- `notebooks/Crop_Recommendation_Testing_Final.ipynb`

Open this notebook in Jupyter/VS Code to review EDA, model experiments, and tuning work.

## API Example

### Request

`POST /predict`

```json
{
	"N": 90,
	"P": 42,
	"K": 43,
	"temperature": 20.8,
	"humidity": 82,
	"ph": 6.5,
	"rainfall": 202
}
```

### Response

```json
{
	"best_crop": "rice",
	"top_recommendations": [
		{
			"crop": "rice",
			"confidence": 0.93
		},
		{
			"crop": "maize",
			"confidence": 0.04
		},
		{
			"crop": "jute",
			"confidence": 0.02
		}
	]
}
```

## Troubleshooting

1. `ModuleNotFoundError` in backend:
	 - Activate virtual environment
	 - Run `pip install -r backend/requirements.txt`

2. Frontend cannot reach backend:
	 - Ensure backend is running on port `8000`
	 - Ensure `VITE_API_BASE_URL` points to backend URL

3. CORS issues:
	 - Backend already enables CORS for development (`allow_origins=["*"]`)

## Future Improvements

- User authentication for saved predictions
- Deployment with Docker and cloud hosting
- Better explainability dashboard for feature impact
- Periodic retraining pipeline