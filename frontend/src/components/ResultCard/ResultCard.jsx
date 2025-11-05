import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './ResultCard.css';

function ResultCard({ result, userEmail }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result) return null;

  const handleScreenshot = (e) => {
    e.stopPropagation();
    const element = document.querySelector('.result-card');
    html2canvas(element).then(canvas => {
      const link = document.createElement('a');
      link.download = 'farmcast_prediction.png';
      link.href = canvas.toDataURL();
      link.click();
      toast.success("📸 Screenshot saved!");
    });
  };

  const handleSendEmail = async (e) => {
    e.stopPropagation();
    if (!userEmail) {
      toast.error("❌ No email found for user.");
      return;
    }

    try {
      await fetch('http://localhost:5000/predict/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          cropType: result.crop_type,
          predictedYield: result.yield,
          confidence: result.confidence,
          estimatedPrice: result.estimated_price,
          pricePerQuintal: result.price_per_quintal
        })
      });
      toast.success("📬 Prediction sent to your email!");
    } catch (err) {
      console.error("Email error:", err);
      toast.error("❌ Failed to send email.");
    }
  };

  return (
    <div className={`result-card clickable`} onClick={() => setIsExpanded(!isExpanded)}>
      <h3>📊 Prediction Result</h3>

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

        <div className="result-actions-row">
          <button onClick={handleScreenshot} className="action-btn">
            <FaCamera /> Screenshot
          </button>
          <button onClick={handleSendEmail} className="action-btn">
            📤 Send Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;