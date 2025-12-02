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

for path in [price_path, yield_path, soil_path]:
    if not path.exists():
        raise FileNotFoundError(f"❌ Missing required file: {path}")

price_data = pd.read_csv(price_path)
yield_data = pd.read_csv(yield_path)
soil_data = pd.read_csv(soil_path)

# ✅ Normalize column names
price_data.columns = price_data.columns.str.strip().str.replace(" ", "_").str.lower()
yield_data.columns = yield_data.columns.str.strip().str.replace(" ", "_").str.lower()
soil_data.columns = soil_data.columns.str.strip().str.replace(" ", "_").str.lower()

# ✅ Rename columns
price_data = price_data.rename(columns={
    'modal_price(₹)': 'price',
    'arrival_date': 'date',
    'commodity': 'crop'
})
yield_data = yield_data.rename(columns={
    'crop_year': 'year',
    'yield': 'yield_kg'
})

# ✅ Extract year
price_data['year'] = pd.to_datetime(price_data['date'], errors='coerce', dayfirst=True).dt.year
price_data = price_data[['district', 'crop', 'price', 'year']].dropna()
yield_data = yield_data[['crop', 'year', 'yield_kg']].dropna()

# ✅ Normalize crop names
for df in [yield_data, price_data]:
    df['crop'] = df['crop'].str.strip().str.upper()
crop_corrections = {'TAMATO': 'TOMATO', 'GREEN GRAM': 'GREENGRAM'}
for df in [yield_data, price_data]:
    df['crop'] = df['crop'].replace(crop_corrections)

# ✅ Merge price and yield
merged = pd.merge(yield_data, price_data, on=['crop', 'year'], how='inner')
if merged.empty:
    raise ValueError("❌ Merged dataset is empty. Check crop/year alignment.")

# ✅ Merge soil data
merged['district'] = merged['district'].str.strip().str.upper()
soil_data['district'] = soil_data['district'].str.strip().str.upper()
soil_data['soil_type'] = soil_data['soil_type'].str.strip().str.upper()
soil_data = pd.concat([soil_data, pd.DataFrame([{'district': 'GENERIC', 'soil_type': 'LOAMY'}])], ignore_index=True)
merged = pd.merge(merged, soil_data, on='district', how='left')
merged['soil_type'] = merged['soil_type'].fillna('LOAMY')

# ✅ Encode features
categorical = pd.get_dummies(merged[['crop', 'district', 'soil_type']], drop_first=True)
numeric = merged[['price', 'yield_kg']]
merged_encoded = pd.concat([categorical, numeric], axis=1)

# ✅ Train model
scaler = StandardScaler()
X = merged_encoded.drop('yield_kg', axis=1)
X_scaled = scaler.fit_transform(X)
y = merged_encoded['yield_kg']
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

model = xgb.XGBRegressor(
    n_estimators=1000,
    max_depth=6,
    learning_rate=0.03,
    subsample=0.9,
    colsample_bytree=0.9,
    random_state=42
)
model.fit(X_train, y_train)
rmse = sqrt(mean_squared_error(y_test, model.predict(X_test)))
print(f"✅ RMSE: {rmse:.2f} kg")

# ✅ Save artifacts (XGBoost with save_model, others with pickle)
model.save_model(str(model_dir / "xgboost_model.json"))   # <-- FIXED
with open(model_dir / "xgboost_scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)
with open(model_dir / "xgboost_features.pkl", "wb") as f:
    pickle.dump(list(X.columns), f)

print("✅ Final model, scaler, and features saved to /model")