import React from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { WipModule, BlackBoxModule, InventoryModule, ScrapModule } from './components/Modules';

const ContentRenderer = () => {
  const { view } = useApp();

  switch (view) {
    case 'dashboard': return <Dashboard />;
    case 'wip': return <WipModule />;
    case 'blackbox': return <BlackBoxModule />;
    case 'collector': return <InventoryModule />;
    case 'scrap': return <ScrapModule />;
    default: return <Dashboard />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <ContentRenderer />
      </Layout>
    </AppProvider>
  );
}
