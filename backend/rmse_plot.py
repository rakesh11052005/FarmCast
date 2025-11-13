import os
import pickle
import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path

# ✅ Set model directory
model_dir = Path(__file__).resolve().parent / "model"
rmse_data = []

# ✅ Loop through each district folder
for district_folder in model_dir.iterdir():
    if not district_folder.is_dir():
        continue
    try:
        with open(district_folder / "model.pkl", "rb") as f:
            model = pickle.load(f)
        rmse = getattr(model, "rmse_", None)
        if rmse is not None:
            rmse_data.append((district_folder.name, rmse))
    except Exception as e:
        print(f"⚠️ Error reading {district_folder.name}: {e}")

# ✅ Create DataFrame
df = pd.DataFrame(rmse_data, columns=["District", "RMSE"])
df = df.sort_values("RMSE")

# ✅ Plot
plt.figure(figsize=(12, 6))
plt.barh(df["District"], df["RMSE"], color="skyblue")
plt.xlabel("RMSE (kg/hectare)")
plt.title("RMSE by District Model")  # No emoji to avoid font warnings
plt.tight_layout()
plt.savefig("rmse_by_district.png")
plt.show()