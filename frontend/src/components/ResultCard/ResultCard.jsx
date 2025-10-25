import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './ResultCard.css';

function ResultCard({ result }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result) return null;

  const handleScreenshot = (e) => {
    e.stopPropagation(); // prevent toggle
    const element = document.querySelector('.result-card');
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'farmcast_prediction.png';
      link.href = canvas.toDataURL();
      link.click();
      toast.success("📸 Screenshot saved!");
    });
  };

  return (
    <div className={`result-card clickable`} onClick={() => setIsExpanded(!isExpanded)}>
      <h3>📊 Prediction Result </h3>

      <div className={`result-details ${isExpanded ? 'visible' : 'hidden'}`}>
        {result.crop_type && <p>🌱 Crop Type: {result.crop_type}</p>}
        {result.yield && <p>🌾 Yield: {result.yield} kg/hectare</p>}
        {result.confidence && <p>✅ Confidence: {(result.confidence * 100).toFixed(2)}%</p>}
        {result.estimated_price && (
          <p>💰 Estimated Market Price: ₹{result.estimated_price.toFixed(2)}</p>
        )}
        {result.price_per_quintal && (
          <p>📦 Price per Quintal: ₹{result.price_per_quintal}</p>
        )}

        <button onClick={handleScreenshot} className="screenshot-btn">
          <FaCamera /> Save Screenshot
        </button>
      </div>
    </div>
  );
}

export default ResultCard;