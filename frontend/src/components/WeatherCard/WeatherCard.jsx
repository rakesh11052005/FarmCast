import React, { useState } from 'react';
import './WeatherCard.css';

function WeatherCard({ weather, lat, lon }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!weather) return null;

  const handleViewField = (e) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/@${lat},${lon},15z`, "_blank");
  };

  return (
    <div className={`weather-card clickable`} onClick={() => setIsExpanded(!isExpanded)}>
      <h3>☁️ Weather</h3>

      <div className={`weather-details ${isExpanded ? 'visible' : 'hidden'}`}>
        <p>🌡️ Temperature: {weather.temp_c}°C</p>
        <p>💨 Wind: {weather.wind_kph} kph</p>
        <p>🌤️ Condition: {weather.condition.text}</p>

        <div className="weather-actions">
          <button className="action-btn" onClick={handleViewField}>
            📍 View Field on Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;