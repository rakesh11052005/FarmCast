import numpy as np
import pickle
from datetime import datetime
from pathlib import Path

# ✅ Resolve correct base directory
base_dir = Path(__file__).resolve().parent.parent
model_dir = base_dir / "model"

model_path = model_dir / "xgboost_model.pkl"
scaler_path = model_dir / "xgboost_scaler.pkl"
features_path = model_dir / "xgboost_features.pkl"

# ✅ Safety check
for path in [model_path, scaler_path, features_path]:
    if not path.exists():
        raise FileNotFoundError(f"❌ Missing model file: {path}")

# ✅ Load model artifacts
with open(model_path, "rb") as f:
    model = pickle.load(f)
with open(scaler_path, "rb") as f:
    scaler = pickle.load(f)
with open(features_path, "rb") as f:
    feature_names = pickle.load(f)

# ✅ Maps for categorical encoding
crop_map = {
    1: "WHEAT", 2: "RICE", 3: "MAIZE", 4: "TOMATO", 5: "CHICKPEA",
    6: "GREENGRAM", 7: "SUGARCANE", 8: "COTTON", 9: "MIRCHI"
}
soil_map = {
    1: "LOAMY", 2: "SANDY", 3: "CLAY", 4: "SILT", 5: "PEAT", 6: "CHALK"
}
district_map = {
    0: "GENERIC", 1: "ANANTAPUR", 2: "CHITTOOR", 3: "GUNTUR", 4: "NELLORE"
}

def predict_yield(data):
    try:
        crop_id = int(data.get("crop_id", 0))
        soil_type_id = int(data.get("soil_type_id", 0))
        location_id = int(data.get("location_id", 0))
        sowing_date_str = data.get("sowing_date", "")

        try:
            sowing_date = datetime.strptime(sowing_date_str, "%Y-%m-%d")
            sowing_day = sowing_date.timetuple().tm_yday
        except ValueError:
            return {"error": "Invalid sowing_date format. Use YYYY-MM-DD."}

        crop_type = crop_map.get(crop_id, "UNKNOWN")
        soil_type = soil_map.get(soil_type_id, "LOAMY")
        district = district_map.get(location_id, "GENERIC")

        # ✅ Build feature vector
        input_dict = {name: 0 for name in feature_names}
        input_dict[f"crop_{crop_type}"] = 1
        input_dict[f"district_{district}"] = 1
        input_dict[f"soil_type_{soil_type}"] = 1

        # ✅ Add numeric features
        input_dict["price"] = float(data.get("price", 2000))
        input_dict["zn_%"] = float(data.get("zn", 70))
        input_dict["fe%"] = float(data.get("fe", 70))
        input_dict["cu_%"] = float(data.get("cu", 70))
        input_dict["mn_%"] = float(data.get("mn", 70))
        input_dict["b_%"] = float(data.get("b", 70))
        input_dict["s_%"] = float(data.get("s", 70))

        # ✅ Prepare input
        X_raw = [input_dict.get(name, 0) for name in feature_names]
        X_scaled = scaler.transform([X_raw])
        predicted_yield = float(model.predict(X_scaled)[0])
        confidence = 0.85

        base_price = {
            "WHEAT": 2200, "RICE": 2000, "MAIZE": 1800, "TOMATO": 1500,
            "CHICKPEA": 5200, "GREENGRAM": 6000, "SUGARCANE": 8000,
            "COTTON": 47710, "MIRCHI": 10000
        }
        price_per_quintal = base_price.get(crop_type, 2000)
        estimated_price = float((predicted_yield / 100) * price_per_quintal)

        return {
            "yield": predicted_yield,
            "confidence": confidence,
            "crop_type": crop_type,
            "estimated_price": estimated_price,
            "price_per_quintal": price_per_quintal
        }

    except Exception as e:
        print("❌ Error in predictor:", e)
        return {"error": f"Prediction failed: {str(e)}"}