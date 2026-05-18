import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#1a3260', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem' }}>
        <p>{payload[0].value}°C</p>
      </div>
    );
  }
  return null;
};

export default function HourlyForecast({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = data.slice(0, 9).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(item.main.temp),
  }));

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Hourly Forecast</span>
        <select className="select-pill">
          <option>Today</option>
          <option>Tomorrow</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="time" tick={{ fill: '#8da4c8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8da4c8', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}°`} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="temp" stroke="#4a90d9" strokeWidth={2.5}
            dot={{ fill: '#4a90d9', r: 4 }} activeDot={{ r: 6, fill: '#5ba3f5' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}