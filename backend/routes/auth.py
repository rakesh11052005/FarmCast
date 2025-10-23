from flask import Blueprint, request, jsonify
from models.user import User
from models.farmer import FarmerData
from config import db
from utils.emailer import send_confirmation_email
import re

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    # ✅ Validate inputs
    if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email format'}), 400
    if not name or not name.strip():
        return jsonify({'error': 'Name cannot be empty'}), 400
    if not password or len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    # ✅ Check for existing user
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'User already exists'}), 400

    try:
        # ✅ Create user
        new_user = User(email=email, name=name, password=password)
        db.session.add(new_user)

        # ✅ Create matching FarmerData record
        new_farmer = FarmerData(Name=name, Email=email, Password=password)
        db.session.add(new_farmer)

        db.session.commit()
        print(f"✅ Registered: {name}, {email}")

        send_confirmation_email(email, name)
        return jsonify({'message': 'Registration successful'})
    except Exception as e:
        db.session.rollback()
        print(f"❌ Registration failed: {e}")
        return jsonify({'error': 'Registration failed. Please try again.'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    if not user or user.password != data.get('password'):
        return jsonify({'error': 'Invalid credentials'}), 401

    print(f"✅ Login: {user.name}, {user.email}")
    return jsonify({
        'message': 'Login successful',
        'name': user.name,
        'email': user.email
    })