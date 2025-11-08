import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
from math import sqrt
import pickle
from pathlib import Path

# ✅ Resolve paths
base_dir = Path(__file__).resolve().parent.parent
data_dir = base_dir / 'backend' / 'data'
model_dir = base_dir / 'backend' / 'model'
model_dir.mkdir(exist_ok=True)

# ✅ Load datasets
price_path = data_dir / 'agmarket_prices.csv'
yield_path = data_dir / 'fao_crop_yield.csv'
soil_path = data_dir / 'icar_soil_crop.csv'

# ✅ Validate existence
for path in [price_path, yield_path, soil_path]:
    if not path.exists():
        raise FileNotFoundError(f"❌ Missing required file: {path}")

# ✅ Read CSVs
price_data = pd.read_csv(price_path)
yield_data = pd.read_csv(yield_path)
soil_data = pd.read_csv(soil_path)

# ✅ Clean price data
price_data = price_data.rename(columns={
    'District': 'district',
    'Commodity': 'crop',
    'Modal Price': 'price',
    'Arrival_Date': 'date'
})
price_data['year'] = pd.to_datetime(price_data['date'], errors='coerce', dayfirst=True).dt.year
price_data = price_data[['district', 'crop', 'price', 'year']].dropna()

# ✅ Clean yield data
yield_data = yield_data.rename(columns={
    'State': 'state',
    'Crop': 'crop',
    'Crop_Year': 'year',
    'Yield': 'yield_kg'
})
yield_data = yield_data[['state', 'crop', 'year', 'yield_kg']].dropna()

# ✅ Inject fallback district
yield_data['district'] = 'GENERIC'
price_data['district'] = price_data['district'].fillna('GENERIC')

# ✅ Normalize keys
yield_data['district'] = yield_data['district'].str.strip().str.upper()
price_data['district'] = price_data['district'].str.strip().str.upper()
yield_data['crop'] = yield_data['crop'].str.strip().str.upper()
price_data['crop'] = price_data['crop'].str.strip().str.upper()

# ✅ Merge on district, crop, year
merged = pd.merge(yield_data, price_data, on=['district', 'crop', 'year'], how='inner')

# ✅ Diagnose empty merge
if merged.shape[0] == 0:
    print("❌ Merged dataset is empty.")
    print("🔍 Sample keys from yield data:")
    print(yield_data[['district', 'crop', 'year']].drop_duplicates().head(10))
    print("🔍 Sample keys from price data:")
    print(price_data[['district', 'crop', 'year']].drop_duplicates().head(10))
    raise ValueError("❌ Merged dataset is empty. Check if crop, district, and year values match across files.")

# ✅ Clean and normalize soil data
soil_data = soil_data.rename(columns={'District ': 'district', 'Soil Type': 'soil_type'})
soil_data['district'] = soil_data['district'].str.strip().str.upper()
soil_data['soil_type'] = soil_data['soil_type'].str.strip().str.upper()

# ✅ Inject fallback soil row
soil_data = pd.concat([soil_data, pd.DataFrame([{'district': 'GENERIC', 'soil_type': 'LOAMY'}])], ignore_index=True)

# ✅ Merge soil data
merged = pd.merge(merged, soil_data, on='district', how='left')
merged['soil_type'] = merged['soil_type'].fillna('LOAMY')

# ✅ Encode categorical features
categorical = pd.get_dummies(merged[['crop', 'district', 'soil_type']], drop_first=True)

# ✅ Add numeric features
numeric = merged[['price', 'yield_kg']].copy()

# ✅ Add micronutrients if available
micronutrients = ['Zn %', 'Fe%', 'Cu %', 'Mn %', 'B %', 'S %']
for col in micronutrients:
    if col in merged.columns:
        numeric.loc[:, col] = merged[col]

# ✅ Combine all features
merged_encoded = pd.concat([categorical, numeric], axis=1)

# ✅ Feature scaling
scaler = StandardScaler()
X = merged_encoded.drop('yield_kg', axis=1)
X_scaled = scaler.fit_transform(X)
y = merged_encoded['yield_kg']

# ✅ Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# ✅ Train XGBoost
model = xgb.XGBRegressor(
    n_estimators=1000,
    max_depth=6,
    learning_rate=0.03,
    subsample=0.9,
    colsample_bytree=0.9,
    random_state=42
)

model.fit(X_train, y_train)

# ✅ Evaluate
rmse = sqrt(mean_squared_error(y_test, model.predict(X_test)))
print(f"✅ RMSE: {rmse:.2f} kg")

# ✅ Feature importance
features = X.columns
importance = model.feature_importances_
feature_df = pd.DataFrame({'Feature': features, 'Importance': importance}).sort_values(by='Importance', ascending=False)
print("📊 Top Features:\n", feature_df.head(10))

# ✅ Save model artifacts
with open(model_dir / "xgboost_model.pkl", "wb") as f:
    pickle.dump(model, f)
with open(model_dir / "xgboost_scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
with open(model_dir / "xgboost_features.pkl", "wb") as f:
    pickle.dump(list(features), f)

print("✅ Final model, scaler, and features saved to /model")