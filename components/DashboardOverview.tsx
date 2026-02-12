
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserMinus, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Customer } from '../types';
import { calculateDashboardStats, generateTrendData } from '../analyticsService';
import { COLORS } from '../constants.tsx';

interface Props {
  data: Customer[];
  onViewAll: () => void;
}

const DashboardOverview: React.FC<Props> = ({ data, onViewAll }) => {
  const [timeframe, setTimeframe] = useState(6);
  const stats = calculateDashboardStats(data);

  // Generate trend data based on selected timeframe (6 or 12 months)
  const trendData = useMemo(() => generateTrendData(data, timeframe), [data, timeframe]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Total Customers" value={stats.total.toLocaleString()} icon={<Users className="text-teal-600" size={24} />} trend="+12%" trendType="up" />
        <KPICard title="Churn Rate" value={`${stats.churnRate}%`} icon={<UserMinus className="text-red-500" size={24} />} trend="-2.4%" trendType="down" />
        <KPICard title="Avg. CLV" value={`$${stats.avgClv}`} icon={<DollarSign className="text-blue-500" size={24} />} trend="+5.1%" trendType="up" />
        <KPICard title="Active Users" value={stats.active.toLocaleString()} icon={<Activity className="text-emerald-500" size={24} />} trend="+8.2%" trendType="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Customer Growth Trend</h3>
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-1 outline-none cursor-pointer"
            >
              <option value={6}>Last 6 Months</option>
              <option value={12}>Last Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="active" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Churn Incidence</h3>
            <span className="text-xs text-slate-400">Monthly breakdown</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="churned" fill={COLORS.danger} radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Top Revenue Customers</h3>
          <button 
            onClick={onViewAll}
            className="text-teal-600 text-sm font-semibold hover:underline"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Customer ID</th>
                <th className="px-6 py-4 font-bold">Tenure</th>
                <th className="px-6 py-4 font-bold">Monthly Charges</th>
                <th className="px-6 py-4 font-bold">Contract</th>
                <th className="px-6 py-4 font-bold">Segment</th>
                <th className="px-6 py-4 font-bold text-right">Total Charges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.sort((a, b) => b.totalCharges - a.totalCharges).slice(0, 5).map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700">{customer.id}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{customer.tenure} mo</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">${customer.monthlyCharges}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">{customer.contract}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-md text-[10px] font-bold uppercase">{customer.segment}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">${customer.totalCharges.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon, trend, trendType }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendType === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
        {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <h4 className="text-slate-500 text-sm font-medium">{title}</h4>
    <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
  </div>
);

export default DashboardOverview;
