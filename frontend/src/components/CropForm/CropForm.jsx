import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WeatherCard from '../WeatherCard/WeatherCard';
import SoilCard from '../SoilCard/SoilCard';
import ResultCard from '../ResultCard/ResultCard';
import './CropForm.css';

function CropForm() {
  const [form, setForm] = useState({
    crop_id: '',
    soil_type_id: '',
    sowing_day: '',
    lat: '',
    lon: ''
  });

  const [sowingDate, setSowingDate] = useState('');
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Soil type mapping
  const soilTypeMap = {
    "1": "Alluvial",
    "2": "Black",
    "3": "Red",
    "4": "Laterite",
    "5": "Arid",
    "6": "Saline",
    "7": "Peaty",
    "8": "Forest",
    "9": "Sandy",
    "10": "Silty",
    "11": "Clayey",
    "12": "Loamy",
    "13": "Mountain",
    "14": "Calcareous"
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        setForm(prev => ({ ...prev, lat: latitude, lon: longitude }));
      },
      err => console.error("Location error:", err)
    );
  }, []);

  useEffect(() => {
    if (form.lat && form.lon) {
      axios.get(`http://api.weatherapi.com/v1/current.json?key=56241786dc064088b3e93535250209&q=${form.lat},${form.lon}`)
        .then(res => {
          setWeather(res.data.current);
        })
        .catch(err => console.error("Weather fetch error:", err));
    }
  }, [form.lat, form.lon]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = e => {
    const date = new Date(e.target.value);
    const dayOfYear = Math.ceil((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
    setSowingDate(e.target.value);
    setForm(prev => ({ ...prev, sowing_day: dayOfYear }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/predict-yield', form);
      setResult(res.data);
      setError(null);
    } catch (err) {
      setError("❌ Prediction failed. Please check inputs or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="input-card">
        <label>Crop Type</label>
        <select name="crop_id" value={form.crop_id} onChange={handleChange} required>
          <option value="">Select Crop</option>
          <option value="1">Wheat</option>
          <option value="2">Rice</option>
          <option value="3">Maize</option>
          <option value="4">Tomato</option>
          <option value="5">Chickpea</option>
          <option value="6">Green Gram</option>
        </select>

        <label>Soil Type</label>
        <select name="soil_type_id" value={form.soil_type_id} onChange={handleChange} required>
          <option value="">Select Soil Type</option>
          <option value="1">Alluvial</option>
          <option value="2">Black</option>
          <option value="3">Red</option>
          <option value="4">Laterite</option>
          <option value="5">Arid</option>
          <option value="6">Saline</option>
          <option value="7">Peaty</option>
          <option value="8">Forest</option>
          <option value="9">Sandy</option>
          <option value="10">Silty</option>
          <option value="11">Clayey</option>
          <option value="12">Loamy</option>
          <option value="13">Mountain</option>
          <option value="14">Calcareous</option>
        </select>

        <label>Sowing Date</label>
        <input type="date" value={sowingDate} onChange={handleDateChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "🔄 Predicting..." : "🚀 Predict Yield"}
        </button>
      </form>

      <WeatherCard weather={weather} lat={form.lat} lon={form.lon} />
      <SoilCard soilType={soilTypeMap[form.soil_type_id]} />
      <ResultCard result={result} />
      {error && <p className="error-msg">{error}</p>}
      <ToastContainer />
    </div>
  );
}

export default CropForm;