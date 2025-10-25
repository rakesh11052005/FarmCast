import React, { useState } from 'react';
import './SoilCard.css';

function SoilCard({ soilType }) {
  const [showDetails, setShowDetails] = useState(false);

  const soilProfiles = {
    Alluvial: { ph: 7.0, EC: 0.5, organicCarbon: 0.8, nitrogen: 280, phosphorus: 25, potassium: 200, sulphur: 15, zinc: 1.0, iron: 5.0, copper: 0.3, manganese: 3.5, cropHistory: ["Rice", "Wheat"], recommendation: "Apply 40kg N/ha and 30kg P/ha for optimal cereal growth" },
    Black: { ph: 7.2, EC: 0.6, organicCarbon: 0.65, nitrogen: 250, phosphorus: 20, potassium: 150, sulphur: 10, zinc: 0.8, iron: 4.2, copper: 0.25, manganese: 3.0, cropHistory: ["Cotton", "Soybean"], recommendation: "Apply 50kg N/ha and 40kg P/ha based on nutrient levels" },
    Red: { ph: 6.2, EC: 0.4, organicCarbon: 0.5, nitrogen: 220, phosphorus: 18, potassium: 140, sulphur: 8, zinc: 0.7, iron: 4.8, copper: 0.2, manganese: 2.8, cropHistory: ["Millets", "Groundnut"], recommendation: "Add organic manure and 45kg N/ha for pulse crops" },
    Laterite: { ph: 5.5, EC: 0.3, organicCarbon: 0.6, nitrogen: 200, phosphorus: 15, potassium: 130, sulphur: 7, zinc: 0.6, iron: 5.5, copper: 0.2, manganese: 2.5, cropHistory: ["Tea", "Cashew"], recommendation: "Apply lime and 35kg N/ha for acidic correction" },
    Arid: { ph: 8.0, EC: 1.2, organicCarbon: 0.3, nitrogen: 180, phosphorus: 12, potassium: 100, sulphur: 5, zinc: 0.5, iron: 3.5, copper: 0.15, manganese: 2.0, cropHistory: ["Bajra", "Guar"], recommendation: "Use drought-resistant varieties and 25kg N/ha" },
    Saline: { ph: 8.5, EC: 2.0, organicCarbon: 0.4, nitrogen: 160, phosphorus: 10, potassium: 90, sulphur: 4, zinc: 0.4, iron: 3.0, copper: 0.1, manganese: 1.8, cropHistory: ["Barley", "Salt-tolerant Cotton"], recommendation: "Apply gypsum and use salt-tolerant crops" },
    Peaty: { ph: 5.0, EC: 0.2, organicCarbon: 1.2, nitrogen: 300, phosphorus: 20, potassium: 160, sulphur: 10, zinc: 0.9, iron: 4.0, copper: 0.25, manganese: 3.0, cropHistory: ["Paddy", "Jute"], recommendation: "Improve drainage and apply 40kg N/ha" },
    Forest: { ph: 6.0, EC: 0.3, organicCarbon: 1.0, nitrogen: 270, phosphorus: 22, potassium: 170, sulphur: 9, zinc: 0.8, iron: 4.5, copper: 0.2, manganese: 2.7, cropHistory: ["Tea", "Spices"], recommendation: "Maintain humus and apply 30kg N/ha" },
    Sandy: { ph: 7.5, EC: 0.4, organicCarbon: 0.35, nitrogen: 200, phosphorus: 15, potassium: 120, sulphur: 6, zinc: 0.6, iron: 3.8, copper: 0.2, manganese: 2.2, cropHistory: ["Groundnut", "Melons"], recommendation: "Frequent irrigation and 30kg N/ha" },
    Silty: { ph: 6.8, EC: 0.5, organicCarbon: 0.7, nitrogen: 260, phosphorus: 20, potassium: 160, sulphur: 10, zinc: 0.85, iron: 4.3, copper: 0.25, manganese: 3.1, cropHistory: ["Barley", "Lentils"], recommendation: "Apply 40kg N/ha and maintain moisture" },
    Clayey: { ph: 7.0, EC: 0.7, organicCarbon: 0.9, nitrogen: 290, phosphorus: 24, potassium: 190, sulphur: 12, zinc: 1.0, iron: 5.2, copper: 0.3, manganese: 3.6, cropHistory: ["Rice", "Sugarcane"], recommendation: "Ensure proper drainage and apply 45kg N/ha" },
    Loamy: { ph: 6.8, EC: 0.6, organicCarbon: 0.75, nitrogen: 270, phosphorus: 22, potassium: 180, sulphur: 11, zinc: 0.9, iron: 4.5, copper: 0.3, manganese: 3.2, cropHistory: ["Wheat", "Maize"], recommendation: "Balanced fertilization with 40kg N/ha" },
    Mountain: { ph: 5.8, EC: 0.3, organicCarbon: 1.1, nitrogen: 280, phosphorus: 20, potassium: 170, sulphur: 9, zinc: 0.85, iron: 4.6, copper: 0.25, manganese: 3.0, cropHistory: ["Apples", "Barley"], recommendation: "Apply compost and 35kg N/ha" },
    Calcareous: { ph: 8.2, EC: 0.9, organicCarbon: 0.5, nitrogen: 230, phosphorus: 18, potassium: 140, sulphur: 7, zinc: 0.6, iron: 3.5, copper: 0.2, manganese: 2.5, cropHistory: ["Sugarcane", "Maize"], recommendation: "Apply 40kg N/ha and phosphorus supplements" }

  };

  const recommendedCrops = {
    Alluvial: ["Rice", "Wheat", "Sugarcane", "Pulses", "Oilseeds"],
    Black: ["Cotton", "Soybean", "Groundnut"],
    Red: ["Millets", "Groundnut", "Pulses"],
    Laterite: ["Tea", "Cashew", "Rubber"],
    Arid: ["Bajra", "Guar", "Kharif Pulses"],
    Saline: ["Barley", "Salt-tolerant Cotton"],
    Peaty: ["Paddy", "Jute", "Tropical Fruits"],
    Forest: ["Tea", "Spices", "Medicinal Plants"],
    Sandy: ["Groundnut", "Melons", "Cucumbers"],
    Silty: ["Barley", "Lentils", "Mustard"],
    Clayey: ["Rice", "Sugarcane", "Tapioca"],
    Loamy: ["Wheat", "Maize", "Soybean"],
    Mountain: ["Apples", "Barley", "Potatoes"],
    Calcareous: ["Sugarcane", "Maize", "Millets"]
  };

  const soil = soilProfiles[soilType];
  const crops = recommendedCrops[soilType];

  if (!soil) {
    return (
      <div className="soil-card">
        <h3>🌱 Soil Health</h3>
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