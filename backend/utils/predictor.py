import numpy as np
import pickle
import pandas as pd
from datetime import datetime
from pathlib import Path

# ✅ Load model artifacts
base_dir = Path(__file__).resolve().parent.parent
model_dir = base_dir / "model"

with open(model_dir / "xgboost_model.pkl", "rb") as f:
    model = pickle.load(f)
with open(model_dir / "xgboost_scaler.pkl", "rb") as f:
    scaler = pickle.load(f)
with open(model_dir / "xgboost_features.pkl", "rb") as f:
    feature_names = pickle.load(f)

# ✅ Mappings
crop_map = {
    1: "WHEAT", 2: "RICE", 3: "MAIZE", 4: "TOMATO", 5: "CHICKPEA",
    6: "GREENGRAM", 7: "SUGARCANE", 8: "COTTON", 9: "MIRCHI"
}
soil_map = {
    1: "ALLUVIAL", 2: "BLACK", 3: "RED", 4: "LATERITE", 5: "ARID",
    6: "SALINE", 7: "PEATY", 8: "FOREST", 9: "SANDY", 10: "SILTY",
    11: "CLAYEY", 12: "LOAMY", 13: "MOUNTAIN", 14: "CALCAREOUS"
}
district_map = {0: "GENERIC"}

def predict_yield(data):
    try:
        crop_type = crop_map.get(int(data.get("crop_id", 0)), "UNKNOWN")
        soil_type = soil_map.get(int(data.get("soil_type_id", 0)), "LOAMY")
        district = district_map.get(int(data.get("location_id", 0)), "GENERIC")
        sowing_date = data.get("sowing_date", "")

        try:
            datetime.strptime(sowing_date, "%Y-%m-%d")
        except ValueError:
            return {"error": "Invalid sowing_date format. Use YYYY-MM-DD."}

        # ✅ Build input dictionary
        input_dict = {name: 0 for name in feature_names}
        input_dict[f"crop_{crop_type}"] = 1
        input_dict[f"district_{district}"] = 1
        input_dict[f"soil_type_{soil_type}"] = 1
        input_dict["price"] = float(data.get("price", 2000))

        # ✅ Convert to DataFrame to preserve feature names
        X_input = pd.DataFrame([input_dict], columns=feature_names)
        X_scaled = scaler.transform(X_input)
        predicted_yield = float(model.predict(X_scaled)[0])
        confidence = 0.85

        base_price = {
            "WHEAT": 2200, "RICE": 2000, "MAIZE": 1800, "TOMATO": 1500,
            "CHICKPEA": 5200, "GREENGRAM": 6000, "SUGARCANE": 8000,
            "COTTON": 47710, "MIRCHI": 10000
        }
        price_per_quintal = base_price.get(crop_type, 2000)
        estimated_price = (predicted_yield / 100) * price_per_quintal

        return {
            "yield": predicted_yield,
            "confidence": confidence,
            "crop_type": crop_type,
            "estimated_price": estimated_price,
            "price_per_quintal": price_per_quintal
        }

    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}