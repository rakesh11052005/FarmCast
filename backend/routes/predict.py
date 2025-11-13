from flask import Blueprint, request, jsonify
from utils.predictor import predict_yield
import os, smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()
predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict-yield', methods=['POST'])
def yield_prediction():
    try:
        data = request.get_json(force=True)
        for field in ['crop_id', 'soil_type_id', 'sowing_date']:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing field: {field}'}), 400
        data.setdefault('location_id', 0)
        data.setdefault('price', 2000)

        result = predict_yield(data)
        if "error" in result:
            return jsonify({'error': result['error']}), 500

        return jsonify({k: float(v) if isinstance(v, (float, int)) else v for k, v in result.items()})

    except Exception as e:
        return jsonify({'error': 'Prediction failed'}), 500

@predict_bp.route('/send-email', methods=['POST'])
def send_prediction_email():
    try:
        data = request.get_json(force=True)
        if not data.get('email'):
            return jsonify({'error': 'Missing email'}), 400

        for field in ['crop_id', 'soil_type_id', 'sowing_date']:
            if field not in data or not data[field]:
                return jsonify({'error': f'Missing field: {field}'}), 400
        data.setdefault('location_id', 0)
        data.setdefault('price', 2000)

        result = predict_yield(data)
        if "error" in result:
            return jsonify({'error': result['error']}), 500

        msg = MIMEMultipart()
        msg['From'] = os.getenv("EMAIL_ADDRESS")
        msg['To'] = data['email']
        msg['Subject'] = "📊 Your FarmCast Prediction Result"
        msg.attach(MIMEText(f"""Hello User,

Here is your prediction result:

🌱 Crop: {result['crop_type']}
🌾 Yield: {round(result['yield'], 2)} kg/hectare
✅ Confidence: {result['confidence'] * 100:.2f}%
💰 Estimated Price: ₹{round(result['estimated_price'], 2)}
📦 Price per Quintal: ₹{round(result['price_per_quintal'], 2)}

Thank you for using FarmCast!
""", 'plain'))

        server = smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT")))
        server.starttls()
        server.login(os.getenv("EMAIL_ADDRESS"), os.getenv("EMAIL_PASSWORD"))
        server.send_message(msg)
        server.quit()

        return jsonify({'success': True})

    except Exception as e:
        return jsonify({'error': 'Failed to send email'}), 500