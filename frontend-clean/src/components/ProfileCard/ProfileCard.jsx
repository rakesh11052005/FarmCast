import React from 'react';
import './ProfileCard.css';

function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <div className="profile-card">
      <h3>🧑‍🌾 Welcome, {user.name}</h3>
      <p>📧 Email: {user.email}</p>
      <p>📍 Location: {user.location || 'Auto-detected'}</p>
      <p>🌱 Preferred Crop: {user.crop || 'Not set'}</p>
      <p>🗓️ Last Prediction: {user.lastPrediction || 'None yet'}</p>
    </div>
  );
}

export default ProfileCard;