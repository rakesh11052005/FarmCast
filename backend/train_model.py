import pandas as pd
import xgboost as xgb
from sklearn.ensemble import RandomForestRegressor, StackingRegressor
from sklearn.linear_model import Ridge
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error
from math import sqrt
import pickle
from pathlib import Path

base_dir = Path(__file__).resolve().parent.parent
data_dir = base_dir / 'backend' / 'data'
model_dir = base_dir / 'backend' / 'model'
model_dir.mkdir(exist_ok=True)

def load_csv(path):
    if not path.exists():
        raise FileNotFoundError(f"❌ Missing file: {path}")
    return pd.read_csv(path)

def clean_columns(df):
    return df.rename(columns=lambda x: x.strip().replace(" ", "_").lower())

price_data = clean_columns(load_csv(data_dir / 'agmarket_prices.csv'))
yield_data = clean_columns(load_csv(data_dir / 'fao_crop_yield.csv'))
soil_data = clean_columns(load_csv(data_dir / 'icar_soil_crop.csv'))

price_data = price_data.rename(columns={'modal_price(₹)': 'price', 'arrival_date': 'date', 'commodity': 'crop'})
yield_data = yield_data.rename(columns={'crop_year': 'year', 'yield': 'yield_kg'})

price_data['year'] = pd.to_datetime(price_data['date'], errors='coerce', dayfirst=True).dt.year
price_data = price_data[['district', 'crop', 'price', 'year']].dropna()
yield_data = yield_data[['crop', 'year', 'yield_kg']].dropna()

for df in [yield_data, price_data]:
    df['crop'] = df['crop'].str.strip().str.upper().replace({'TAMATO': 'TOMATO', 'GREEN GRAM': 'GREENGRAM'})

soil_data['district'] = soil_data['district'].str.strip().str.upper()
soil_data['soil_type'] = soil_data['soil_type'].str.strip().str.upper()
soil_data = pd.concat([soil_data, pd.DataFrame([{'district': 'GENERIC', 'soil_type': 'LOAMY'}])], ignore_index=True)

merged = pd.merge(yield_data, price_data, on=['crop', 'year'], how='inner')
merged['district'] = merged['district'].str.strip().str.upper()
merged = pd.merge(merged, soil_data, on='district', how='left')
merged['soil_type'] = merged['soil_type'].fillna('LOAMY')

districts = merged['district'].unique()
for district in districts:
    subset = merged[merged['district'] == district]
    if len(subset) < 10:
        print(f"⚠️ Skipping {district}: not enough data")
        continue

    categorical = pd.get_dummies(subset[['crop', 'soil_type']], drop_first=True)
    numeric = subset[['price', 'yield_kg']]
    encoded = pd.concat([categorical, numeric], axis=1)

    X = encoded.drop('yield_kg', axis=1)
    y = encoded['yield_kg']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('model', StackingRegressor(
            estimators=[
                ('xgb', xgb.XGBRegressor(n_estimators=300, max_depth=6, learning_rate=0.05, random_state=42)),
                ('rf', RandomForestRegressor(n_estimators=200, max_depth=8, random_state=42))
            ],
            final_estimator=Ridge()
        ))
    ])

    pipeline.fit(X_train, y_train)
    y_pred = pipeline.predict(X_test)
    rmse = sqrt(mean_squared_error(y_test, y_pred))
    print(f"✅ {district}: RMSE = {rmse:.2f} kg")

    booster = pipeline.named_steps['model'].estimators_[0]
    importance = pd.Series(booster.feature_importances_, index=X.columns)
    top_features = importance.sort_values(ascending=False).head(5)
    print(f"📊 Top features for {district}:\n{top_features}\n")

    # ✅ Attach RMSE to model for plotting
    pipeline.named_steps['model'].rmse_ = rmse

    district_dir = model_dir / district.replace(" ", "_")
    district_dir.mkdir(exist_ok=True)

    with open(district_dir / "model.pkl", "wb") as f:
        pickle.dump(pipeline.named_steps['model'], f)
    with open(district_dir / "scaler.pkl", "wb") as f:
        pickle.dump(pipeline.named_steps['scaler'], f)
    with open(district_dir / "features.pkl", "wb") as f:
        pickle.dump(list(X.columns), f)