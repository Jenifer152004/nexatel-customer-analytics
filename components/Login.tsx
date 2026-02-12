
import React, { useState } from 'react';
import { Lock, Mail, ChevronRight } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate credentials (admin@nexatel.com / admin123)
    if (email === 'admin@nexatel.com' && password === 'admin123') {
      onLogin(email);
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-teal-500/20 mb-6">
            <span className="text-white text-3xl font-bold">N</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NexaTel Analytics</h1>
          <p className="text-teal-400/80">Turning Customer Data into Retention Strategy</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-900"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-slate-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              Sign In to Dashboard
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-xs">
          &copy; 2024 NexaTel Analytics Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
