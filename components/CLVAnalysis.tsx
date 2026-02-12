
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line
} from 'recharts';
import { Customer } from '../types';
import { COLORS } from '../constants.tsx';

interface Props {
  data: Customer[];
}

const CLVAnalysis: React.FC<Props> = ({ data }) => {
  // CLV Distribution groups
  const distributionData = [
    { range: '$0-500', count: data.filter(c => c.clv < 500).length },
    { range: '$500-1k', count: data.filter(c => c.clv >= 500 && c.clv < 1000).length },
    { range: '$1k-2k', count: data.filter(c => c.clv >= 1000 && c.clv < 2000).length },
    { range: '$2k-3k', count: data.filter(c => c.clv >= 2000 && c.clv < 3000).length },
    { range: '$3k+', count: data.filter(c => c.clv >= 3000).length },
  ];

  // Mock revenue vs retention curve
  const curveData = Array.from({length: 12}, (_, i) => ({
    month: i + 1,
    revenue: 50000 + (Math.sin(i) * 5000),
    retention: 98 - (i * 0.5)
  }));

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CLV Distribution */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">CLV Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CLV vs Retention Curve */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Revenue vs. Retention Curve</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={curveData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} domain={[90, 100]} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                <Area yAxisId="left" type="monotone" dataKey="revenue" fill={COLORS.primary} stroke={COLORS.primary} fillOpacity={0.1} />
                <Line yAxisId="right" type="monotone" dataKey="retention" stroke={COLORS.danger} strokeWidth={3} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-slate-400 text-center italic">Correlation between monthly revenue stream and customer survival probability.</p>
        </div>
      </div>

      {/* CLV Segment Table */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">High Lifetime Value Targets</h3>
            <p className="text-sm text-slate-500">Customers with CLV &gt; $2,500</p>
          </div>
          <button className="bg-teal-50 text-teal-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-teal-100 transition-colors">Export Segment</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="pb-4 font-bold">Customer</th>
                <th className="pb-4 font-bold">Total Tenure</th>
                <th className="pb-4 font-bold">Usage Profile</th>
                <th className="pb-4 font-bold">Churn Risk</th>
                <th className="pb-4 font-bold text-right">Projected CLV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.filter(c => c.clv > 2500).slice(0, 6).map(customer => (
                <tr key={customer.id} className="group hover:bg-slate-50 transition-all">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">{customer.id.slice(-2)}</div>
                      <span className="font-bold text-slate-800">{customer.id}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-slate-600">{customer.tenure} Months</td>
                  <td className="py-4">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{width: `${(customer.usageGB / 510) * 100}%`}}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{customer.usageGB}GB / Month</span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${customer.churn ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {customer.churn ? 'At Risk' : 'Healthy'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <span className="text-slate-900 font-black">${customer.clv.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CLVAnalysis;
