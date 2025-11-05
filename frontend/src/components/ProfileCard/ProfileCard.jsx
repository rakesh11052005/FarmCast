import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileCard.css';

function ProfileCard({ user, onLogout, onUserUpdate }) {
  const [fieldSize, setFieldSize] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(user);

  useEffect(() => {
    setProfile(user);
    if (user) {
      setFieldSize(user.field_size ?? '');
      setLatitude(user.latitude ?? '');
      setLongitude(user.longitude ?? '');
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

      const refreshed = await axios.get(`http://localhost:5000/profile/get-profile?name=${user.name}`);
      setProfile(refreshed.data);
      if (onUserUpdate) onUserUpdate(refreshed.data);
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
    <div
      className={`profile-card ${isExpanded ? 'expanded' : 'collapsed'}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="profile-header">
        <h3>{profile.name}</h3>
        {!isExpanded && (
          <button
            className="logout-button inline"
            onClick={(e) => {
              e.stopPropagation();
              onLogout();
            }}
          >
            🚪 Logout
          </button>
        )}
      </div>

      <div className={`profile-details ${isExpanded ? 'visible' : 'hidden'}`}>
        <p>📧 Email: {profile.email}</p>
        <p>📍 Location: {profile.location || 'Auto-detected'}</p>
        <p>🌱 Preferred Crop: {profile.crop || 'Not set'}</p>
        <p>🗓️ Last Prediction: {profile.lastPrediction || 'None yet'}</p>
        <p>📐 Field Size: {profile.field_size !== undefined ? `${profile.field_size} acres` : 'Not set'}</p>
        <p>🌍 Latitude: {profile.latitude !== undefined ? profile.latitude : 'Not available'}</p>
        <p>🌍 Longitude: {profile.longitude !== undefined ? profile.longitude : 'Not available'}</p>

        <div className="button-row fade-in">
          <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>✏️ Edit</button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(); }}>🗑️ Delete</button>
          <button onClick={(e) => { e.stopPropagation(); onLogout(); }}>🚪 Logout</button>
        </div>

        <div className={`edit-fields ${isEditing ? 'visible' : ''}`} onClick={(e) => e.stopPropagation()}>
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

        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
  );
}

export default ProfileCard;