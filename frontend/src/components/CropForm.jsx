console.log("CropForm component loaded");
import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function CropForm() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({
    crop_id: '',
    soil_type_id: '',
    location_id: '',
    sowing_day: ''
  });
  const [result, setResult] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/predict-yield', form);
    setResult(res.data.predicted_yield);
  };

  return (
    <div>
      <select onChange={e => i18n.changeLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="te">తెలుగు</option>
        <option value="hi">हिंदी</option>
      </select>

      <form onSubmit={handleSubmit}>
        <input name="crop_id" placeholder={t('crop')} onChange={handleChange} />
        <input name="soil_type_id" placeholder={t('soil')} onChange={handleChange} />
        <input name="location_id" placeholder={t('location')} onChange={handleChange} />
        <input name="sowing_day" placeholder={t('sowing')} onChange={handleChange} />
        <button type="submit">{t('predict')}</button>
      </form>

      {result && <p>{t('result')}: {result} kg/hectare</p>}
    </div>
  );
}

export default CropForm;
console.log("CropForm component loaded");