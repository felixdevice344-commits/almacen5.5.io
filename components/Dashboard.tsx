import React from 'react';
import { useApp } from '../store/AppContext';
import { CyberCard } from './ui/CyberUI';
import { Activity, AlertTriangle, Box, Trash2 } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const Dashboard = () => {
  const { state, setView } = useApp();

  // Aggregate Scrap Data for Chart
  const scrapData = state.scrap.reduce((acc, curr) => {
    const existing = acc.find(i => i.name === curr.material);
    if (existing) existing.value += curr.weight;
    else acc.push({ name: curr.material, value: curr.weight });
    return acc;
  }, [] as { name: string; value: number }[]);

  // Mock Activity Data (since we don't have historical timestamps for a real timeline in this session)
  const activityData = [
    { name: '08:00', wip: 4, incidents: 0 },
    { name: '10:00', wip: 12, incidents: 1 },
    { name: '12:00', wip: 8, incidents: 0 },
    { name: '14:00', wip: 15, incidents: 2 },
    { name: '16:00', wip: 20, incidents: 0 },
  ];

  const COLORS = ['#00f0ff', '#fcee0a', '#bc13fe', '#00ff9f'];

  return (
    <div className="h-full flex flex-col gap-6 animate-[fadeIn_0.5s_ease-out]">
      <h2 className="text-3xl font-bold text-white tracking-widest uppercase mb-2">Command Center</h2>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CyberCard 
          variant="purple" 
          title="PRODUCTION" 
          className="cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setView('wip')}
        >
          <div className="flex justify-between items-end">
            <Activity size={32} className="opacity-80" />
            <span className="text-4xl font-mono font-bold text-white">{state.wip.length}</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">Active Orders</div>
        </CyberCard>

        <CyberCard 
          variant="red" 
          title="ALERTS" 
          className="cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setView('blackbox')}
        >
          <div className="flex justify-between items-end">
            <AlertTriangle size={32} className="opacity-80" />
            <span className="text-4xl font-mono font-bold text-white">{state.incidents.length}</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">Systems Critical</div>
        </CyberCard>

        <CyberCard 
          variant="cyan" 
          title="LOGISTICS" 
          className="cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setView('collector')}
        >
          <div className="flex justify-between items-end">
            <Box size={32} className="opacity-80" />
            <span className="text-4xl font-mono font-bold text-white">{state.inventory.length}</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">Movements</div>
        </CyberCard>

        <CyberCard 
          variant="yellow" 
          title="SCRAP" 
          className="cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setView('scrap')}
        >
          <div className="flex justify-between items-end">
            <Trash2 size={32} className="opacity-80" />
            <span className="text-4xl font-mono font-bold text-white">{state.scrap.length}</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">Entries</div>
        </CyberCard>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow min-h-[300px]">
        
        {/* Main Trend Chart */}
        <CyberCard variant="cyan" title="SYSTEM ACTIVITY" className="lg:col-span-2 flex flex-col">
          <div className="flex-grow w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorWip" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff003c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#666', fontSize: 10}} />
                <YAxis stroke="#666" tick={{fill: '#666', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #00f0ff', color: '#fff' }}
                  itemStyle={{ fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="wip" stroke="#bc13fe" fillOpacity={1} fill="url(#colorWip)" />
                <Area type="monotone" dataKey="incidents" stroke="#ff003c" fillOpacity={1} fill="url(#colorInc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CyberCard>

        {/* Scrap Distribution */}
        <CyberCard variant="yellow" title="SCRAP COMPOSITION" className="flex flex-col">
          <div className="flex-grow w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scrapData.length > 0 ? scrapData : [{name: 'Empty', value: 1}]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {scrapData.length > 0 ? scrapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  )) : <Cell fill="#333" />}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #fcee0a', color: '#fff' }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center text-xs text-gray-500 font-mono mt-2">
              TOTAL WEIGHT: {state.scrap.reduce((a,b)=>a+b.weight,0).toFixed(2)} KG
            </div>
          </div>
        </CyberCard>
      </div>
    </div>
  );
};