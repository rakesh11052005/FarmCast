from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.predictor import predict_yield
import numpy as np

app = Flask(__name__)
CORS(app)

# ✅ In-memory user store
users = {}

@app.route('/', methods=['GET'])
def home():
    return "✅ FarmCast backend is running."

@app.route('/predict-yield', methods=['POST'])
def yield_prediction():
    try:
        data = request.get_json()
        print("✅ Received data:", data)

        result = predict_yield(data)

        # Ensure result is a dict and convert float32 values
        if isinstance(result, dict):
            clean_result = {
                k: float(v) if isinstance(v, (np.float32, np.float64)) else v
                for k, v in result.items()
            }
            return jsonify(clean_result)

        # If result is a single float
        return jsonify({'yield': float(result)})

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    if email in users:
        return jsonify({'error': 'User already exists'}), 400
    users[email] = {
        'name': data.get('name'),
        'password': data.get('password')
    }
    return jsonify({'message': 'Registration successful'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users.get(data.get('email'))
    if not user or user['password'] != data.get('password'):
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({'message': 'Login successful', 'name': user['name']})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)