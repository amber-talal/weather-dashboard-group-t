import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MOCK_RAIN = [
  { m: '0', rain: 30, sun: 45 }, { m: '1', rain: 25, sun: 50 },
  { m: '2', rain: 45, sun: 35 }, { m: '3', rain: 20, sun: 60 },
  { m: '4', rain: 55, sun: 30 }, { m: '5', rain: 35, sun: 55 },
  { m: '6', rain: 40, sun: 40 }, { m: '7', rain: 60, sun: 25 },
  { m: '8', rain: 30, sun: 50 },
];

export default function MonthlyRainfall() {
  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Monthly Rainfall</span>
      </div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={MOCK_RAIN} barGap={2}>
          <XAxis dataKey="m" tick={{ fill: '#8da4c8', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip contentStyle={{ background: '#1a3260', border: 'none', borderRadius: 8, fontSize: 11 }} />
          <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#8da4c8' }} />
          <Bar dataKey="rain" fill="#2563eb" radius={[3,3,0,0]} name="Rain" />
          <Bar dataKey="sun" fill="rgba(74,144,217,0.3)" radius={[3,3,0,0]} name="Sun" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}