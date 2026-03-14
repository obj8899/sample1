"""
CryoGuard – Refrigerant Leak Prediction Model
Trains a Random Forest classifier on synthetic refrigeration data.
Run: python train_model.py
"""
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import json

np.random.seed(42)
N = 5000

# Feature generation with realistic correlations
equipment_age = np.random.uniform(0, 20, N)
compressor_runtime = np.random.uniform(40, 100, N)
power_consumption = np.random.uniform(1.5, 15, N)
cooling_efficiency = np.random.uniform(30, 100, N)
ambient_temp = np.random.uniform(15, 45, N)
maintenance_interval = np.random.uniform(1, 24, N)
discharge_temp = np.random.uniform(40, 120, N)

# Leak probability based on realistic logic
leak_score = (
    0.25 * (equipment_age / 20)
    + 0.20 * ((compressor_runtime - 40) / 60)
    + 0.15 * ((100 - cooling_efficiency) / 70)
    + 0.15 * ((discharge_temp - 40) / 80)
    + 0.10 * (maintenance_interval / 24)
    + 0.10 * ((ambient_temp - 15) / 30)
    + 0.05 * ((power_consumption - 1.5) / 13.5)
)

noise = np.random.normal(0, 0.08, N)
leak_score = np.clip(leak_score + noise, 0, 1)
labels = (leak_score > 0.5).astype(int)

X = np.column_stack([
    equipment_age, compressor_runtime, power_consumption,
    cooling_efficiency, ambient_temp, maintenance_interval, discharge_temp
])
y = labels

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestClassifier(
        n_estimators=200,
        max_depth=10,
        min_samples_split=5,
        random_state=42,
        n_jobs=-1
    ))
])

pipeline.fit(X_train, y_train)

print("=== CryoGuard Model Training Complete ===")
print(classification_report(y_test, pipeline.predict(X_test)))

joblib.dump(pipeline, 'leak_model.pkl')
print("Model saved to leak_model.pkl")

# Save feature importances
importances = pipeline.named_steps['model'].feature_importances_
feature_names = [
    'equipment_age', 'compressor_runtime', 'power_consumption',
    'cooling_efficiency', 'ambient_temp', 'maintenance_interval', 'discharge_temp'
]
importance_dict = dict(zip(feature_names, importances.tolist()))
with open('feature_importances.json', 'w') as f:
    json.dump(importance_dict, f, indent=2)
print("Feature importances saved.")
