import React, { useState } from 'react';
import CropForm from './components/CropForm/CropForm';
import LoginRegister from './components/LoginRegister/LoginRegister';
import ProfileCard from './components/ProfileCard/ProfileCard';
import WeatherCard from './components/WeatherCard/WeatherCard';
import SoilCard from './components/SoilCard/SoilCard';
import ResultCard from './components/ResultCard/ResultCard';
import './App.css'; // ✅ Make sure this includes your layout styles

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  const handleLoginSuccess = (profile) => {
    setIsLoggedIn(true);
    setUserData(profile);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setWeather(null);
    setPredictionResult(null);
  };

  return (
    <div className="app-container">
      <h2>🌾 FarmCast Yield Predictor</h2>

      {!isLoggedIn ? (
        <LoginRegister onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <p>👋 Welcome, {userData.name}!</p>
          <div className="dashboard">
            {/* ✅ Left panel: Profile + CropForm */}
            <div className="left-panel">
              <ProfileCard user={userData} onLogout={handleLogout} />
              <CropForm
                onWeatherUpdate={setWeather}
                onPredictionUpdate={(data) => {
                  setPredictionResult(data.result);
                  setUserData(prev => ({
                    ...prev,
                    soil_type: data.soilType
                  }));
                }}
              />
            </div>

            {/* ✅ Right panel: Weather + Soil + Result */}
            <div className="right-panel">
              <WeatherCard
                weather={weather}
                lat={userData?.latitude}
                lon={userData?.longitude}
              />
              <SoilCard soilType={userData?.soil_type} />
              <ResultCard result={predictionResult} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;