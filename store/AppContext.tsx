import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, IncidentEntry, InventoryEntry, ScrapEntry, ViewState, WipEntry } from '../types';

interface AppContextType {
  view: ViewState;
  setView: (v: ViewState) => void;
  shift: string;
  time: string;
  panicMode: boolean;
  setPanicMode: (active: boolean) => void;
  state: AppState;
  addWip: (entry: Omit<WipEntry, 'id' | 'time' | 'shift'>) => void;
  addIncident: (entry: Omit<IncidentEntry, 'id' | 'time' | 'shift'>) => void;
  addInventory: (entry: Omit<InventoryEntry, 'id' | 'time' | 'shift'>) => void;
  addScrap: (entry: Omit<ScrapEntry, 'id' | 'time' | 'shift'>) => void;
  exportData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [shift, setShift] = useState('T1');
  const [panicMode, setPanicMode] = useState(false);
  
  // Load initial state
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('device_os_v5');
    return saved ? JSON.parse(saved) : { wip: [], incidents: [], inventory: [], scrap: [] };
  });

  // Clock & Shift Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      const h = now.getHours();
      let currentShift = 'T3 (NIGHT)';
      if (h >= 6 && h < 14) currentShift = 'T1 (MORNING)';
      else if (h >= 14 && h < 22) currentShift = 'T2 (AFTERNOON)';
      setShift(currentShift);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('device_os_v5', JSON.stringify(state));
  }, [state]);

  const addWip = (entry: Omit<WipEntry, 'id' | 'time' | 'shift'>) => {
    const newEntry: WipEntry = { ...entry, id: Date.now(), time: new Date().toLocaleTimeString(), shift };
    setState(prev => ({ ...prev, wip: [newEntry, ...prev.wip] }));
  };

  const addIncident = (entry: Omit<IncidentEntry, 'id' | 'time' | 'shift'>) => {
    const newEntry: IncidentEntry = { ...entry, id: Date.now(), time: new Date().toLocaleTimeString(), shift };
    setState(prev => ({ ...prev, incidents: [newEntry, ...prev.incidents] }));
  };

  const addInventory = (entry: Omit<InventoryEntry, 'id' | 'time' | 'shift'>) => {
    const newEntry: InventoryEntry = { ...entry, id: Date.now(), time: new Date().toLocaleTimeString(), shift };
    setState(prev => ({ ...prev, inventory: [newEntry, ...prev.inventory] }));
  };

  const addScrap = (entry: Omit<ScrapEntry, 'id' | 'time' | 'shift'>) => {
    const newEntry: ScrapEntry = { ...entry, id: Date.now(), time: new Date().toLocaleTimeString(), shift };
    setState(prev => ({ ...prev, scrap: [newEntry, ...prev.scrap] }));
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `device_os_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <AppContext.Provider value={{ 
      view, setView, shift, time, panicMode, setPanicMode, 
      state, addWip, addIncident, addInventory, addScrap, exportData 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
