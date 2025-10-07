import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface ScoreDistributionChartProps {
  data: Array<{
    scoreRange: string;
    count: number;
    percentage: number;
  }>;
}

export function ScoreDistributionChart({ data }: ScoreDistributionChartProps) {
  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Score Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="scoreRange" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`${value} assessments`, 'Count']}
            labelFormatter={(label: string) => `Score Range: ${label}`}
          />
          <Bar dataKey="count" fill="hsla(187.82608696,42.99065421%,41.96078431%,1)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface CompletionTrendChartProps {
  data: Array<{
    date: string;
    completed: number;
    started: number;
  }>;
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Completion Trends</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="started" 
            stroke="#94a3b8" 
            strokeWidth={2}
            name="Started"
          />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke="hsla(187.82608696,42.99065421%,41.96078431%,1)" 
            strokeWidth={2}
            name="Completed"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface RiskLevelPieChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function RiskLevelPieChart({ data }: RiskLevelPieChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Risk Level Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} assessments`, 'Count']} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: string;
  iconColor?: string;
}

export function MetricCard({ title, value, change, changeType = 'neutral', icon, iconColor }: MetricCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
          style={{ backgroundColor: iconColor ? `${iconColor}20` : 'hsla(187.82608696,42.99065421%,41.96078431%,0.1)' }}
        >
          <i 
            className={`${icon} text-2xl`}
            style={{ color: iconColor || 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}
          ></i>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${getChangeColor()}`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}