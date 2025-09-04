import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      crop: "Crop ID",
      soil: "Soil Type ID",
      location: "Location ID",
      sowing: "Sowing Day",
      predict: "Predict",
      result: "Predicted Yield"
    }
  },
  te: {
    translation: {
      crop: "పంట ID",
      soil: "మట్టం ID",
      location: "ప్రాంతం ID",
      sowing: "విత్తే రోజు",
      predict: "అంచనా వేయండి",
      result: "అంచనా దిగుబడి"
    }
  },
  hi: {
    translation: {
      crop: "फसल ID",
      soil: "मिट्टी ID",
      location: "स्थान ID",
      sowing: "बोने का दिन",
      predict: "पूर्वानुमान लगाएं",
      result: "अनुमानित उपज"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});