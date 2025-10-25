import React, { useState } from 'react';
import CropForm from './components/CropForm/CropForm';
import LoginRegister from './components/LoginRegister/LoginRegister';
import ProfileCard from './components/ProfileCard/ProfileCard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // ✅ Store full profile object

  const handleLoginSuccess = (profile) => {
    setIsLoggedIn(true);
    setUserData(profile); // ✅ Save full profile from login response
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Poppins, sans-serif' }}>
      <h2>🌾 FarmCast Yield Predictor</h2>

      {!isLoggedIn ? (
        <LoginRegister onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <p>👋 Welcome, {userData.name}!</p>
          <ProfileCard user={userData} onLogout={handleLogout} />
          <CropForm />
        </>
      )}
    </div>
  );
}

export default App;