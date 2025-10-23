from flask import Blueprint, request, jsonify
from utils.predictor import predict_yield
import numpy as np

predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict-yield', methods=['POST'])
def yield_prediction():
    try:
        data = request.get_json(force=True)

        # ✅ Validate required fields for predictor.py
        required_fields = ['crop_id', 'soil_type_id', 'sowing_day']
        missing = [field for field in required_fields if field not in data or data[field] in [None, '']]
        if missing:
            return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

        # ✅ Add default location_id if not provided
        if 'location_id' not in data:
            data['location_id'] = 0

        result = predict_yield(data)

        if "error" in result:
            return jsonify({'error': result['error']}), 500

        clean_result = {
            k: float(v) if isinstance(v, (np.float32, np.float64)) else v
            for k, v in result.items()
        }
        return jsonify(clean_result)

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({'error': 'Prediction failed. Please check inputs or try again.'}), 500