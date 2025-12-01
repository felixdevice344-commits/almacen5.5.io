export type ViewState = 'dashboard' | 'wip' | 'blackbox' | 'collector' | 'scrap';

export interface WipEntry {
  id: number;
  time: string;
  ot: string;
  stage: string;
  user: string;
  shift: string;
}

export interface IncidentEntry {
  id: number;
  time: string;
  type: 'PARO' | 'CRITICO';
  machine: string;
  description: string;
  shift: string;
}

export interface InventoryEntry {
  id: number;
  time: string;
  type: 'IN' | 'OUT';
  sku: string;
  qty: number;
  user: string;
  shift: string;
}

export interface ScrapEntry {
  id: number;
  time: string;
  material: string;
  weight: number;
  shift: string;
}

export interface AppState {
  wip: WipEntry[];
  incidents: IncidentEntry[];
  inventory: InventoryEntry[];
  scrap: ScrapEntry[];
}
