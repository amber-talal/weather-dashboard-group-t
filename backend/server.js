require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://weather-dashboard-group-t-chi.vercel.app'
  ]
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));

app.get('/', (req, res) => res.send('Weather API running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));