import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileCard.css';

function ProfileCard({ user, onLogout, onUserUpdate }) {
  const [fieldSize, setFieldSize] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [message, setMessage] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFieldSize(user.field_size || '');
      setLatitude(user.latitude || '');
      setLongitude(user.longitude || '');
    }
  }, [user]);

  if (!user) return null;

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:5000/profile/update-profile', {
        name: user.name,
        field_size: parseFloat(fieldSize) || 0,
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0
      });

      const refreshed = await axios.get(`http://localhost:5000/get-profile?name=${user.name}`);
      if (onUserUpdate) onUserUpdate(refreshed.data); // ✅ update parent user state
      setMessage('✅ Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your account?");
    if (!confirm) return;

    try {
      const res = await axios.delete('http://localhost:5000/profile/delete-account', {
        data: { name: user.name }
      });
      setMessage(res.data.message);
      if (onLogout) onLogout();
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to delete account.');
    }
  };

  return (
    <div className="profile-card">
      <h3>🧑‍🌾 Welcome, {user.name}</h3>
      <p>📧 Email: {user.email}</p>
      <p>📍 Location: {user.location || 'Auto-detected'}</p>
      <p>🌱 Preferred Crop: {user.crop || 'Not set'}</p>
      <p>🗓️ Last Prediction: {user.lastPrediction || 'None yet'}</p>
      <p>📐 Field Size: {user.field_size ? `${user.field_size} acres` : 'Not set'}</p>
      <p>🌍 Latitude: {user.latitude || 'Not available'}</p>
      <p>🌍 Longitude: {user.longitude || 'Not available'}</p>

      <button className="toggle-manage" onClick={() => setShowActions(!showActions)}>
        {showActions ? '🔽 Hide Options' : '⚙️ Manage Profile'}
      </button>

      {showActions && (
        <>
          {isEditing ? (
            <div className="edit-fields">
              <label>📐 Field Size (acres)</label>
              <input
                type="number"
                value={fieldSize}
                onChange={e => setFieldSize(e.target.value)}
                placeholder="Enter field size"
              />
              <label>🧭 Latitude</label>
              <input
                type="number"
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
                placeholder="Enter latitude"
              />
              <label>🧭 Longitude</label>
              <input
                type="number"
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
                placeholder="Enter longitude"
              />
              <div className="button-row">
                <button onClick={handleUpdate}>✅ Save</button>
                <button onClick={() => setIsEditing(false)}>❌ Cancel</button>
              </div>
            </div>
          ) : (
            <div className="button-row">
              <button onClick={() => setIsEditing(true)}>✏️ Edit Field Info</button>
              <button onClick={handleDelete}>🗑️ Delete Account</button>
            </div>
          )}
        </>
      )}

      {message && <p className="profile-message">{message}</p>}
    </div>
  );
}

export default ProfileCard;