const axios = require('axios');

async function getCurrent(req, res) {
  try {
    const city = req.query.city || 'Lahore';
    const key = process.env.OPENWEATHER_API_KEY;
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + key + '&units=metric';
    const response = await axios.get(url);
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ message: 'Weather fetch failed' });
  }
}

async function getForecast(req, res) {
  try {
    const city = req.query.city || 'Lahore';
    const key = process.env.OPENWEATHER_API_KEY;
    const url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + key + '&units=metric';
    const response = await axios.get(url);
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({ message: 'Forecast fetch failed' });
  }
}

module.exports.getCurrent = getCurrent;
module.exports.getForecast = getForecast;