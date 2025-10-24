# 🌾 FarmCast: Smart Crop Yield Predictor

FarmCast is a full-stack web application that helps farmers and agricultural analysts predict crop yields based on crop type, soil type, and sowing date. It combines a clean React frontend with a Flask backend and a custom prediction engine.

---

## 🚀 Features

- 🔐 User registration and login
- 🧑‍🌾 Profile management with field info
- 📍 Auto-detected location and weather integration
- 📊 Crop yield prediction using custom logic
- 💰 Market price estimation
- 📸 Screenshot export of prediction results
- 🧭 Soil type and weather visualization

---

## 🛠️ Tech Stack

| Layer       | Technology              |
|------------|--------------------------|
| Frontend   | React, Axios, Toastify   |
| Backend    | Flask, SQLAlchemy        |
| Prediction | NumPy, custom logic      |
| Database   | SQLite                   |
| Weather API| WeatherAPI.com           |

## 📁 Folder Structure

farmcast/
├── README.md                  # 📄 Project documentation
├── .env                       # 🔐 Environment variables (API keys, secrets)
├── requirements.txt           # 📦 Python dependencies
├── train_model.py             # 🧠 ML model training script
├── backend/                   # 🛠️ Flask backend
│   ├── app.py                 # 🔁 Main Flask app entry point
│   ├── config.py              # ⚙️ App and DB configuration
│   ├── instance/
│   │   └── farmcast.db        # 🗃️ SQLite database file
│   ├── model/
│   │   └── xgboost_model.pkl  # 🧠 Trained ML model
│   ├── models/                # 🧩 SQLAlchemy models
│   │   ├── user.py            # 👤 User model
│   │   └── farmer.py          # 🌾 Farmer profile model
│   ├── routes/                # 🌐 API endpoints
│   │   ├── auth.py            # 🔐 Login & registration
│   │   ├── profile.py         # 🧑‍🌾 Profile update/delete
│   │   └── predict.py         # 📊 Yield prediction
│   └── utils/                 # 🧰 Utility functions
│       ├── predict.py         # 🔮 Prediction logic
│       └── emailer.py         # 📧 Email notifications (optional)
├── frontend/                  # 🎨 React frontend
│   ├── package.json           # 📦 Frontend dependencies
│   ├── vite.config.js         # ⚡ Vite build config
│   ├── public/
│   │   ├── index.html         # 🧱 HTML entry point
│   │   └── vite.svg           # 🖼️ Vite logo
│   └── src/
│       ├── main.jsx           # 🚀 React entry point
│       ├── App.jsx            # 🧭 Main app component
│       ├── App.css            # 🎨 Global styles
│       ├── index.css          # 🎨 Base styles
│       ├── i18n/
│       │   └── translations.js# 🌍 Language support
│       ├── assets/
│       │   └── react.svg      # 🖼️ Static assets
│       └── components/        # 🧩 Reusable UI components
│           ├── CropForm/      # 🌱 Crop selection & prediction
│           ├── LoginRegister/ # 🔐 Auth UI
│           ├── ProfileCard/   # 🧑‍🌾 Profile display
│           ├── ResultCard/    # 📊 Prediction result
│           ├── SoilCard/      # 🧱 Soil info
│           └── WeatherCard/   # 🌦️ Weather info
├── .github/                   # 🧪 GitHub workflows (optional)
│   └── workflows/
│       └── deploy.yml         # 🚀 CI/CD pipeline
├── venv/                      # 🐍 Python virtual environment
├── node_modules/              # 📦 Node.js dependencies

---
## ⚙️ Setup Instructions

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py

### Frontend
cd frontend
npm install
npm start

📦 API Endpoints
- POST /auth/register – Register user
- POST /auth/login – Login user
- PUT /profile/update-profile – Update field info
- DELETE /profile/delete-account – Delete account
- POST /predict/predict-yield – Predict crop yield

📸 Screenshot
Include a screenshot of the prediction result card here.

👨‍💻 Author
Rakesh Penugonda
College student, backend specialist, and emerging cloud architect.
Built with ❤️ and precision

---

## ✅ LICENSE (MIT)

```markdown
MIT License

Copyright (c) 2025 Rakesh Penugonda

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

![GitHub repo size](https://img.shields.io/github/repo-size/rakesh11052005/farmcast)
![GitHub last commit](https://img.shields.io/github/last-commit/rakesh11052005/farmcast)
![GitHub issues](https://img.shields.io/github/issues/rakesh11052005/farmcast)
![GitHub pull requests](https://img.shields.io/github/issues-pr/rakesh11052005/farmcast)
![GitHub license](https://img.shields.io/github/license/rakesh11052005/farmcast)