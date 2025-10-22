from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.predictor import predict_yield
import numpy as np
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# ✅ In-memory user store
users = {}

def send_confirmation_email(to_email, name):
    try:
        sender = os.getenv("EMAIL_ADDRESS")
        password = os.getenv("EMAIL_PASSWORD")
        subject = "✅ FarmCast Registration Successful"
        body = f"Hello {name},\n\nThank you for registering with FarmCast. Your account has been created successfully.\n\nRegards,\nFarmCast Team"

        msg = MIMEMultipart()
        msg['From'] = sender
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT")))
        server.starttls()
        server.login(sender, password)
        server.send_message(msg)
        server.quit()
        print(f"✅ Confirmation email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

@app.route('/', methods=['GET'])
def home():
    return "✅ FarmCast backend is running."

@app.route('/predict-yield', methods=['POST'])
def yield_prediction():
    try:
        data = request.get_json()
        print("✅ Received data:", data)

        result = predict_yield(data)

        if isinstance(result, dict):
            clean_result = {
                k: float(v) if isinstance(v, (np.float32, np.float64)) else v
                for k, v in result.items()
            }
            return jsonify(clean_result)

        return jsonify({'yield': float(result)})

    except Exception as e:
        print("❌ Error during prediction:", e)
        return jsonify({'error': str(e)}), 500

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email format'}), 400
    if not name or not name.strip():
        return jsonify({'error': 'Name cannot be empty'}), 400
    if not password or len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400
    if email in users:
        return jsonify({'error': 'User already exists'}), 400

    users[email] = {
        'name': name,
        'password': password
    }

    send_confirmation_email(email, name)

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