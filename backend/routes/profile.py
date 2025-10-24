from flask import Blueprint, request, jsonify
from models.farmer import FarmerData
from config import db
import json

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/get-profile', methods=['GET'])
def get_profile():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400

    user = FarmerData.query.filter_by(Name=name).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'name': user.Name,
        'email': user.Email,
        'location': user.Location,
        'crop': user.Crop,
        'lastPrediction': user.LastPrediction,
        'field_size': user.FieldSize,
        'latitude': user.Latitude,
        'longitude': user.Longitude
    })

@profile_bp.route('/update-profile', methods=['PUT'])
def update_profile():
    data = request.get_json(force=True)
    name = data.get('name')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    user = FarmerData.query.filter_by(Name=name).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    try:
        # ✅ Update field info
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

@profile_bp.route('/delete-account', methods=['DELETE'])
def delete_account():
    try:
        data = json.loads(request.data)
        name = data.get('name')

        if not name:
            return jsonify({'error': 'Name is required'}), 400

        user = FarmerData.query.filter_by(Name=name).first()
        if not user:
            return jsonify({'error': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()
        print(f"🗑️ Deleted account for: {name}")
        return jsonify({'message': 'Account deleted successfully'})
    except Exception as e:
        db.session.rollback()
        print(f"❌ Deletion failed: {e}")
        return jsonify({'error': f'Failed to delete account: {str(e)}'}), 500