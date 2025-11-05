from flask import Blueprint, request, jsonify
from utils.predictor import predict_yield
import numpy as np
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()
predict_bp = Blueprint('predict', __name__)

@predict_bp.route('/predict-yield', methods=['POST'])
def yield_prediction():
    try:
        data = request.get_json(force=True)
        required_fields = ['crop_id', 'soil_type_id', 'sowing_day']
        missing = [field for field in required_fields if field not in data or data[field] in [None, '']]
        if missing:
            return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

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


@predict_bp.route('/send-email', methods=['POST'])
def send_prediction_email():
    try:
        data = request.get_json(force=True)
        to_email = data.get('email')
        if not to_email:
            return jsonify({'error': 'Missing email'}), 400

        sender = os.getenv("EMAIL_ADDRESS")
        password = os.getenv("EMAIL_PASSWORD")
        host = os.getenv("EMAIL_HOST")
        port = int(os.getenv("EMAIL_PORT"))

        subject = "📊 Your FarmCast Prediction Result"
        body = f"""Hello,

Here is your prediction result:

🌱 Crop: {data.get('cropType')}
🌾 Yield: {data.get('predictedYield')} kg/hectare
✅ Confidence: {float(data.get('confidence')) * 100:.2f}%
💰 Estimated Price: ₹{data.get('estimatedPrice')}
📦 Price per Quintal: ₹{data.get('pricePerQuintal')}

Thank you for using FarmCast!
"""

        msg = MIMEMultipart()
        msg['From'] = sender
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(host, port)
        server.starttls()
        server.login(sender, password)
        server.send_message(msg)
        server.quit()

        print(f"✅ Prediction email sent to {to_email}")
        return jsonify({'success': True})

    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return jsonify({'error': 'Failed to send email'}), 500