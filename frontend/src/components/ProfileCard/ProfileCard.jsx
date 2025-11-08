import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import './ProfileCard.css';

function ProfileCard({ user, onLogout, onUserUpdate }) {
  const [name, setName] = useState('');
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
      setName(user.name ?? '');
      setFieldSize(user.field_size ?? '');
      setLatitude(user.latitude ?? '');
      setLongitude(user.longitude ?? '');
    }
  }, [user]);

  if (!user) return null;

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:5000/profile/update-profile', {
        email: profile.email,
        name,
        field_size: parseFloat(fieldSize) || 0,
        latitude: parseFloat(latitude) || 0,
        longitude: parseFloat(longitude) || 0
      });

      const refreshed = await axios.get(`http://localhost:5000/profile/get-profile?email=${profile.email}`);
      setProfile(refreshed.data);
      setName(refreshed.data.name); // ✅ update local name
      if (onUserUpdate) onUserUpdate(refreshed.data);
      setMessage('✅ Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const res = await axios.delete('http://localhost:5000/profile/delete-account', {
        data: { email: profile.email }
      });
      setMessage(res.data.message);
      if (onLogout) onLogout();
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Failed to delete account.');
    }
  };

  const toggleCard = (e) => {
    const ignoreTags = ['BUTTON', 'INPUT', 'TEXTAREA', 'LABEL', 'SVG', 'PATH'];
    if (ignoreTags.includes(e.target.tagName)) return;
    setIsExpanded(prev => !prev);
  };

  return (
    <div className={`profile-card ${isExpanded ? 'expanded' : ''}`} onClick={toggleCard}>
      <div className="profile-header">
        <h3>{profile.name}</h3>
        <button className="icon-button logout" onClick={(e) => { e.stopPropagation(); onLogout(); }}>
          <FaSignOutAlt />
        </button>
      </div>

      {isExpanded && (
        <div className="icon-button-row">
          <button className="icon-button edit" onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}>
            <FaEdit />
          </button>
          <button className="icon-button delete" onClick={(e) => { e.stopPropagation(); handleDelete(); }}>
            <FaTrash />
          </button>
        </div>
      )}

      <div className={`profile-details ${isExpanded ? 'visible' : 'hidden'}`}>
        <div className="field-group"><p>📧 Email: {profile.email}</p></div>
        <div className="field-group"><p>📍 Location: {profile.location || 'Auto-detected'}</p></div>
        <div className="field-group"><p>🌱 Preferred Crop: {profile.crop || 'Not set'}</p></div>
        <div className="field-group"><p>🗓️ Last Prediction: {profile.lastPrediction || 'None yet'}</p></div>

        {isEditing ? (
          <>
            <div className="field-group">
              <label>👤 Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="field-group">
              <label>📐 Field Size (acres)</label>
              <input type="number" value={fieldSize} onChange={e => setFieldSize(e.target.value)} />
            </div>
            <div className="field-group">
              <label>🧭 Latitude</label>
              <input type="number" value={latitude} onChange={e => setLatitude(e.target.value)} />
            </div>
            <div className="field-group">
              <label>🧭 Longitude</label>
              <input type="number" value={longitude} onChange={e => setLongitude(e.target.value)} />
            </div>
            <div className="button-row">
              <button onClick={handleUpdate}>✅ Save</button>
              <button onClick={() => setIsEditing(false)}>❌ Cancel</button>
            </div>
          </>
        ) : (
          <>
            <div className="field-group"><p>📐 Field Size: {profile.field_size ?? 'Not set'} acres</p></div>
            <div className="field-group"><p>🌍 Latitude: {profile.latitude ?? 'Not available'}</p></div>
            <div className="field-group"><p>🌍 Longitude: {profile.longitude ?? 'Not available'}</p></div>
          </>
        )}

        {message && <p className="profile-message">{message}</p>}
      </div>
    </div>
  );
}

export default ProfileCard;