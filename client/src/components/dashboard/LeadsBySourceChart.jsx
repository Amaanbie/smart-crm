import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

const BAR_COLOR = '#3b82f6';

export default function LeadsBySourceChart({ data = [] }) {
  const chartData = data.map((d) => ({ name: d.source, value: d.count }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
        <Tooltip formatter={(val) => [val, 'Leads']} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} fill={BAR_COLOR}>
          {chartData.map((entry, idx) => (
            <Cell key={idx} fill={BAR_COLOR} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
