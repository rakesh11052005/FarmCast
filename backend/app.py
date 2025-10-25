from flask import Flask
from flask_cors import CORS
from config import Config, db
from routes.auth import auth_bp
from routes.profile import profile_bp
from routes.predict import predict_bp
from models.user import User
from models.farmer import FarmerData
import os
import logging

# ✅ Create Flask app
app = Flask(__name__, instance_relative_config=True)

# ✅ Load config and enable CORS
app.config.from_object(Config)
CORS(app)

# ✅ Initialize SQLAlchemy
db.init_app(app)

# ✅ Register blueprints with prefixes
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(profile_bp, url_prefix='/profile')
app.register_blueprint(predict_bp, url_prefix='/predict')

# ✅ Health check route
@app.route('/')
def home():
    return "✅ FarmCast backend is running."

# ✅ Ensure database tables are created
if __name__ == '__main__':
    os.makedirs(app.instance_path, exist_ok=True)
    logging.basicConfig(level=logging.INFO)
    logging.info("🚀 Starting FarmCast backend...")

    with app.app_context():
        db.create_all()

    app.run(debug=True, host='0.0.0.0', port=5000)