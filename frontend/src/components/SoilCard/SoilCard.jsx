import React, { useState } from 'react';
import './SoilCard.css';

function SoilCard({ soilType }) {
  const [showDetails, setShowDetails] = useState(false);

  const soilProfiles = {
    Alluvial: {
      ph: 7.0, EC: 0.5, organicCarbon: 0.8, nitrogen: 280, phosphorus: 25, potassium: 200,
      sulphur: 15, zinc: 1.0, iron: 5.0, copper: 0.3, manganese: 3.5,
      cropHistory: ["Rice", "Wheat"],
      recommendation: "Apply 40kg N/ha and 30kg P/ha for optimal cereal growth"
    },
    Black: {
      ph: 7.2, EC: 0.6, organicCarbon: 0.65, nitrogen: 250, phosphorus: 20, potassium: 150,
      sulphur: 10, zinc: 0.8, iron: 4.2, copper: 0.25, manganese: 3.0,
      cropHistory: ["Cotton", "Soybean"],
      recommendation: "Apply 50kg N/ha and 40kg P/ha based on nutrient levels"
    },
    Red: {
      ph: 6.2, EC: 0.4, organicCarbon: 0.5, nitrogen: 220, phosphorus: 18, potassium: 140,
      sulphur: 8, zinc: 0.7, iron: 4.8, copper: 0.2, manganese: 2.8,
      cropHistory: ["Millets", "Groundnut"],
      recommendation: "Add organic manure and 45kg N/ha for pulse crops"
    },
    Mountain: {
      ph: 5.8, EC: 0.3, organicCarbon: 1.1, nitrogen: 280, phosphorus: 20, potassium: 170,
      sulphur: 9, zinc: 0.85, iron: 4.6, copper: 0.25, manganese: 3.0,
      cropHistory: ["Apples", "Barley"],
      recommendation: "Apply compost and 35kg N/ha"
    },
    // Add other soil types as needed
  };

  const recommendedCrops = {
    Alluvial: ["Rice", "Wheat", "Sugarcane", "Pulses", "Oilseeds"],
    Black: ["Cotton", "Soybean", "Groundnut"],
    Red: ["Millets", "Groundnut", "Pulses"],
    Mountain: ["Apples", "Barley", "Potatoes"]
    // Add other mappings as needed
  };

  const soil = soilProfiles[soilType];
  const crops = recommendedCrops[soilType];

  if (!soil) {
    return (
      <div className="soil-card">
        <h3>🌱 Soil Health</h3>
        <p>No data available for selected soil type.</p>
      </div>
    );
  }

  return (
    <div className={`soil-card clickable`} onClick={() => setShowDetails(!showDetails)}>
      <h3>🌱 Soil Health</h3>

      <div className={`soil-details ${showDetails ? 'visible' : 'hidden'}`}>
        <p>Type: {soilType}</p>
        <p>pH: {soil.ph}</p>
        <p>EC: {soil.EC}</p>
        <p>Organic Carbon: {soil.organicCarbon}</p>
        <p>Nitrogen: {soil.nitrogen} kg/ha</p>
        <p>Phosphorus: {soil.phosphorus} kg/ha</p>
        <p>Potassium: {soil.potassium} kg/ha</p>
        <p>Sulphur: {soil.sulphur} ppm</p>
        <p>Zinc: {soil.zinc} ppm</p>
        <p>Iron: {soil.iron} ppm</p>
        <p>Copper: {soil.copper} ppm</p>
        <p>Manganese: {soil.manganese} ppm</p>
        <p>Recommendation: {soil.recommendation}</p>

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Soil_pH_effect_on_nutrient_availability.svg/800px-Soil_pH_effect_on_nutrient_availability.svg.png"
          alt="Soil pH scale"
          className="soil-image"
        />

        <p className="soil-note">
          📊 {soilType} soil with pH {soil.ph} supports balanced nutrient uptake.
        </p>
        <p className="soil-note">
          Crop History: {soil.cropHistory.join(', ')}
        </p>

        <div className="recommended-crops">
          <h4>🌾 Recommended Crops for {soilType} Soil</h4>
          <ul>
            {crops?.map(crop => (
              <li key={crop}>{crop}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SoilCard;