from flask import Blueprint, request, jsonify
from models.farmer import FarmerData
from models.user import User
from config import db
from sqlalchemy import func
import json

profile_bp = Blueprint('profile', __name__)

# ✅ GET profile by email
@profile_bp.route('/get-profile', methods=['GET'])
def get_profile():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    print(f"🔍 Fetching profile for: {email}")
    farmer = FarmerData.query.filter(func.lower(FarmerData.Email) == email.lower()).first()
    user = User.query.filter(func.lower(User.email) == email.lower()).first()  # ✅ FIXED

    if not farmer and not user:
        print(f"❌ No user found with email: {email}")
        return jsonify({'error': 'User not found'}), 404

    source = farmer or user
    print(f"✅ Profile fetched for: {source.Name if farmer else source.name}")
    return jsonify({
        'name': source.Name if farmer else source.name,
        'email': source.Email if farmer else source.email,
        'location': getattr(source, 'Location', '') or '',
        'crop': getattr(source, 'Crop', '') or '',
        'lastPrediction': getattr(source, 'LastPrediction', '') or '',
        'field_size': getattr(source, 'FieldSize', 0),
        'latitude': getattr(source, 'Latitude', 0),
        'longitude': getattr(source, 'Longitude', 0)
    })

# ✅ UPDATE profile by email
@profile_bp.route('/update-profile', methods=['PUT'])
def update_profile():
    data = request.get_json(force=True)
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    farmer = FarmerData.query.filter(func.lower(FarmerData.Email) == email.lower()).first()
    user = User.query.filter(func.lower(User.email) == email.lower()).first()  # ✅ FIXED

    if not farmer and not user:
        print(f"❌ No user found for update: {email}")
        return jsonify({'error': 'User not found'}), 404

    try:
        for target in [farmer, user]:
            if target:
                if 'name' in data:
                    if hasattr(target, 'Name'):
                        target.Name = data['name']
                    elif hasattr(target, 'name'):
                        target.name = data['name']
                target.FieldSize = float(data.get('field_size', 0))
                target.Latitude = float(data.get('latitude', 0))
                target.Longitude = float(data.get('longitude', 0))

        db.session.commit()
        print(f"✅ Updated: {email}, Name={data.get('name')}, FieldSize={data.get('field_size')}, Lat={data.get('latitude')}, Long={data.get('longitude')}")
        return jsonify({'message': 'Profile updated successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"❌ Update failed: {e}")
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

# ✅ DELETE account by email
@profile_bp.route('/delete-account', methods=['DELETE'])
def delete_account():
    try:
        data = json.loads(request.data)
        email = data.get('email')
        if not email:
            return jsonify({'error': 'Email is required'}), 400

        farmer = FarmerData.query.filter(func.lower(FarmerData.Email) == email.lower()).first()
        user = User.query.filter(func.lower(User.email) == email.lower()).first()  # ✅ FIXED

        if not farmer and not user:
            print(f"❌ No user found in either table for deletion: {email}")
            return jsonify({'error': 'User not found'}), 404

        if farmer:
            db.session.delete(farmer)
            print(f"🗑️ Deleted from FarmerData: {farmer.Email}")
        if user:
            db.session.delete(user)
            print(f"🗑️ Deleted from User: {user.email}")

        db.session.commit()
        return jsonify({'message': 'Account deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"❌ Deletion failed: {e}")
        return jsonify({'error': f'Failed to delete account: {str(e)}'}), 500

# ✅ DEBUG all farmer names
@profile_bp.route('/debug-all', methods=['GET'])
def debug_all():
    farmers = FarmerData.query.all()
    return jsonify([f.Name for f in farmers])