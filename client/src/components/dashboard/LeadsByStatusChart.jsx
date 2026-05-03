import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  NEW: '#94a3b8',
  CONTACTED: '#60a5fa',
  QUALIFIED: '#818cf8',
  PROPOSAL: '#a78bfa',
  WON: '#34d399',
  LOST: '#f87171',
};

export default function LeadsByStatusChart({ data = [] }) {
  const chartData = data.map((d) => ({ name: d.status, value: d.count }));
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip formatter={(val) => [val, 'Leads']} />
        <Legend iconType="circle" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}
