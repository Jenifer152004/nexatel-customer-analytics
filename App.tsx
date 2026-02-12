
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  PieChart as PieChartIcon, 
  Settings, 
  LogOut, 
  Search,
  AlertTriangle,
  FileDown,
  Upload,
  Database
} from 'lucide-react';
import Login from './components/Login';
import DashboardOverview from './components/DashboardOverview';
import ChurnPredictor from './components/ChurnPredictor';
import SegmentationView from './components/SegmentationView';
import CLVAnalysis from './components/CLVAnalysis';
import CustomerExplorer from './components/CustomerExplorer';
import { User, Customer } from './types';
import { generateMockData } from './mockData';
import { exportCustomersToCSV, parseCSV } from './analyticsService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const mockData = generateMockData(800);
    setData(mockData);
  }, []);

  const handleLogin = (email: string) => {
    setUser({
      email,
      role: email.includes('admin') ? 'ADMIN' as any : 'VIEWER' as any,
      isAuthenticated: true
    });
  };

  const handleLogout = () => setUser(null);
  const handleExport = () => exportCustomersToCSV(data);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedData = parseCSV(text);
      if (parsedData.length > 0) {
        setData(parsedData);
        alert(`Successfully imported ${parsedData.length} customers!`);
      } else {
        alert("Could not parse CSV. Please ensure headers match the export format.");
      }
    };
    reader.readAsText(file);
  };

  const filteredData = data.filter(c => 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.segment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col transition-all duration-300">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-xl">N</div>
          <div>
            <h1 className="font-bold text-lg leading-tight">NexaTel</h1>
            <p className="text-[10px] text-teal-400 uppercase tracking-widest font-semibold">Analytics Suite</p>
          </div>
        </div>

        <nav className="flex-1 mt-6">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Database size={20} />} label="Customer Explorer" active={activeTab === 'explorer'} onClick={() => setActiveTab('explorer')} />
          <SidebarItem icon={<PieChartIcon size={20} />} label="Segmentation" active={activeTab === 'segmentation'} onClick={() => setActiveTab('segmentation')} />
          <SidebarItem icon={<AlertTriangle size={20} />} label="Churn Prediction" active={activeTab === 'churn'} onClick={() => setActiveTab('churn')} />
          <SidebarItem icon={<Users size={20} />} label="CLV Analysis" active={activeTab === 'clv'} onClick={() => setActiveTab('clv')} />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">AD</div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.email}</p>
              <p className="text-[10px] text-slate-400 uppercase">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full text-left text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search ID or Segment..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-teal-500 w-64 transition-all"
              />
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-bold hover:bg-slate-200 transition-all"
            >
              <Upload size={18} />
              <span>Import CSV</span>
            </button>

            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-bold hover:bg-teal-100 transition-all">
              <FileDown size={18} />
              <span>Export CSV</span>
            </button>

            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardOverview data={filteredData} onViewAll={() => setActiveTab('explorer')} />}
          {activeTab === 'explorer' && <CustomerExplorer data={filteredData} />}
          {activeTab === 'segmentation' && <SegmentationView data={filteredData} />}
          {activeTab === 'churn' && <ChurnPredictor />}
          {activeTab === 'clv' && <CLVAnalysis data={filteredData} />}
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all ${active ? 'text-white border-r-4 border-teal-500 bg-teal-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    {icon}
    {label}
  </button>
);

export default App;
