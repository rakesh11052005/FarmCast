import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
import pickle
import time

# ✅ Step 1: Load datasets
agmarknet = pd.read_csv('data/agmarknet_prices.csv')
icar = pd.read_csv('data/icar_soil_crop.csv')
fao = pd.read_csv('data/fao_crop_yield.csv')

# ✅ Step 2: Clean and rename columns
agmarknet.rename(columns={'Commodity': 'crop', 'State': 'region', 'Year': 'year'}, inplace=True)
icar.rename(columns={'Crop': 'crop', 'Region': 'region'}, inplace=True)
fao = fao[fao['Country'] == 'India']
fao['yield_kg'] = fao['Production'] / fao['Area']
fao.rename(columns={'Crop': 'crop', 'Year': 'year'}, inplace=True)

# ✅ Step 3: Merge datasets
merged = pd.merge(fao, icar, on=['crop', 'region'], how='inner')
merged = pd.merge(merged, agmarknet, on=['crop', 'region', 'year'], how='inner')

# ✅ Step 4: Encode categorical features
merged_encoded = pd.get_dummies(merged[['crop', 'region', 'soil_type']], drop_first=True)

# ✅ Step 5: Add numeric features
merged_encoded['price'] = merged['AveragePrice']
merged_encoded['yield_kg'] = merged['yield_kg']

# ✅ Step 6: Feature scaling
scaler = StandardScaler()
X = merged_encoded.drop('yield_kg', axis=1)
X_scaled = scaler.fit_transform(X)
y = merged_encoded['yield_kg']

# ✅ Step 7: Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# ✅ Step 8: Train XGBoost with early stopping
model = xgb.XGBRegressor(
    n_estimators=1000,
    max_depth=6,
    learning_rate=0.03,
    subsample=0.9,
    colsample_bytree=0.9,
    random_state=42
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    early_stopping_rounds=30,
    verbose=False
)

# ✅ Step 9: Evaluate model
y_pred = model.predict(X_test)
rmse = mean_squared_error(y_test, y_pred, squared=False)
print(f"✅ RMSE: {rmse:.2f} kg")

# ✅ Step 10: Feature importance
importance = model.feature_importances_
features = X.columns
feature_df = pd.DataFrame({'Feature': features, 'Importance': importance}).sort_values(by='Importance', ascending=False)
print("📊 Top Features:\n", feature_df.head(10))

# ✅ Step 11: Save model with timestamp
timestamp = time.strftime("%Y%m%d-%H%M%S")
model_path = f"model/xgboost_model_{timestamp}.pkl"
with open(model_path, 'wb') as f:
    pickle.dump(model, f)

print(f"✅ Final model saved to {model_path}")