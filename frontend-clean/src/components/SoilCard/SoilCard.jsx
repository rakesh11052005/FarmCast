import React, { useState } from 'react';
import './SoilCard.css';

function SoilCard() {
  const [showDetails, setShowDetails] = useState(false);

  const soilData = {
    type: "Loamy",
    ph: 6.8,
    organic_carbon: 0.75,
    recommendation: "Apply 40kg N/ha"
  };

  const recommendedCrops = [
    "Wheat",
    "Maize",
    "Tomatoes",
    "Carrots",
    "Chickpea",
    "Green Gram"
  ];

  return (
    <div className="soil-card clickable" onClick={() => setShowDetails(!showDetails)}>
      <h3>🌱 Soil Health (click to view details)</h3>
      <p>Type: {soilData.type}</p>
      <p>pH: {soilData.ph}</p>
      <p>Organic Carbon: {soilData.organic_carbon}</p>
      <p>Recommendation: {soilData.recommendation}</p>

      {showDetails && (
        <div className="soil-details">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Soil_pH_effect_on_nutrient_availability.svg/800px-Soil_pH_effect_on_nutrient_availability.svg.png"
            alt="Soil pH scale"
            className="soil-image"
          />
          <p className="soil-note">
            📊 Loamy soil with pH 6.8 is ideal for most crops. Nutrient availability is optimal.
          </p>
          <div className="recommended-crops">
            <h4>🌾 Recommended Crops</h4>
            <ul>
              {recommendedCrops.map(crop => (
                <li key={crop}>{crop}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default SoilCard;