import xgboost as xgb
import numpy as np
import pickle

# Generate dummy training data
X = np.array([
    [1, 2, 101, 120],
    [2, 1, 102, 90],
    [3, 3, 103, 150],
    [1, 2, 104, 110],
    [2, 1, 105, 95]
])
y = np.array([2500, 1800, 3000, 2400, 1900])

# Train model
model = xgb.XGBRegressor()
model.fit(X, y)

# Save model
with open('model/xgboost_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✅ Model trained and saved to model/xgboost_model.pkl")