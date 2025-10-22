import React from 'react';
import './WeatherCard.css';

function WeatherCard({ weather, lat, lon }) {
  if (!weather) return null;

  return (
    <div className="weather-card clickable" onClick={() => {
      window.open(`https://www.google.com/maps/@${lat},${lon},15z`, "_blank");
    }}>
      <h3>☁️ Weather Snapshot (click to view field)</h3>
      <p> Temperature: {weather.temp_c}°C</p>
      <p> Wind: {weather.wind_kph} kph</p>
      <p> Condition: {weather.condition.text}</p>
    </div>
  );
}

export default WeatherCard;