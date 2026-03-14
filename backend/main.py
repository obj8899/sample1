"""
CryoGuard – FastAPI Backend
Run: uvicorn main:app --reload --port 8000
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import joblib
import os
import json
from typing import Optional

app = FastAPI(title="CryoGuard API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../model/leak_model.pkl")
IMPORTANCE_PATH = os.path.join(os.path.dirname(__file__), "../model/feature_importances.json")

model = None
feature_importances = {}

@app.on_event("startup")
async def load_model():
    global model, feature_importances
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("✅ Model loaded successfully")
    else:
        print("⚠️  Model not found. Run model/train_model.py first.")
    if os.path.exists(IMPORTANCE_PATH):
        with open(IMPORTANCE_PATH) as f:
            feature_importances = json.load(f)


class PredictionInput(BaseModel):
    equipment_age: float = Field(..., ge=0, le=30, description="Equipment age in years")
    compressor_runtime: float = Field(..., ge=0, le=100, description="Compressor runtime %")
    power_consumption: float = Field(..., ge=0, le=30, description="Power consumption kWh")
    cooling_efficiency: float = Field(..., ge=0, le=100, description="Cooling efficiency %")
    ambient_temp: float = Field(..., ge=-20, le=60, description="Ambient temperature °C")
    maintenance_interval: float = Field(..., ge=0, le=36, description="Maintenance interval months")
    discharge_temp: float = Field(..., ge=20, le=150, description="Discharge temperature °C")


class PredictionOutput(BaseModel):
    leak_probability: float
    risk_score: float
    risk_category: str
    risk_level: int  # 0=low, 1=medium, 2=high
    maintenance_recommendation: str
    energy_inefficiency: float
    compressor_health: float
    feature_contributions: dict
    analytics: dict


def get_risk_category(prob: float):
    if prob < 0.35:
        return "LOW RISK", 0
    elif prob < 0.65:
        return "MEDIUM RISK", 1
    else:
        return "HIGH RISK", 2


def get_recommendation(prob: float, age: float, maintenance: float) -> str:
    if prob > 0.75:
        return "IMMEDIATE ACTION REQUIRED: Schedule emergency maintenance within 24-48 hours. Refrigerant leak detected with high confidence. Isolate system if possible."
    elif prob > 0.5:
        return f"URGENT: Schedule maintenance within 2 weeks. System shows elevated leak risk indicators. Last maintenance {maintenance:.0f} months ago exceeds recommended interval."
    elif prob > 0.3:
        return f"MONITOR: System performing within acceptable parameters. Schedule routine inspection within 30 days. Equipment age of {age:.1f} years warrants closer monitoring."
    else:
        return "OPTIMAL: System operating at peak efficiency. Continue standard maintenance schedule. Next inspection due at regular interval."


@app.get("/")
def health():
    return {"status": "CryoGuard API Online", "model_loaded": model is not None}


@app.post("/predict", response_model=PredictionOutput)
def predict(data: PredictionInput):
    # Fallback to rule-based if model not loaded
    features = np.array([[
        data.equipment_age,
        data.compressor_runtime,
        data.power_consumption,
        data.cooling_efficiency,
        data.ambient_temp,
        data.maintenance_interval,
        data.discharge_temp,
    ]])

    if model is not None:
        prob = float(model.predict_proba(features)[0][1])
    else:
        # Rule-based fallback
        prob = (
            0.25 * (data.equipment_age / 20) +
            0.20 * ((data.compressor_runtime - 40) / 60) +
            0.15 * ((100 - data.cooling_efficiency) / 70) +
            0.15 * ((data.discharge_temp - 40) / 80) +
            0.10 * (data.maintenance_interval / 24) +
            0.10 * ((data.ambient_temp - 15) / 30) +
            0.05 * ((data.power_consumption - 1.5) / 13.5)
        )
        prob = float(np.clip(prob, 0, 1))

    risk_score = round(prob * 100, 1)
    risk_category, risk_level = get_risk_category(prob)
    recommendation = get_recommendation(prob, data.equipment_age, data.maintenance_interval)

    # Derived analytics
    compressor_health = max(0, min(100, 100 - (data.compressor_runtime * 0.4) - (data.equipment_age * 2)))
    energy_inefficiency = max(0, min(100, (100 - data.cooling_efficiency) * 0.8 + prob * 20))

    # Feature contributions (normalized)
    contributions = {
        "Equipment Age": round(data.equipment_age / 20 * 25, 1),
        "Compressor Runtime": round((data.compressor_runtime - 40) / 60 * 20, 1),
        "Cooling Efficiency": round((100 - data.cooling_efficiency) / 70 * 15, 1),
        "Discharge Temperature": round((data.discharge_temp - 40) / 80 * 15, 1),
        "Maintenance Interval": round(data.maintenance_interval / 24 * 10, 1),
        "Ambient Temperature": round((data.ambient_temp - 15) / 30 * 10, 1),
        "Power Consumption": round((data.power_consumption - 1.5) / 13.5 * 5, 1),
    }

    analytics = {
        "monthly_energy_loss_kwh": round(energy_inefficiency * 0.15 * 730, 1),
        "estimated_co2_kg": round(energy_inefficiency * 0.15 * 730 * 0.4, 1),
        "maintenance_cost_risk_usd": round(prob * 15000, 0),
        "system_lifespan_remaining_years": round(max(0, 20 - data.equipment_age) * (1 - prob * 0.5), 1),
        "cooling_performance_index": round(data.cooling_efficiency * (1 - prob * 0.3), 1),
        "pressure_variance_estimate": round(prob * 45 + 5, 1),
    }

    return PredictionOutput(
        leak_probability=round(prob, 4),
        risk_score=risk_score,
        risk_category=risk_category,
        risk_level=risk_level,
        maintenance_recommendation=recommendation,
        energy_inefficiency=round(energy_inefficiency, 1),
        compressor_health=round(compressor_health, 1),
        feature_contributions=contributions,
        analytics=analytics,
    )


@app.get("/buildings")
def get_buildings():
    """Return simulated city buildings with risk data"""
    np.random.seed(123)
    buildings = []
    
    # Mumbai area coordinates
    base_lat, base_lng = 19.076, 72.877
    
    building_types = ["Shopping Mall", "Office Complex", "Data Center", "Hospital", 
                      "Cold Storage", "Hotel", "Industrial Plant", "Residential Tower"]
    
    for i in range(40):
        age = float(np.random.uniform(1, 18))
        efficiency = float(np.random.uniform(35, 95))
        runtime = float(np.random.uniform(45, 98))
        discharge = float(np.random.uniform(45, 115))
        
        prob = (
            0.25 * (age / 18) +
            0.20 * ((runtime - 45) / 53) +
            0.15 * ((100 - efficiency) / 65) +
            0.15 * ((discharge - 45) / 70) +
            np.random.uniform(-0.1, 0.1)
        )
        prob = float(np.clip(prob, 0.02, 0.98))
        
        buildings.append({
            "id": f"BLD-{1000 + i}",
            "name": f"{np.random.choice(building_types)} {chr(65 + i % 26)}",
            "lat": base_lat + float(np.random.uniform(-0.08, 0.08)),
            "lng": base_lng + float(np.random.uniform(-0.08, 0.08)),
            "equipment_age": round(age, 1),
            "leak_probability": round(prob, 3),
            "risk_score": round(prob * 100, 1),
            "risk_level": 0 if prob < 0.35 else (1 if prob < 0.65 else 2),
            "cooling_efficiency": round(efficiency, 1),
            "compressor_runtime": round(runtime, 1),
            "last_maintenance": int(np.random.randint(1, 20)),
            "floors": int(np.random.randint(3, 45)),
        })
    
    return {"buildings": buildings, "total": len(buildings)}
