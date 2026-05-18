import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBell, FiSettings, FiBarChart2, FiUser, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import HourlyForecast from '../components/HourlyForecast';
import MonthlyRainfall from '../components/MonthlyRainfall';
import ForecastList from '../components/ForecastList';
import WorldMap from '../components/WorldMap';

const WEATHER_ICONS = {
  Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️',
};

function useTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const time = useTime();

  const [city, setCity] = useState('Lahore');
  const [search, setSearch] = useState('');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = useCallback(async (c) => {
    setLoading(true); setError('');
    try {
      const [cur, fore] = await Promise.all([
        API.get(`/weather/current?city=${c}`),
        API.get(`/weather/forecast?city=${c}`),
      ]);
      setCurrent(cur.data);
      setForecast(fore.data);
    } catch {
      setError('Could not fetch weather. Check city name.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWeather(city); }, [city, fetchWeather]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) { setCity(search.trim()); setSearch(''); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const hour = time.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = `${['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][time.getDay()]}, ${
    ['January','February','March','April','May','June','July','August','September','October','November','December'][time.getMonth()]
  } ${time.getDate()} | ${time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}`;

  if (loading && !current) {
    return (
      <div className="loading">
        <div className="spinner" />
        Loading weather data...
      </div>
    );
  }

  const weatherMain = current?.weather?.[0]?.main || 'Clear';
  const weatherDesc = current?.weather?.[0]?.description || '';
  const temp = current ? Math.round(current.main.temp) : '--';
  const wind = current ? Math.round(current.wind.speed * 3.6) : '--';
  const humidity = current?.main?.humidity || '--';

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">🌤️ <span>Sky</span>Cast</div>
        <form className="search-bar" onSubmit={handleSearch}>
          <FiSearch color="#8da4c8" size={14} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={`Searching: ${city}`} />
        </form>
        <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
      </nav>

      <div className="dashboard">
        {/* Main Panel */}
        <div className="main-panel">
          {error && <div className="error-msg">{error}</div>}

          {/* Hero */}
          <div className="hero-card">
            <div className="hero-content">
              <div className="hero-top">
                <span className="greeting">{greeting}, {user?.name?.split(' ')[0]} 👋</span>
                <div className="location-badge">
                  <FiMapPin size={12} />
                  {current?.name || city}, {current?.sys?.country || ''}
                </div>
              </div>
              <div className="hero-time">{timeStr}</div>
              <div className="hero-date">{dateStr}</div>
              <div className="hero-bottom">
                <div>
                  <div className="forecast-label">Weather Forecast</div>
                  <div className="forecast-condition">{weatherMain}</div>
                  <div className="forecast-detail">
                    {weatherDesc} · Humidity: {humidity}%
                  </div>
                </div>
                <div className="weather-icon-large">
                  {WEATHER_ICONS[weatherMain] || '🌤️'}
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Chart */}
          <HourlyForecast data={forecast?.list} />

          {/* Bottom Grid */}
          <div className="bottom-grid">
            <MonthlyRainfall />
            <div className="card">
              <div className="card-header">
                <span className="card-title">World Weather</span>
              </div>
              <WorldMap city={city} temp={temp} condition={weatherMain} />
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="side-panel">
          <div className="side-top">
  <button className="icon-btn" title="Notifications" onClick={() =>
    alert('🔔 No new notifications!')
  }><FiBell /></button>
  <button className="icon-btn" title="Settings" onClick={() =>
    alert('⚙️ Settings\n\nUnits: Celsius\nLocation: ' + city + '\nTheme: Dark')
  }><FiSettings /></button>
  <div className="avatar" title={user?.name} style={{ cursor: 'pointer' }}
    onClick={() => {
      const action = confirm('👤 ' + user?.name + '\n' + user?.email + '\n\nClick OK to logout');
      if (action) handleLogout();
    }}>
    {user?.name?.[0]?.toUpperCase() || 'U'}
  </div>
</div>

          <div className="current-temp">
            <div className="temp-icon">{WEATHER_ICONS[weatherMain] || '🌤️'}</div>
            <div className="temp-value">{temp}° C</div>
            <div className="temp-condition">{weatherMain}</div>
          </div>

          <div className="temp-stats">
            <div className="stat-row">
              <span className="dot" />
              💨 Wind
              <span>{wind} Km/h</span>
            </div>
            <div className="stat-row">
              <span className="dot" />
              💧 Humidity
              <span>{humidity}%</span>
            </div>
            <div className="stat-row">
              <span className="dot" />
              🌡️ Feels Like
              <span>{current ? Math.round(current.main.feels_like) : '--'}° C</span>
            </div>
          </div>

          <ForecastList data={forecast} />

          <nav className="side-nav">
  <button className="nav-btn active" title="Dashboard"><FiGrid /></button>
  <button className="nav-btn" title="Change City" onClick={() => {
    const city = prompt('Enter city name:');
    if (city) { setCity(city); }
  }}><FiMapPin /></button>
  <button className="nav-btn" title="Notifications" onClick={() => 
    alert('No new notifications!')
  }><FiBell /></button>
  <button className="nav-btn" title="Stats" onClick={() => 
    alert(`📊 Current Stats:\n🌡️ Temp: ${temp}°C\n💨 Wind: ${wind} km/h\n💧 Humidity: ${humidity}%`)
  }><FiBarChart2 /></button>
  <button className="nav-btn" title="Logout" onClick={handleLogout}><FiUser /></button>
</nav>
        </div>
      </div>
    </>
  );
}