
import React from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Customer } from '../types';
import { COLORS, SEGMENTS } from '../constants.tsx';

interface Props {
  data: Customer[];
}

const SegmentationView: React.FC<Props> = ({ data }) => {
  // Prep data for scatter plot: Monthly Charges vs Tenure, colored by Segment
  const getSegmentData = (segmentName: string) => {
    return data
      .filter(c => c.segment === segmentName)
      .slice(0, 100) // Limit for visualization performance
      .map(c => ({
        x: c.tenure,
        y: c.monthlyCharges,
        z: c.totalCharges / 100,
        id: c.id
      }));
  };

  const chartData = [
    { name: SEGMENTS.CHAMPIONS, data: getSegmentData(SEGMENTS.CHAMPIONS), color: COLORS.chartColors[0] },
    { name: SEGMENTS.LOYAL, data: getSegmentData(SEGMENTS.LOYAL), color: COLORS.chartColors[1] },
    { name: SEGMENTS.AT_RISK, data: getSegmentData(SEGMENTS.AT_RISK), color: COLORS.chartColors[2] },
    { name: SEGMENTS.LOST, data: getSegmentData(SEGMENTS.LOST), color: COLORS.chartColors[3] },
    { name: SEGMENTS.BIG_SPENDERS, data: getSegmentData(SEGMENTS.BIG_SPENDERS), color: COLORS.chartColors[4] },
  ];

  const pieData = chartData.map(c => ({
    name: c.name,
    value: data.filter(d => d.segment === c.name).length
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Cluster Visualization */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-800">Behavioral Clusters (K-Means)</h3>
            <p className="text-sm text-slate-400">Tenure vs. Monthly Spend Analysis</p>
          </div>
          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" dataKey="x" name="Tenure" unit="mo" axisLine={false} tickLine={false} />
                <YAxis type="number" dataKey="y" name="Monthly" unit="$" axisLine={false} tickLine={false} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Total Spend" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Legend iconType="circle" />
                {chartData.map((s) => (
                  <Scatter key={s.name} name={s.name} data={s.data} fill={s.color} fillOpacity={0.6} />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Proportions */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Market Share</h3>
          <div className="h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.chartColors[index % COLORS.chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            {pieData.map((p, idx) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS.chartColors[idx % COLORS.chartColors.length]}}></div>
                  <span className="text-sm font-medium text-slate-600">{p.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{Math.round((p.value / data.length) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Segment Strategy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StrategyCard 
          title="Champions" 
          desc="Highly loyal, high spending customers." 
          strategy="Loyalty programs, beta access, referral rewards."
          color="teal"
        />
        <StrategyCard 
          title="Big Spenders" 
          desc="Highest monthly ARPU, often high data users." 
          strategy="Upsell to family plans, high-speed data add-ons."
          color="blue"
        />
        <StrategyCard 
          title="At Risk" 
          desc="Showing signs of activity drops or nearing end of contract." 
          strategy="Retargeting ads, proactive outreach, contract renewal bonus."
          color="amber"
        />
      </div>
    </div>
  );
};

const StrategyCard = ({ title, desc, strategy, color }: any) => {
  const colorMap: any = {
    teal: 'bg-teal-50 border-teal-100 text-teal-800',
    blue: 'bg-blue-50 border-blue-100 text-blue-800',
    amber: 'bg-amber-50 border-amber-100 text-amber-800'
  };
  return (
    <div className={`p-6 rounded-2xl border ${colorMap[color]} h-full`}>
      <h4 className="font-bold text-lg mb-2">{title}</h4>
      <p className="text-sm opacity-80 mb-4">{desc}</p>
      <div className="bg-white/50 p-3 rounded-xl">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60">Action Plan</p>
        <p className="text-sm font-medium">{strategy}</p>
      </div>
    </div>
  );
};

export default SegmentationView;
