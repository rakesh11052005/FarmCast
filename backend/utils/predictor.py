import numpy as np

def predict_yield(data):
    try:
        crop_id = int(data.get("crop_id", 0))
        soil_type_id = int(data.get("soil_type_id", 0))
        location_id = int(data.get("location_id", 0))
        sowing_day = int(data.get("sowing_day", 0))

        crop_map = {
            1: "Wheat",
            2: "Rice",
            3: "Maize",
            4: "Tomato",
            5: "Chickpea",
            6: "Green Gram"
        }
        crop_type = crop_map.get(crop_id, "Unknown")

        base_yield = 1000 + crop_id * 50 + soil_type_id * 30 + location_id * 20
        seasonal_factor = 1 + (sowing_day % 30) / 100.0
        predicted_yield = np.float32(base_yield * seasonal_factor)
        confidence = np.float32(0.85)

        base_price = {
            "Wheat": 2200,
            "Rice": 2000,
            "Maize": 1800,
            "Tomato": 1500,
            "Chickpea": 5200,
            "Green Gram": 6000
        }
        price_per_quintal = base_price.get(crop_type, 2000)
        estimated_price = np.float32((predicted_yield / 100) * price_per_quintal)

        return {
            "yield": predicted_yield,
            "confidence": confidence,
            "crop_type": crop_type,
            "estimated_price": estimated_price,
            "price_per_quintal": price_per_quintal
        }

    except Exception as e:
        print("Error in predictor:", e)
        return {"error": str(e)}