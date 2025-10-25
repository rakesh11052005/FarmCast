from flask import Blueprint, request, jsonify
from models.farmer import FarmerData
from models.user import User  # ✅ Import User model
from config import db
from sqlalchemy import func
import json

profile_bp = Blueprint('profile', __name__)

# ✅ GET profile by name (case-insensitive)
@profile_bp.route('/get-profile', methods=['GET'])
def get_profile():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400

    print(f"🔍 Fetching profile for: {name}")
    user = FarmerData.query.filter(func.lower(FarmerData.Name) == name.lower()).first()

    if not user:
        print(f"❌ No user found with name: {name}")
        return jsonify({'error': 'User not found'}), 404

    print(f"✅ Profile fetched for: {user.Name}")
    return jsonify({
        'name': user.Name,
        'email': user.Email or '',
        'location': getattr(user, 'Location', '') or '',
        'crop': getattr(user, 'Crop', '') or '',
        'lastPrediction': getattr(user, 'LastPrediction', '') or '',
        'field_size': user.FieldSize or 0,
        'latitude': user.Latitude or 0,
        'longitude': user.Longitude or 0
    })

# ✅ UPDATE profile fields
@profile_bp.route('/update-profile', methods=['PUT'])
def update_profile():
    data = request.get_json(force=True)
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    user = FarmerData.query.filter(func.lower(FarmerData.Name) == name.lower()).first()
    if not user:
        print(f"❌ No user found for update: {name}")
        return jsonify({'error': 'User not found'}), 404

    try:
        user.FieldSize = float(data.get('field_size', 0))
        user.Latitude = float(data.get('latitude', 0))
        user.Longitude = float(data.get('longitude', 0))

        db.session.commit()
        print(f"✅ Updated: {user.Name}, FieldSize={user.FieldSize}, Lat={user.Latitude}, Long={user.Longitude}")
        return jsonify({'message': 'Profile updated successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"❌ Update failed: {e}")
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

# ✅ DELETE account from both FarmerData and User tables
@profile_bp.route('/delete-account', methods=['DELETE'])
def delete_account():
    try:
        data = json.loads(request.data)
        name = data.get('name')

        if not name:
            return jsonify({'error': 'Name is required'}), 400

        farmer = FarmerData.query.filter(func.lower(FarmerData.Name) == name.lower()).first()
        user = User.query.filter(func.lower(User.name) == name.lower()).first()

        if not farmer and not user:
            print(f"❌ No user found in either table for deletion: {name}")
            return jsonify({'error': 'User not found'}), 404

        if farmer:
            db.session.delete(farmer)
            print(f"🗑️ Deleted from FarmerData: {farmer.Name}")

        if user:
            db.session.delete(user)
            print(f"🗑️ Deleted from User: {user.name}")

        db.session.commit()
        return jsonify({'message': 'Account deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"❌ Deletion failed: {e}")
        return jsonify({'error': f'Failed to delete account: {str(e)}'}), 500

# ✅ DEBUG: List all users in farmedata
@profile_bp.route('/debug-all', methods=['GET'])
def debug_all():
    users = FarmerData.query.all()
    return jsonify([u.Name for u in users])