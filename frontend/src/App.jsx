import React, { useState } from 'react';
import CropForm from './components/CropForm/CropForm';
import LoginRegister from './components/LoginRegister/LoginRegister';
import ProfileCard from './components/ProfileCard/ProfileCard';
import WeatherCard from './components/WeatherCard/WeatherCard';
import SoilCard from './components/SoilCard/SoilCard';
import ResultCard from './components/ResultCard/ResultCard';
import './App.css';

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
    <div className="app-container fade-in">
      <h2 className="app-title">🌾 FarmCast Yield Predictor</h2>

      {!isLoggedIn ? (
        <LoginRegister onLoginSuccess={handleLoginSuccess} />
      ) : (
        <main className="main-card card">
          <p className="welcome-msg">👋 Welcome, {userData.name}!</p>

          <div className="dashboard">
            {/* ✅ Left panel: Profile + CropForm */}
            <section className="left-panel">
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
            </section>

            {/* ✅ Right panel: Weather + Soil + Result */}
            <section className="right-panel">
              <WeatherCard
                weather={weather}
                lat={userData?.latitude}
                lon={userData?.longitude}
              />
              <SoilCard soilType={userData?.soil_type} />
              <ResultCard
                result={predictionResult}
                userEmail={userData?.email} // ✅ Pass email here
              />
            </section>
          </div>
        </main>
      )}
    </div>
  );
}

export default App;