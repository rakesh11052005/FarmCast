import React, { useState } from 'react';
import './SoilCard.css';

function SoilCard({ soilType }) {
  const [showDetails, setShowDetails] = useState(false);

  const soilProfiles = {
    Alluvial: {
      ph: 7.2, EC: 0.4, organicCarbon: 0.8, nitrogen: 280, phosphorus: 22, potassium: 210,
      sulphur: 12, zinc: 0.9, iron: 4.2, copper: 0.3, manganese: 3.5,
      cropHistory: ["Rice", "Wheat", "Sugarcane"],
      recommendation: "Apply FYM and 40kg N/ha with balanced P-K"
    },
    Black: {
      ph: 7.8, EC: 0.5, organicCarbon: 0.9, nitrogen: 250, phosphorus: 18, potassium: 400,
      sulphur: 10, zinc: 0.7, iron: 3.8, copper: 0.25, manganese: 2.8,
      cropHistory: ["Cotton", "Soybean", "Sorghum"],
      recommendation: "Apply gypsum and 45kg N/ha with micronutrients"
    },
    Red: {
      ph: 6.2, EC: 0.3, organicCarbon: 0.6, nitrogen: 180, phosphorus: 15, potassium: 150,
      sulphur: 8, zinc: 0.6, iron: 5.0, copper: 0.2, manganese: 2.5,
      cropHistory: ["Millets", "Groundnut", "Pulses"],
      recommendation: "Add lime and 50kg N/ha with compost"
    },
    Laterite: {
      ph: 5.5, EC: 0.2, organicCarbon: 0.7, nitrogen: 160, phosphorus: 12, potassium: 130,
      sulphur: 7, zinc: 0.5, iron: 6.5, copper: 0.2, manganese: 3.2,
      cropHistory: ["Cashew", "Tea", "Pineapple"],
      recommendation: "Apply lime and organic manure with 40kg N/ha"
    },
    Arid: {
      ph: 8.1, EC: 0.6, organicCarbon: 0.3, nitrogen: 120, phosphorus: 10, potassium: 100,
      sulphur: 5, zinc: 0.4, iron: 2.5, copper: 0.15, manganese: 1.8,
      cropHistory: ["Pearl Millet", "Cumin", "Guar"],
      recommendation: "Use drip irrigation and 30kg N/ha with mulch"
    },
    Saline: {
      ph: 8.5, EC: 4.0, organicCarbon: 0.4, nitrogen: 100, phosphorus: 8, potassium: 90,
      sulphur: 6, zinc: 0.3, iron: 2.0, copper: 0.1, manganese: 1.5,
      cropHistory: ["Barley", "Mustard", "Cotton"],
      recommendation: "Apply gypsum and grow salt-tolerant crops"
    },
    Peaty: {
      ph: 5.2, EC: 0.4, organicCarbon: 2.5, nitrogen: 300, phosphorus: 20, potassium: 180,
      sulphur: 10, zinc: 0.8, iron: 4.0, copper: 0.3, manganese: 3.0,
      cropHistory: ["Rice", "Jute"],
      recommendation: "Improve drainage and apply 30kg N/ha"
    },
    Forest: {
      ph: 6.0, EC: 0.3, organicCarbon: 1.5, nitrogen: 260, phosphorus: 18, potassium: 160,
      sulphur: 9, zinc: 0.7, iron: 4.5, copper: 0.25, manganese: 2.7,
      cropHistory: ["Tea", "Spices", "Fruits"],
      recommendation: "Apply compost and 35kg N/ha"
    },
    Sandy: {
      ph: 7.5, EC: 0.2, organicCarbon: 0.3, nitrogen: 100, phosphorus: 10, potassium: 80,
      sulphur: 5, zinc: 0.4, iron: 2.2, copper: 0.15, manganese: 1.6,
      cropHistory: ["Watermelon", "Groundnut"],
      recommendation: "Add organic matter and 25kg N/ha"
    },
    Silty: {
      ph: 6.8, EC: 0.3, organicCarbon: 0.9, nitrogen: 240, phosphorus: 20, potassium: 200,
      sulphur: 10, zinc: 0.7, iron: 3.9, copper: 0.25, manganese: 2.9,
      cropHistory: ["Wheat", "Maize"],
      recommendation: "Apply balanced NPK and compost"
    },
    Clayey: {
      ph: 7.4, EC: 0.5, organicCarbon: 1.0, nitrogen: 260, phosphorus: 18, potassium: 300,
      sulphur: 11, zinc: 0.8, iron: 4.1, copper: 0.3, manganese: 3.2,
      cropHistory: ["Paddy", "Sugarcane"],
      recommendation: "Ensure drainage and apply 40kg N/ha"
    },
    Loamy: {
      ph: 6.9, EC: 0.4, organicCarbon: 1.2, nitrogen: 280, phosphorus: 22, potassium: 220,
      sulphur: 12, zinc: 0.9, iron: 4.3, copper: 0.3, manganese: 3.4,
      cropHistory: ["Vegetables", "Pulses", "Wheat"],
      recommendation: "Apply compost and 35kg N/ha"
    },
    Mountain: {
      ph: 5.8, EC: 0.3, organicCarbon: 1.1, nitrogen: 280, phosphorus: 20, potassium: 170,
      sulphur: 9, zinc: 0.85, iron: 4.6, copper: 0.25, manganese: 3.0,
      cropHistory: ["Apples", "Barley"],
      recommendation: "Apply compost and 35kg N/ha"
    },
    Calcareous: {
      ph: 8.2, EC: 0.5, organicCarbon: 0.5, nitrogen: 150, phosphorus: 12, potassium: 180,
      sulphur: 7, zinc: 0.4, iron: 2.5, copper: 0.2, manganese: 2.0,
      cropHistory: ["Wheat", "Mustard"],
      recommendation: "Apply zinc sulphate and 30kg N/ha"
    }
  };

  const recommendedCrops = {
    Alluvial: ["Rice", "Wheat", "Sugarcane", "Pulses", "Oilseeds"],
    Black: ["Cotton", "Soybean", "Groundnut"],
    Red: ["Millets", "Groundnut", "Pulses"],
    Laterite: ["Cashew", "Tea", "Pineapple"],
    Arid: ["Pearl Millet", "Cumin", "Guar"],
    Saline: ["Barley", "Mustard", "Cotton"],
    Peaty: ["Rice", "Jute"],
    Forest: ["Tea", "Spices", "Fruits"],
    Sandy: ["Watermelon", "Groundnut"],
    Silty: ["Wheat", "Maize"],
    Clayey: ["Paddy", "Sugarcane"],
    Loamy: ["Vegetables", "Pulses", "Wheat"],
    Mountain: ["Apples", "Barley", "Potatoes"],
    Calcareous: ["Wheat", "Mustard"]
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