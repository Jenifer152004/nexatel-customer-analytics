
import React, { useState } from 'react';
import { ShieldCheck, Info, RefreshCw } from 'lucide-react';
import { predictChurn } from '../analyticsService';
import { ChurnPredictionResult } from '../types';

const ChurnPredictor: React.FC = () => {
  const [tenure, setTenure] = useState(12);
  const [monthlyCharges, setMonthlyCharges] = useState(70);
  const [contractType, setContractType] = useState('Month-to-month');
  const [usage, setUsage] = useState(100);
  const [prediction, setPrediction] = useState<ChurnPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const res = predictChurn(tenure, monthlyCharges, contractType);
      setPrediction(res);
      setLoading(false);
    }, 800);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  const getGaugeColor = (prob: number) => {
    if (prob > 70) return 'bg-red-500';
    if (prob > 40) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-teal-100 text-teal-700 rounded-2xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">Retention Risk Intelligence</h3>
            <p className="text-slate-500 text-sm">Real-time churn probability engine powered by Logistic Regression</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Tenure (Months)</label>
                  <span className="text-sm text-teal-600 font-bold">{tenure} months</span>
                </div>
                <input 
                  type="range" min="1" max="72" value={tenure} 
                  onChange={(e) => setTenure(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Monthly Charges ($)</label>
                  <span className="text-sm text-teal-600 font-bold">${monthlyCharges}</span>
                </div>
                <input 
                  type="range" min="20" max="150" value={monthlyCharges} 
                  onChange={(e) => setMonthlyCharges(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Contract Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Month-to-month', 'One year', 'Two year'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setContractType(type)}
                      className={`py-2 px-1 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                        contractType === type 
                        ? 'bg-teal-600 text-white border-teal-600' 
                        : 'bg-white text-slate-500 border-slate-200 hover:border-teal-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Usage (GB)</label>
                <input 
                  type="number" 
                  value={usage}
                  onChange={(e) => setUsage(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <button 
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-teal-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-70"
            >
              {loading ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                'Calculate Risk Probability'
              )}
            </button>
          </div>

          {/* Results Display */}
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            {!prediction && !loading ? (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Info className="text-slate-300" size={32} />
                </div>
                <p className="text-slate-400 text-sm font-medium">Configure parameters to see <br/>risk predictions</p>
              </div>
            ) : loading ? (
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Analyzing behavioral patterns...</p>
              </div>
            ) : (
              <div className="w-full text-center space-y-6">
                <div className="relative inline-block">
                  <svg className="w-48 h-48 -rotate-90">
                    <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                    <circle 
                      cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      className={prediction!.probability > 70 ? 'text-red-500' : prediction!.probability > 40 ? 'text-amber-500' : 'text-emerald-500'}
                      strokeDasharray={2 * Math.PI * 80}
                      strokeDashoffset={2 * Math.PI * 80 * (1 - prediction!.probability / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-800">{prediction!.probability}%</span>
                    <span className="text-xs font-bold text-slate-400 uppercase">Risk Level</span>
                  </div>
                </div>

                <div className={`py-3 px-6 rounded-2xl border font-black text-xl uppercase ${getRiskColor(prediction!.riskLevel)}`}>
                  {prediction!.riskLevel} RISK
                </div>

                <div className="text-left bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Recommended Strategy</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {prediction!.riskLevel === 'High' 
                      ? 'Immediate intervention required. Offer 12-month contract lock with 15% discount or loyalty upgrade.' 
                      : prediction!.riskLevel === 'Medium'
                      ? 'Add to monthly engagement newsletter. Send automated usage optimization tips via SMS.'
                      : 'Maintain current experience. Potential candidate for referral program or high-tier upgrade.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChurnPredictor;
