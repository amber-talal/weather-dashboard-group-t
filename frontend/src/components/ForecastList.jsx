const ICONS = {
  Clear: '☀️', Clouds: '⛅', Rain: '🌧️', Drizzle: '🌦️',
  Thunderstorm: '⛈️', Snow: '❄️', Mist: '🌫️',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function ForecastList({ data }) {
  if (!data) return null;

  // Get one reading per day (at noon)
  const dailyMap = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const key = date.toDateString();
    const hour = date.getHours();
    if (!dailyMap[key] || Math.abs(hour - 12) < Math.abs(new Date(dailyMap[key].dt * 1000).getHours() - 12)) {
      dailyMap[key] = item;
    }
  });

  const days = Object.values(dailyMap).slice(1, 6); // next 5 days

  return (
    <div className="forecast-section">
      <h3>
        Weather Forecast
        <div className="forecast-tabs">
          <button className="tab active">4 Days</button>
          <button className="tab">15 Days</button>
        </div>
      </h3>
      {days.slice(0, 4).map(item => {
        const date = new Date(item.dt * 1000);
        const main = item.weather[0].main;
        return (
          <div className="forecast-item" key={item.dt}>
            <span className="f-icon">{ICONS[main] || '🌤️'}</span>
            <div className="f-info">
              <div className="f-day">
                {DAYS[date.getDay()]}, {MONTHS[date.getMonth()]} {date.getDate()}
              </div>
              <div className="f-cond">{item.weather[0].description}</div>
            </div>
            <span className="f-temp">{Math.round(item.main.temp)}° C</span>
          </div>
        );
      })}
    </div>
  );
}