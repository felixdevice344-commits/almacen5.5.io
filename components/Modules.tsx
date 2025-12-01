import React, { useState } from 'react';
import { Activity, AlertTriangle, Box, Trash2, CheckCircle, Crosshair } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CyberButton, CyberCard, CyberInput, CyberSelect } from './ui/CyberUI';
import { useSound } from '../hooks/useSound';

// --- WIP MODULE ---
export const WipModule = () => {
  const { state, addWip } = useApp();
  const { playSuccess, playError } = useSound();
  const [ot, setOt] = useState('');
  const [user, setUser] = useState('');
  const [stage, setStage] = useState('10-CUT');

  const handleSubmit = () => {
    if (!ot || !user) {
      playError();
      return;
    }
    addWip({ ot: ot.toUpperCase(), user: user.toUpperCase(), stage });
    playSuccess();
    setOt('');
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-cyber-purple flex items-center gap-3">
          <Activity className="animate-pulse" /> PRODUCTION ROUTE
        </h2>
      </div>

      <CyberCard variant="purple" className="shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="text-xs text-cyber-purple/70 mb-1 block">WORK ORDER</label>
            <CyberInput value={ot} onChange={(e) => setOt(e.target.value)} placeholder="OT-XXXX" autoFocus />
          </div>
          <div className="md:col-span-1">
            <label className="text-xs text-cyber-purple/70 mb-1 block">STAGE</label>
            <CyberSelect value={stage} onChange={(e) => setStage(e.target.value)}>
              <option value="10-CUT">10 - CUTTING</option>
              <option value="20-CNC">20 - CNC LATHE</option>
              <option value="30-MILL">30 - MILLING</option>
              <option value="40-QA">40 - QUALITY</option>
              <option value="50-PACK">50 - PACKING</option>
            </CyberSelect>
          </div>
          <div className="md:col-span-1">
            <label className="text-xs text-cyber-purple/70 mb-1 block">OPERATOR</label>
            <CyberInput value={user} onChange={(e) => setUser(e.target.value)} placeholder="ID" />
          </div>
          <CyberButton variant="purple" onClick={handleSubmit}>REGISTER ENTRY</CyberButton>
        </div>
      </CyberCard>

      <div className="flex-grow overflow-auto border border-white/10 bg-black/40 p-4 relative">
         {/* Decorative grid lines */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(188,19,254,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(188,19,254,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
         
        <table className="w-full text-left border-collapse relative z-10">
          <thead>
            <tr className="text-cyber-purple border-b border-cyber-purple/30 text-xs uppercase tracking-wider">
              <th className="p-3">Time</th>
              <th className="p-3">OT</th>
              <th className="p-3">Stage</th>
              <th className="p-3">Operator</th>
              <th className="p-3">Shift</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {state.wip.map((row) => (
              <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-3 text-gray-400">{row.time}</td>
                <td className="p-3 text-cyber-purple font-bold">{row.ot}</td>
                <td className="p-3">{row.stage}</td>
                <td className="p-3">{row.user}</td>
                <td className="p-3 text-xs text-gray-500">{row.shift}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- BLACKBOX MODULE ---
export const BlackBoxModule = () => {
  const { state, addIncident, panicMode, setPanicMode } = useApp();
  const { playAlert, playSuccess } = useSound();
  const [machine, setMachine] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'PARO' | 'CRITICO'>('PARO');

  const handleSubmit = () => {
    if (!machine || !desc) return;
    addIncident({ machine: machine.toUpperCase(), description: desc, type });
    if (type === 'CRITICO') {
      playAlert();
      setPanicMode(true);
      // Auto disable panic after 5s for UX, but state remains
      setTimeout(() => setPanicMode(false), 5000);
    } else {
      playSuccess();
    }
    setDesc('');
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-cyber-red flex items-center gap-3">
          <AlertTriangle className={panicMode ? 'animate-bounce' : ''} /> BLACKBOX
        </h2>
        
        <CyberCard variant="red" title="INCIDENT REPORT" className="flex-grow flex flex-col gap-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setType('PARO')}
              className={`flex-1 p-3 border text-xs font-bold transition-all ${type === 'PARO' ? 'bg-cyber-yellow text-black border-cyber-yellow' : 'border-white/20 text-gray-500'}`}
            >
              TECHNICAL STOP
            </button>
            <button 
              onClick={() => setType('CRITICO')}
              className={`flex-1 p-3 border text-xs font-bold transition-all ${type === 'CRITICO' ? 'bg-cyber-red text-black border-cyber-red animate-pulse' : 'border-white/20 text-gray-500'}`}
            >
              CRITICAL FAIL
            </button>
          </div>
          
          <div>
            <label className="text-xs text-cyber-red/70 mb-1 block">MACHINE ID</label>
            <CyberInput value={machine} onChange={(e) => setMachine(e.target.value)} placeholder="M-01" />
          </div>
          
          <div className="flex-grow">
            <label className="text-xs text-cyber-red/70 mb-1 block">DESCRIPTION</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full h-full min-h-[100px] bg-black border border-white/20 text-cyber-red font-mono p-3 focus:border-cyber-red focus:outline-none resize-none"
              placeholder="Detail the incident..."
            />
          </div>

          <CyberButton variant="red" onClick={handleSubmit} className="w-full py-4">BROADCAST ALERT</CyberButton>
        </CyberCard>
      </div>

      <div className="w-full md:w-2/3 overflow-auto border-t-2 border-cyber-red bg-black/40">
        <table className="w-full text-left font-mono text-sm">
          <thead className="bg-cyber-red/10">
            <tr>
              <th className="p-3 text-cyber-red">TIME</th>
              <th className="p-3 text-cyber-red">TYPE</th>
              <th className="p-3 text-cyber-red">UNIT</th>
              <th className="p-3 text-cyber-red">LOG</th>
            </tr>
          </thead>
          <tbody>
            {state.incidents.map((log) => (
              <tr key={log.id} className="border-b border-white/5 hover:bg-cyber-red/5">
                <td className="p-3 text-gray-500">{log.time}</td>
                <td className={`p-3 font-bold ${log.type === 'CRITICO' ? 'text-cyber-red animate-pulse' : 'text-cyber-yellow'}`}>{log.type}</td>
                <td className="p-3 text-white">{log.machine}</td>
                <td className="p-3 text-gray-400">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- INVENTORY MODULE ---
export const InventoryModule = () => {
  const { state, addInventory } = useApp();
  const { playSuccess, playError } = useSound();
  const [sku, setSku] = useState('');
  const [qty, setQty] = useState(1);
  const [type, setType] = useState<'IN' | 'OUT'>('OUT');

  const handleSubmit = () => {
    if (!sku) { playError(); return; }
    addInventory({ sku: sku.toUpperCase(), qty, type, user: 'GUEST' });
    playSuccess();
    setSku('');
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-cyber-cyan flex items-center gap-3">
          <Box /> DATA NODE COLLECTOR
        </h2>
      </div>

      <CyberCard variant="cyan" className="shrink-0">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-32">
            <label className="text-xs text-cyber-cyan/70 mb-1 block">OPERATION</label>
            <CyberSelect value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="OUT">OUTPUT</option>
              <option value="IN">INPUT</option>
            </CyberSelect>
          </div>
          <div className="flex-grow min-w-[200px]">
            <label className="text-xs text-cyber-cyan/70 mb-1 block">SKU / BARCODE</label>
            <div className="relative">
              <CyberInput value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SCAN SKU..." autoFocus />
              <Crosshair className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-cyan opacity-50" size={16} />
            </div>
          </div>
          <div className="w-24">
             <label className="text-xs text-cyber-cyan/70 mb-1 block">QTY</label>
             <CyberInput type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          </div>
          <CyberButton variant="cyan" onClick={handleSubmit} className="w-32">EXECUTE</CyberButton>
        </div>
      </CyberCard>

      <div className="flex-grow overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {state.inventory.map((item) => (
            <div key={item.id} className="bg-black/40 border border-white/10 p-3 flex justify-between items-center hover:border-cyber-cyan/50 transition-colors group">
              <div>
                <div className={`text-xs font-bold ${item.type === 'IN' ? 'text-cyber-green' : 'text-cyber-cyan'}`}>
                  {item.type === 'IN' ? '>>> RECEPTION' : '<<< DISPATCH'}
                </div>
                <div className="text-lg font-mono text-white">{item.sku}</div>
                <div className="text-xs text-gray-500">{item.time}</div>
              </div>
              <div className="text-2xl font-mono font-bold text-white/80 group-hover:text-cyber-cyan">
                {item.qty}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- SCRAP MODULE ---
export const ScrapModule = () => {
  const { state, addScrap } = useApp();
  const { playSuccess, playError } = useSound();
  const [material, setMaterial] = useState('STEEL');
  const [weight, setWeight] = useState('');

  const handleSubmit = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) { playError(); return; }
    addScrap({ material, weight: w });
    playSuccess();
    setWeight('');
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full md:w-1/3">
        <h2 className="text-2xl font-bold text-cyber-yellow mb-4 flex items-center gap-3">
          <Trash2 /> SCRAP DOCK
        </h2>
        <CyberCard variant="yellow" title="WEIGHING STATION">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-cyber-yellow/70 mb-1 block">MATERIAL TYPE</label>
              <CyberSelect value={material} onChange={(e) => setMaterial(e.target.value)}>
                <option value="STEEL">STEEL</option>
                <option value="ALUMINUM">ALUMINUM</option>
                <option value="COPPER">COPPER</option>
                <option value="PLASTIC">PLASTIC</option>
              </CyberSelect>
            </div>
            <div>
              <label className="text-xs text-cyber-yellow/70 mb-1 block">WEIGHT (KG)</label>
              <CyberInput type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.00" />
            </div>
            <CyberButton variant="yellow" onClick={handleSubmit} className="w-full">LOG WASTE</CyberButton>
          </div>
        </CyberCard>
      </div>

      <div className="w-full md:w-2/3">
        <div className="h-full border border-cyber-yellow/20 bg-black/40 p-4">
           <table className="w-full text-left">
             <thead className="text-cyber-yellow border-b border-cyber-yellow/30">
               <tr>
                 <th className="p-2">TIME</th>
                 <th className="p-2">MATERIAL</th>
                 <th className="p-2 text-right">WEIGHT</th>
               </tr>
             </thead>
             <tbody className="font-mono">
               {state.scrap.map(item => (
                 <tr key={item.id} className="border-b border-white/5">
                   <td className="p-3 text-gray-500 text-sm">{item.time}</td>
                   <td className="p-3 text-white">{item.material}</td>
                   <td className="p-3 text-right text-cyber-yellow font-bold">{item.weight.toFixed(2)} kg</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};
