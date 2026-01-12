"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { UserActivityData } from '@/lib/analytics';

interface UserActivityChartProps {
  data: UserActivityData[];
}

export function UserActivityChart({ data }: UserActivityChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#888888" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#888888" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#000',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Area
            type="monotone"
            dataKey="logins"
            stroke="#ffffff"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorLogins)"
            name="Logins"
          />
          <Area
            type="monotone"
            dataKey="activeUsers"
            stroke="#888888"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorActive)"
            name="Active Users"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface WeeklyTrendChartProps {
  data: Array<{
    day: string;
    documents: number;
    users: number;
    meetings: number;
  }>;
}

export function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="day" stroke="#888" fontSize={12} />
          <YAxis stroke="#888" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#000',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Bar dataKey="documents" fill="#ffffff" name="Documents" radius={[4, 4, 0, 0]} />
          <Bar dataKey="users" fill="#888888" name="Users" radius={[4, 4, 0, 0]} />
          <Bar dataKey="meetings" fill="#444444" name="Meetings" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
