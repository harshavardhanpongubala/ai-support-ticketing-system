# 🎫 AI-Powered Customer Support Ticketing System

A full-stack web application that uses AI to automatically classify support tickets and assign them to the right agents.

## 🌟 Features

- 🤖 AI Ticket Classification - Automatic category detection
- ⚡ Smart Priority Detection - AI determines urgency
- 👥 Role-Based Access - Admin, Agent, and Customer views
- 📊 Analytics Dashboard - Real-time charts
- ⏰ SLA Tracking - Automatic deadline calculation
- ⭐ Customer Satisfaction Ratings
- 🔐 JWT Authentication

## 🛠️ Tech Stack

**Frontend:** Next.js, Tailwind CSS, Recharts, Axios

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

**AI/ML:** Python, Flask, Scikit-learn

## 📁 Project Structure

```
ai-support-ticketing/
├── backend/          # Node.js + Express API
├── frontend/         # Next.js Frontend
└── ml-service/       # Python AI Service
```

## 🚀 Getting Started

### Backend Setup
```
cd backend
npm install
npm run dev
```

### ML Service Setup
```
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors scikit-learn numpy
python app.py
```

### Frontend Setup
```
cd frontend
npm install
npm run dev
```

### Seed Sample Data
```
cd backend
node seed.js
```

## 🔑 Demo Credentials

- **Admin:** admin@demo.com / admin123
- **Agent:** agent@demo.com / agent123
- **Customer:** customer@demo.com / customer123

## 🌐 URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML Service: http://localhost:5001

## 👨‍💻 Author

**P Harshavardhan**

Built as part of Web Developer Internship Final Project.